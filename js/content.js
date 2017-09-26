/**
 * CryptoStop
 **
 * @author      Georgi Georgiev <RSO.BG>
 * @license     MIT
 * @source      https://github.com/the-veloper/CryptoStop
 */

chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
	console.log(response);
	if (response.toggle) {
	var scripts = document.getElementsByTagName('script');
	chrome.runtime.sendMessage({ type: 'SCRIPTS', scripts: scripts }, (response) => {
		if (!response.cancel) {
		  for (var i = 0, l = response.length; i < l; i++) {
			  response[i].parentNode.removeChild(response[i]);
		  }
		}
	});
	}
});

