chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
	if(response.PatternToggle) {
		var s = document.createElement('script');
		s.src = chrome.extension.getURL('js/removeHive.js');
		s.onload = function() {
		  this.remove();
		};
		(document.head || document.documentElement).appendChild(s);
	}
});
window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "BLOCKED")) {
        chrome.runtime.sendMessage({type: 'COUNT'});
    }
});