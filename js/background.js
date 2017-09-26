/**
 * CryptoStop
 **
 * @author      Georgi Georgiev <RSO.BG>
 * @license     MIT
 * @source      https://github.com/the-veloper/CryptoStop
 */
 
const blacklist = 'https://raw.githubusercontent.com/the-veloper/CryptoStop/dev/blacklist.txt';
fetch(blacklist)
    .then(resp => {
        if (resp.status !== 200) {
            throw 'HTTP Error';
        }

        resp.text().then((text) => {
            if (text === '') {
                throw 'Empty response';
            }

            update(text);
        });
    })
    .catch(err => {
        fallBackUpdate();
    });

// Defaults
const defaultConfig = {
    toggle: true,
    whitelist: [],
};

const localConfig = JSON.parse(localStorage.getItem('config'));
let config = {
    ...defaultConfig,
    ...localConfig,
};

/**
 * Variables
 */
let domains = [];
let blackURLs = [];
let blackPatterns = [];

/**
 * Functions
 */
 
const update = (text) => {
	lists = text.split(';');
    blackURLs = lists[0].split('\n');
};

const fallBackUpdate = () => {
    fetch(chrome.runtime.getURL('blacklist.txt'))
        .then(resp => {
            resp.text().then(text => update(text));
        });
};

const saveConfig = () => {
    localStorage.setItem('config', JSON.stringify(config));
};

const isDomainWhitelisted = (domain) => {
    if (!domain) return false;

    const domainInfo = config.whitelist.find(w => w.domain === domain);

    if (domainInfo) {
        return true;
    }

    return false;
};

const addDomainToWhitelist = (domain) => {
    if (!domain) return;

    // Make sure the domain is not already whitelisted before adding it
    if (!isDomainWhitelisted(domain)) {
        config.whitelist = [
            ...config.whitelist,
            {
                domain: domain
            },
        ];
    }
};

const removeDomainFromWhitelist = (domain) => {
    if (!domain) return;

    config.whitelist = config.whitelist.filter(w => w.domain !== domain);
};

const wildCompareNew = (string, search) => {
    var startIndex = 0, array = search.split('*');
    for (var i = 0; i < array.length; i++) {
        var index = string.indexOf(array[i], startIndex);
        if (index == -1) return false;
        else startIndex = index;
    }
    return true;
}

const isBlackListedPattern = (text) => {
	return false;
}

const isBlackListedURL = (url) => {
  for (var i = 0; i < blackURLs.length; i++) {
	if (wildCompareNew(url, blackURLs[i])) return true;
  }
  return false;
}

chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
			if (config.toggle) {
				for(burl in blackURLs) {
				  if (isBlackListedURL(details.url, blackURLs[burl])) return {cancel: true};
				}
			}
        },
        {urls: ["<all_urls>"]},
        ["blocking"]);

// Communication with the popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'TOGGLE':
            config.toggle = !config.toggle;
            saveConfig();
            sendResponse(config.toggle);
            break;
		case 'GET_STATE':
			sendResponse({ toggle: config.toggle });
			break;
	}
});