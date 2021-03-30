import React from 'react';
import ReactDOM from 'react-dom';
import QuickStartDrawer from './components/QuickStartDrawer';
import VanillaChildren from './components/VanillaChildren';

console.log('chrome here!');

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
