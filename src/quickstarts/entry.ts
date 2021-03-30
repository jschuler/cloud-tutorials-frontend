import React from 'react';
import ReactDOM from 'react-dom';
import QuickStartDrawer from './components/QuickStartDrawer';
import VanillaChildren from './components/VanillaChildren';

console.log('chrome here!');

function injectStylesheet(href: string) {
  var link = document.createElement("link");
  link.href = href;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}

injectStylesheet('https://unpkg.com/@cloudmosaic/quickstarts@0.0.19/dist/quickstarts.css');
injectStylesheet('https://www.unpkg.com/@patternfly/patternfly@4.96.2/patternfly.min.css');
// injectStylesheet('https://www.unpkg.com/@patternfly/patternfly@4.96.2/components/Drawer/drawer.css');

function makeDiv(className: string | string[], styles?: { [key: string]: string }) {
  const div = document.createElement('div');
  if (Array.isArray(className)) {
    div.className = className.join(' ');
  }
  else {
    div.className = className;
  }
  if (styles) {
    for (const property in styles) {
      // @ts-ignore
      div.style[property] = styles[property];
    }
  }
  return div;
}

const wrappedDocBody = makeDiv('doc-body', {
  height: '100vh'
});
while (document.body.firstChild) {
  wrappedDocBody.appendChild(document.body.firstChild);
}

const qsDrawer = makeDiv('qs-drawer', {
  'height': '100%'
});
document.body.append(qsDrawer);

ReactDOM.render(React.createElement(QuickStartDrawer, {
  children: React.createElement(VanillaChildren, {}, wrappedDocBody)
}), qsDrawer);
