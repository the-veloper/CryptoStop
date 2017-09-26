/**
 * CryptoStop
 **
 * @author      Georgi Georgiev <RSO.BG>
 * @license     MIT
 * @source      https://github.com/the-veloper/CryptoStop
 */

const setCheckboxes = (config) => {
  document.querySelector('#domain-block').checked = config.domainToggle;
  document.querySelector('#ip-block').checked = config.ipToggle;
  document.querySelector('#pattern-block').checked = config.PatternToggle;
}
// Domain Toggle
document.querySelector('#domain-block').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'DOMAINTOGGLE' }, (response) => {
  setCheckboxes(response);
    });
});
// IP Toggle
document.querySelector('#ip-block').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'IPTOGGLE' }, (response) => {
  setCheckboxes(response);
  });
});
// Pattern Toggle
document.querySelector('#pattern-block').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'PATTOGGLE' }, (response) => {
  setCheckboxes(response);
  });
});

chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    if (tabs && tabs[0]) {
        chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
          setCheckboxes(response);
        });
    }
});