/**
 * CryptoStop
 **
 * @author      Georgi Georgiev <RSO.BG>
 * @license     CC BY-NC-ND 3.0
 * @source      https://github.com/the-veloper/CryptoStop
 */
// Variables
let tests = [];
let toggle;

chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
  toggle = response.PatternToggle;
  tests = response.blackPatterns;
  if (toggle) {
    chrome.runtime.sendMessage({ type: 'IS_WHITELISTED', url: location.href }, (response) => {
      var content = new XMLSerializer().serializeToString(document);
      for (i in tests) {
        if (content.match(tests[i])) {
          document.write('');
          break;
        }
      }
  });
  }
});