import React from "react";
import ReactDOM from "react-dom";
import QuickStartDrawer from "./components/QuickStartDrawer";
import VanillaChildren from "./components/VanillaChildren";
import { TutorialBreadcrumb } from "./components/Breadcrumb";

declare const QUICKSTARTS_BASE: string;
declare const APP_BASE: string;
const tutorialHeaderHeight = 49;
var count = 0;
let tutorial: any;
let rootNode: Node;
let bodyCopy: Node;

let tutorialId: string = localStorage.getItem('tutorialId') || '';
let tutorialPath: string = localStorage.getItem('tutorialPath') || '';
if (!tutorialId && !tutorialPath) {
  const queryParams = new URLSearchParams(window.location.search);
  tutorialId = queryParams.get("tutorialid") || '';
  tutorialPath = queryParams.get("tutorialpath") || '';
  if (!tutorialId && !tutorialPath && document.location.hash) {
    // params could be after # hash
    const hash = window.location.hash.substring(window.location.hash.indexOf('?') + 1);
    var params: any = {}
    hash.split('&').map(hk => { 
      let temp = hk.split('='); 
        params[temp[0]] = temp[1] 
    });
    if (params['tutorialid']) {
      tutorialId = params['tutorialid'];
    }
    if (params['tutorialpath']) {
      tutorialPath = params['tutorialpath'];
    }
  }
}
console.log(`script tutorialId: ${tutorialId}`);
console.log(`script tutorialPath: ${tutorialPath}`);
if (tutorialId) {
  console.log(`fetching ${QUICKSTARTS_BASE}/${tutorialId}.json`);
  fetch(`${QUICKSTARTS_BASE}/${tutorialId}.json`)
    .then((res) => res.json())
    .then((json) => {
      tutorial = json;
      const successEvent = new CustomEvent("tutorial-load-success", {
        detail: json,
      });
      document.dispatchEvent(successEvent);
    })
    .catch((error) => {
      console.error("Could not fetch quickstart:", tutorialId);
      const errorEvent = new Event("tutorial-load-error");
      document.dispatchEvent(errorEvent);
    });
} else if (tutorialPath) {
  setTimeout(() => {
    addMasthead();
    // @ts-ignore
    (document.body as HTMLElement).style['border-width'] = '0 5px 5px 5px';
  }, 1);
}

