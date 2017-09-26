/**
 * CryptoStop
 **
 * @author      Georgi Georgiev <RSO.BG>
 * @license     MIT
 * @source      https://github.com/the-veloper/CryptoStop
 */
const blacklist = 'https://raw.githubusercontent.com/the-veloper/CryptoStop/dev/blacklist.txt';
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
};

const localConfig = JSON.parse(localStorage.getItem('config'));
let config = {
    ...defaultConfig,
    ...localConfig,
};

/**
 * Variables
 */
let blackURLs = [];
let blackNames = [];

/**
 * Functions
 */

const update = (text) => {
  lists = text.split(';');
  blackURLs = lists[0].split('\n');
  blackNames = lists[1].split('\n');
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
    if (compareWildCard(url, blackNames[i])) return true;
  }
  return false;
}

const isBlackListedURL = (url) => {
  for (var i = 0; i < blackURLs.length; i++) {
    if (compareWildCard(url, blackURLs[i])z) return true && config.domainToggle;
  }
  return false;
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if (config.toggle) {
        for (bURL in blackURLs) {
          if (isBlackListedURL(details.url, blackURLs[bURL])) return {
            cancel: true
          };
        }
        for (bName in blackURLs) {
          if (isBlackListedFilename(details.url, blackNames[bName])) return {
            cancel: true
          };
        }
      }
    }, {
      urls: blackURLs
    }, ["blocking"]);

// Communication with the popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'TOGGLE':
      config.toggle = !config.toggle;
      saveConfig();
      sendResponse(config.toggle);
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
    case 'GET_STATE':
      sendResponse(config);
      break;
  }
});