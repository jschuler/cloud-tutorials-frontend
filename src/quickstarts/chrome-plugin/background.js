// listen for clicking addon button in browser's UI
chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.executeScript(tab.id, {
		file: 'inject.js'
	});
});
