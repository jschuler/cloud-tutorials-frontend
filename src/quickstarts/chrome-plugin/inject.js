function injectStylesheet(href) {
    var link = document.createElement("link");
    link.href = href;
    link.type = "text/css";
    link.rel = "stylesheet";
    // document.getElementsByTagName("head")[0].appendChild(link);
    document.getElementsByTagName("head")[0].prepend(link);
}

injectStylesheet('https://localhost:4567/apps/cloud-tutorials/patternfly.min.css');
injectStylesheet('https://localhost:4567/apps/cloud-tutorials/patternfly-addons.css');
injectStylesheet('https://localhost:4567/apps/cloud-tutorials/accessibility.css');
injectStylesheet('https://localhost:4567/apps/cloud-tutorials/react-catalog-view-extension.css');
injectStylesheet('https://localhost:4567/apps/cloud-tutorials/quickstarts.min.css');

const quickstart = document.createElement('script');
quickstart.setAttribute('src','https://localhost:4567/apps/cloud-tutorials/quickstarts.js');
document.body.appendChild(quickstart);

