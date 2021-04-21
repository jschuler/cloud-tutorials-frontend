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

const queryParams = new URLSearchParams(window.location.search);
const searchQuery = queryParams.get("tutorialid");
if (searchQuery) {
  fetch(`${QUICKSTARTS_BASE}/${searchQuery}.json`)
    .then((res) => res.json())
    .then((json) => {
      tutorial = json;
      const successEvent = new CustomEvent("tutorial-load-success", {
        detail: json,
      });
      document.dispatchEvent(successEvent);
    })
    .catch((error) => {
      console.error("Could not fetch quickstart:", searchQuery);
      const errorEvent = new Event("tutorial-load-error");
      document.dispatchEvent(errorEvent);
    });
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

function wrapBody(e: Event) {
  /*
   * Tutorial header
   */
  const tutorialHeader = makeDiv("tut-main");
  const params = new URLSearchParams(location.search);
  const tutorialPath = params.get("tutorialpath");
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

  // const iframeWrapper = document.createElement('iframe');
  // wrappedDocBody.height = `calc(100vh - ${tutorialHeaderHeight}px - 10px)`;
  // // duplicateChildNodes(document.body, wrappedDocBody);
  // iframeWrapper.src = `${window.location.origin}${window.location.pathname}`;
  // iframeWrapper.src = "https://console-openshift-console.apps.sandbox-m2.ll9k.p1.openshiftapps.com/topology/ns/jschuler-kafka-devexp-dev/graph";
  // iframeWrapper.src = 'data:text/html;charset=utf-8,' + encodeURI(document.body.innerHTML);
  // if (iframeWrapper?.contentWindow) {
  //   iframeWrapper.contentWindow.document.open();
  //   iframeWrapper.contentWindow.document.write(document.body.innerHTML);
  //   iframeWrapper.contentWindow.document.close();
  // }
  // document.body.append(iframeWrapper);

  /*
  while (document.body.firstChild) {
    const clonedNode = document.body.firstChild.cloneNode(true);
    (document.body.firstChild as HTMLElement).style.display = "none";
    wrappedDocBody.appendChild(clonedNode);
  }
  */

  const tutorialDrawer = makeDiv("tut-drawer");
  document.body.append(tutorialHeader);
  document.body.append(tutorialDrawer);
  ReactDOM.render(
    React.createElement(QuickStartDrawer, {
      children: React.createElement(VanillaChildren, {}, wrappedDocBody),
      tutorial,
      // tutorial: (e as CustomEvent).detail,
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

document.addEventListener(
  "tutorial-load-success",
  function (e) {
    setTimeout(() => {
      wrapBody(e);
      changeAllLinks();
    }, 1000);
  },
  false
);

// document.addEventListener("click", interceptClickEvent);
