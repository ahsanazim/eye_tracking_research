/*
// set current url to something else
chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
    chrome.tabs.update(tab.id, {url: "http://www.espn.com/"});
});
*/