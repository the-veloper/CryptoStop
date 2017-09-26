/**
 * MineBlock
 **
 * @author      Georgi Georgiev <RSO.BG>
 * @license     MIT
 * @source      https://github.com/the-veloper/MineBlock
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

const run = (blacklist) => {
    const blacklistedUrls = blacklist.split('\n');
        // Globally paused
        if (!config.toggle) {
            return { cancel: false };
        }
        // Is domain white listed
        if (isDomainWhitelisted(domains[details.tabId])) {
            return { cancel: false };
        }		
}
// Updating domain for synchronous checking in onBeforeRequest
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    domains[tabId] = getDomain(tab.url);
});

chrome.tabs.onRemoved.addListener((tabId) => {
    delete domains[tabId];
});