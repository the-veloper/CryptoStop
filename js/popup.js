/**
 * CryptoStop
 **
 * @author      Georgi Georgiev <RSO.BG>
 * @license     MIT
 * @source      https://github.com/the-veloper/CryptoStop
 */
$('#blacklist').select2({
  width: '300px',
  height: '15px',
  data: ['www.domain.com'],
  tags: true,
  tokenSeparators: ['\n'],
  placeholder: "Add website/IP here and press enter"
});
$('#whitelist').select2({
  width: '300px',
  height: '15px',
  data: ['www.domain.com'],
  tags: true,
  tokenSeparators: ['\n'],
  placeholder: "Add website/IP here and press enter"
});

$('#whitelist').on('select2:select', function (e) {
  chrome.runtime.sendMessage({type: 'WHITELIST', domain: e.params.data.text});
});
$('#blacklist').on('select2:select', function (e) {
  if(!chrome.runtime.sendMessage({type: 'BLACKLIST', domain: e.params.data.text})) {
    $("#blacklist-error").show().delay(1500).fadeOut();
    $("#blacklist option[value='" + e.params.data.text + "']")
    .prop("selected", false).change();
  }
});
$('#whitelist').on('select2:unselect', function (e) {
  chrome.runtime.sendMessage({type: 'WHITELIST', domain: e.params.data.text});
});
$('#blacklist').on('select2:unselect', function (e) {
  chrome.runtime.sendMessage({type: 'BLACKLIST', domain: e.params.data.text});
});

const setCheckboxes = (config) => {
  document.querySelector('#domain-block').checked = config.domainToggle;
  document.querySelector('#ip-block').checked = config.ipToggle;
  document.querySelector('#pattern-block').checked = config.PatternToggle;
}

const setLists = (config) => {
  $.each(config.whitelist, function (i, item) {
    $('#whitelist').append($('<option>', {
      value: item.domain,
      text : item.domain,
      selected : true
    }));
  });
  $.each(config.blacklist, function (i, item) {
    $('#blacklist').append($('<option>', {
      value: item.domain,
      text : item.domain,
      selected : true
    }));
  });
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
          setLists(response);
        });
    }
});