function makeDiv(
  className: string | string[],
  styles?: { [key: string]: string | number }
) {
  const div = document.createElement("div");
  if (Array.isArray(className)) {
    div.className = className.join(" ");
  } else {
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

function copyAttrs(src: HTMLElement, target: HTMLElement) {
  for (let name of src.getAttributeNames()) {
    let value = src.getAttribute(name);
    if (value && target.getAttributeNames().indexOf(name) >= 0) {
      // merge the values
      value = value.concat(` ${target.getAttribute(name)}`);
    }
    value && target.setAttribute(name, value);
    src.removeAttribute(name);
  }
}

function duplicateChildNodes(from: HTMLElement, to: HTMLElement) {
  var children = Array.from(from.childNodes);
  children.forEach(function (item) {
    // var cln = item.cloneNode(true);
    // to.appendChild(cln);
    // (item as HTMLElement).style.display = "none";
    (item as HTMLElement).remove();
  });
}

function addMasthead() {
  /*
   * Tutorial header
   */
  const tutorialHeader = makeDiv("tut-main", {
    'position': 'relative'
  });
  ReactDOM.render(
    React.createElement(TutorialBreadcrumb, {
      basename: APP_BASE,
      crumbs: tutorialPath?.split("/") || [],
    }),
    tutorialHeader
  );
  // if (document.body.firstChild) {
  //   // @ts-ignore
  //   (document.body.firstChild as HTMLElement).style['height'] = 'calc(100% - 50px)';
  //   (document.body.firstChild as HTMLElement).style['border'] = '5px solid #0088ce';
  // }
  // document.body.prepend(tutorialHeader);

  (document.body as HTMLElement).classList.add('tutorial-mode');
  // @ts-ignore
  document.body.parentNode.insertBefore(tutorialHeader, document.body);
}

function addDrawer() {
  // @ts-ignore
  (document.body as HTMLElement).style['margin-right'] = '450px';

  const tutorialDrawer = makeDiv("tut-drawer-static");
  // @ts-ignore
  document.body.parentNode.insertBefore(tutorialDrawer, document.body);
  ReactDOM.render(
    React.createElement(QuickStartDrawer, {
      children: null,
      tutorial,
      tutorialId,
      tutorialPath
      // tutorial: (e as CustomEvent).detail,
    }),
    tutorialDrawer
  );
}

function wrapBody(e?: Event) {
  console.log(`wrapping body`);
  const frameOnly = !tutorialId && tutorialPath;

  /*
   * Tutorial header
   */
  const tutorialHeader = makeDiv("tut-main");
  ReactDOM.render(
    React.createElement(TutorialBreadcrumb, {
      basename: APP_BASE,
      crumbs: tutorialPath?.split("/") || [],
    }),
    tutorialHeader
  );

  /*
   * Wrap document body so we can move it to the drawer content
   */
  const wrappedDocBody = makeDiv("tut-doc-body", {
    height: `calc(100vh - ${tutorialHeaderHeight}px - 10px)`,
  });
  while (document.body.firstChild) {
    wrappedDocBody.appendChild(document.body.firstChild);
  }
  copyAttrs(document.body, wrappedDocBody);

  if (!frameOnly) {
    const tutorialDrawer = makeDiv("tut-drawer");
    document.body.append(tutorialHeader);
    document.body.append(tutorialDrawer);
    ReactDOM.render(
      React.createElement(QuickStartDrawer, {
        children: React.createElement(VanillaChildren, {}, wrappedDocBody),
        tutorial,
        tutorialId,
        tutorialPath
      }),
      tutorialDrawer
    );

    var checkExist = setInterval(function () {
      // console.log(count);
      if (count >= 200) {
        clearInterval(checkExist);
      } else {
        // First hide the in-built quick starts (if applicable)
        const inBuiltDrawer = document.querySelectorAll(
          ".co-quick-start-panel-content"
        );
        if (inBuiltDrawer.length > 1) {
          (inBuiltDrawer[0] as HTMLElement).style.display = "none";
          clearInterval(checkExist);
        }
        count++;
      }
    }, 250); // check every 100ms
  }
}

function changeAllLinks() {
  const params = new URLSearchParams(location.search);
  const tutorialId = params.get("tutorialid");
  let tutorialPath = params.get("tutorialpath");
  if (tutorialPath) {
    for (let i = 0; i < document.links.length; i++) {
      document.links[i].href = `${
        document.links[i].href
      }?tutorialid=${tutorialId}&tutorialpath=${encodeURIComponent(
        tutorialPath
      )}`;
    }
  }
}

function interceptClickEvent(e: Event) {
  const params = new URLSearchParams(location.search);
  const tutorialId = params.get("tutorialid");
  let tutorialPath = params.get("tutorialpath") || "";
  var href;
  var newHref;
  var target = e.target as HTMLElement;
  // @ts-ignore
  if (target.tagName === "A") {
    e.preventDefault;
    // rootNode.replaceChild(bodyCopy, document.body);
    window.location.href = `${target.getAttribute("href")}${location.search}`;
    // @ts-ignore
    // href = target.getAttribute("href");
    // if (!href.includes("tutorialid")) {
    //   newHref = `${href}?tutorialid=${tutorialId}&tutorialpath=${encodeURIComponent(
    //     tutorialPath
    //   )}`;
    // } else {
    //   newHref = href;
    // }
    // window.location.replace(newHref);
  }
}

function updateView(e: any) {
  console.log(`updating view`);
  setTimeout(() => {
    addMasthead();
    addDrawer();
  }, 1);
}

document.addEventListener(
  "tutorial-load-success",
  updateView,
  false
);

document.addEventListener("click", interceptClickEvent);
