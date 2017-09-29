/**
 * CryptoStop
 **
 * @author      Georgi Georgiev <RSO.BG>
 * @license     CC BY-NC-ND 3.0
 * @source      https://github.com/the-veloper/CryptoStop
 */
const blacklist = 'https://raw.githubusercontent.com/the-veloper/CryptoStop/master/blacklist.txt';
fetch(blacklist).then(resp => {
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
  domainToggle: true,
  ipToggle: true,
  PatternToggle: true,
  whitelist: [],
  blacklist: []
};

const localConfig = JSON.parse(localStorage.getItem('config'));
let config = Object.assign ({},defaultConfig,localConfig);

/**
 * Variables
 */
let blackURLs = [];
let blackIPs = [];
let blackNames = [];
let blackPatterns = [];

/**
 * Functions
 */

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

const isDomainBlacklisted = (domain) => {
  if (!domain) return false;

  const domainInfo = config.blacklist.find(w => compareWildCard(domain, w.domain) == true);

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

const removeDomainFromBlacklist = (domain) => {
  if (!domain) return;

  config.blacklist = config.blacklist.filter(w => w.domain !== domain);

  return true;
};

const addDomainToBlacklist = (domain) => {
  if (!domain) return;
  if (domain.match(/(?:[A-z0-9])?\*[A-z0-9]/g)) return;

  // Make sure the domain is not already whitelisted before adding it
  if (!isDomainBlacklisted(domain)) {
    config.blacklist = [
        ...config.blacklist,
        {
          domain: domain
        },
  ];
  }
  return true;
};

const removeDomainFromWhitelist = (domain) => {
  if (!domain) return;

  config.whitelist = config.whitelist.filter(w => w.domain !== domain);
};

const update = (text) => {
  lists = text.split(';');
  blackURLs = lists[0].split('\n');
  blackNames = lists[1].split('\n');
  blackIPs = lists[2].split('\n');
  blackPatterns = lists[3].split('\n');
  blackNames.shift();
  blackIPs.shift();
  blackPatterns.shift();
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

const compareWildCard = (string, search) => {
  var startIndex = 0,
      array = search.split('*');
  for (var i = 0; i < array.length; i++) {
    var index = string.indexOf(array[i], startIndex);
    if (index == -1) return false;
    else startIndex = index;
  }
  return true;
}

const isBlackListedFilename = (text) => {
  for (var i = 0; i < blackNames.length; i++) {
    if (compareWildCard(text, blackNames[i])) {
      return true;
    }
  }
  return false;
}

const isBlackListedURL = (url) => {
  for (var i = 0; i < blackURLs.length; i++) {
    if (compareWildCard(url, blackURLs[i])) return true;
  }
  return false;
}

const isBlackListedIP = (ip) => {
  for (var i = 0; i < blackIPs.length; i++) {
    if (compareWildCard(ip, blackIPs[i])) return true;
  }
  return false;
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if(isDomainWhitelisted(getDomain(details.url))) {
        return {cancel: false};
      }
      var cancel = isDomainBlacklisted(getDomain(details.url));
      if (details.url) {
        if (config.domainToggle) {
            if (isBlackListedURL(details.url)) cancel = true;
        }
        if (config.PatternToggle) {
            if (isBlackListedFilename(details.url)) cancel = true;
        }
        if (config.ipToggle) {
          if (isBlackListedIP(details.url)) cancel = true;
        }
      }
      return {cancel: cancel };

    }, {
      urls: [...blackURLs, ...blackIPs, ...blackNames, ...config.blacklist.map(function(t) { if(getDomain(t.domain)) return t.domain; else return '*://' + t.domain + '/*'; })]
    }, ["blocking"]);

// Communication with the popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'TOGGLE':
      config.toggle = !config.toggle;
      saveConfig();
      sendResponse(config.toggle);
      break;
    case 'BLACKLIST':
      var result;
      if(!isDomainBlacklisted(message.domain)) {
        result = addDomainToBlacklist(message.domain);
      } else {
        result = removeDomainFromBlacklist(message.domain);
      }
      saveConfig();
      sendResponse(result);
      break;
    case 'WHITELIST':
      if(!isDomainWhitelisted(message.domain)) {
        addDomainToWhitelist(message.domain);
      } else {
        removeDomainFromWhitelist(message.domain);
      }
      saveConfig();
      sendResponse(true);
      break;
      case 'GET_WHITELIST':
        sendResponse(config.whitelist);
        break;
      case 'GET_BLACKLIST':
        sendResponse(config.blacklist);
        break;
    case 'DOMAINTOGGLE':
      config.domainToggle = !config.domainToggle;
      saveConfig();
      sendResponse(config);
      break;
    case 'IPTOGGLE':
      config.ipToggle = !config.ipToggle;
      saveConfig();
      sendResponse(config);
      break;
    case 'PATTOGGLE':
      config.PatternToggle = !config.PatternToggle;
      saveConfig();
      sendResponse(config);
      break;
    case 'IS_WHITELISTED':
      sendResponse(isDomainWhitelisted(getDomain(message.url)));
      break;
    case 'GET_STATE':
      sendResponse(Object.assign({}, config, {blackPatterns: blackPatterns}));
      break;
  }
});