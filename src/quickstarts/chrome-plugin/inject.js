
function injectStylesheet(href) {
  var link = document.createElement("link");
  link.href = href;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
  // document.getElementsByTagName("head")[0].prepend(link);
}

function injectQuickStarts() {
  injectStylesheet("https://localhost:4567/mosaic/cloud-tutorials/plugin.css");
  // injectStylesheet('https://localhost:4567/mosaic/cloud-tutorials/src_launcher_bootstrap_tsx.css');
  injectStylesheet('https://localhost:4567/mosaic/cloud-tutorials/patternfly.min.css');
  injectStylesheet('https://localhost:4567/mosaic/cloud-tutorials/patternfly-addons.css');
  injectStylesheet('https://localhost:4567/mosaic/cloud-tutorials/accessibility.css');
  injectStylesheet('https://localhost:4567/mosaic/cloud-tutorials/react-catalog-view-extension.css');
  injectStylesheet('https://localhost:4567/mosaic/cloud-tutorials/quickstarts.min.css');

  const quickstart = document.createElement("script");
  quickstart.setAttribute(
    "src",
    "https://localhost:4567/mosaic/cloud-tutorials/quickstarts.js"
  );
  document.body.appendChild(quickstart);
}

window.onload = function() {
  console.log('quick starts plugin loaded');
  const queryParams = new URLSearchParams(window.location.search);
  let tutorialId = queryParams.get("tutorialid");
  let tutorialPath = queryParams.get("tutorialpath");
  if (!tutorialId && !tutorialPath) {
    if (document.location.hash) {
      // params could be after # hash
      const hash = window.location.hash.substring(window.location.hash.indexOf('?') + 1);
      var params = {}
      hash.split('&').map(hk => { 
        let temp = hk.split('='); 
          params[temp[0]] = temp[1] 
      });
      console.log(params);
      if (params['tutorialid']) {
        tutorialId = params['tutorialid'];
      }
      if (params['tutorialpath']) {
        tutorialPath = params['tutorialpath'];
      }
    }
    
    if (!tutorialId && !tutorialPath) {
      // check if it's in localStorage
      tutorialId = localStorage.getItem('tutorialId');
      tutorialPath = localStorage.getItem('tutorialPath');
    }
  }
  console.log(`tutorialId: ${tutorialId}`);
  console.log(`tutorialPath: ${tutorialPath}`);
  tutorialId && localStorage.setItem('tutorialId', tutorialId);
  tutorialPath && localStorage.setItem('tutorialPath', tutorialPath);
  if (tutorialId || tutorialPath) {
    console.log(`injecting quick starts`);
    injectQuickStarts();
  }
};