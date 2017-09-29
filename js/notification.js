chrome.runtime.sendMessage({ type: 'BLOCKED' }, (response) => {
  if(response > 0) {
    $.notify(chrome.i18n.getMessage('blockedScripts') + " " + response, "warn");
    chrome.runtime.sendMessage({ type: 'RESETCOUNT'});
  }
});