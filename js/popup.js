/**
 * CryptoStop
 **
 * @author      Georgi Georgiev <RSO.BG>
 * @license     MIT
 * @source      https://github.com/the-veloper/CryptoStop
 */

const setButtonText = (isEnabled) => {
	if (isEnabled) {
		document.querySelector('.toggle').innerHTML = 'Turn Off';
	} else {
		document.querySelector('.toggle').innerHTML = 'Turn On';
	}
}
// Pause/Unpause
document.querySelector('.toggle').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'TOGGLE' }, (response) => {
		setButtonText(response);
    });
});

chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    if (tabs && tabs[0]) {
        chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
            setButtonText(response.toggle);
        });
    }
});