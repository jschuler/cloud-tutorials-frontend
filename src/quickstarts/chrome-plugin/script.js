// wait that page finished loading
window.addEventListener(
  "load",
  function load(event) {
    // for the current tab, inject the "inject.js" file & execute it
    chrome.tabs.executeScript(tab.ib, {
      file: "inject.js",
    });
  },
  false
);
