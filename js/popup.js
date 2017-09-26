/**
 * CryptoStop
 **
 * @author      Georgi Georgiev <RSO.BG>
 * @license     MIT
 * @source      https://github.com/the-veloper/CryptoStop
 */
 
// Pause/Unpause
document.querySelector('.toggle').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'TOGGLE' }, (response) => {
		//Do stuff
    });
});
