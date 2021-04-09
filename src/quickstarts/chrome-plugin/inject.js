
function injectStylesheet(href) {
  var link = document.createElement("link");
  link.href = href;
  link.type = "text/css";
  link.rel = "stylesheet";
  // document.getElementsByTagName("head")[0].appendChild(link);
  document.getElementsByTagName("head")[0].prepend(link);
}

var count = 0;
var checkExist = setInterval(function () {
  console.log(count);
  if (count >= 50 || document.querySelector('[data-ouia-app-id="controlPlane-streams"]')) {
    console.log('injecting quick starts');
    injectQuickStarts();
    clearInterval(checkExist);
  }
  count++;
}, 100); // check every 100ms

function injectQuickStarts() {
  injectStylesheet("https://localhost:4567/mosaic/cloud-tutorials/plugin.css");
  // injectStylesheet('https://localhost:4567/mosaic/cloud-tutorials/src_launcher_bootstrap_tsx.css');
  // injectStylesheet('https://localhost:4567/mosaic/cloud-tutorials/patternfly.min.css');
  // injectStylesheet('https://localhost:4567/mosaic/cloud-tutorials/patternfly-addons.css');
  // injectStylesheet('https://localhost:4567/mosaic/cloud-tutorials/accessibility.css');
  // injectStylesheet('https://localhost:4567/mosaic/cloud-tutorials/react-catalog-view-extension.css');
  // injectStylesheet('https://localhost:4567/mosaic/cloud-tutorials/quickstarts.min.css');

  const quickstart = document.createElement("script");
  quickstart.setAttribute(
    "src",
    "https://localhost:4567/mosaic/cloud-tutorials/quickstarts.js"
  );
  document.body.appendChild(quickstart);
}
