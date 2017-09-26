/**
 * CryptoStop
 **
 * @author      Georgi Georgiev <RSO.BG>
 * @license     MIT
 * @source      https://github.com/the-veloper/CryptoStop
 */

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

/**
 * Functions
 */
const saveConfig = () => {
    localStorage.setItem('config', JSON.stringify(config));
};

const getDomain = (url) => {
    const match = url.match(/:\/\/(.[^/]+)/);
    
    return match ? match[1] : '';
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

const checkScripts = (scripts) => {
        // Globally paused
        if (!config.toggle) {
            return { cancel: true };
        }
		for (var i = 0, l = scripts.length; i < l; i++) {
			if (scripts[i].src) {
				
			} else {
				
			}
			console.log(scripts[i]);
		}
		return { cancel: false, blocked: [] };
}
// Updating domain for synchronous checking in onBeforeRequest
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    domains[tabId] = getDomain(tab.url);
});

chrome.tabs.onRemoved.addListener((tabId) => {
    delete domains[tabId];
});

// Communication with the popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'TOGGLE':
            config.toggle = !config.toggle;
            saveConfig();
            sendResponse(config.toggle);
            break;
		case 'SCRIPTS':
			sendResponse(checkScripts(message.scripts));
			break;
		case 'GET_STATE':
			sendResponse({ toggle: config.toggle });
			break;
	}
});