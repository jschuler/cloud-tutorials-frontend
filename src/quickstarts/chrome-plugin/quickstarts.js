import {injectFunction} from './my-script.js';
injectFunction();

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
console.log('>>>>>>>> qs 1')
/******/ 	var __webpack_modules__ = ({

/***/ "./src/quickstarts/components/VanillaChildren.tsx":
/*!********************************************************!*\
  !*** ./src/quickstarts/components/VanillaChildren.tsx ***!
  \********************************************************/
/***/ 
console.log('>>>>>>>> qs 2')
((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
    /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
    /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
    
    
    var VanillaChildren = /** @class */ (function (_super) {
        (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__extends)(VanillaChildren, _super);
        function VanillaChildren() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        VanillaChildren.prototype.render = function () {
            var _this = this;
            // @ts-ignore
            return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { ref: function (ref) { return ref.appendChild(_this.props.children); } });
            // return <iframe src={window.location.href} width="100%" height="100%" />;
        };
        return VanillaChildren;
    }((react__WEBPACK_IMPORTED_MODULE_0___default().Component)));
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VanillaChildren);
    
    
    /***/ }),
    
    /***/ "./src/quickstarts/entry.ts":
    /*!**********************************!*\
      !*** ./src/quickstarts/entry.ts ***!
      \**********************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
    /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
    /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
    /* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "webpack/sharing/consume/default/react-dom/react-dom");
    /* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
    /* harmony import */ var _components_QuickStartDrawer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/QuickStartDrawer */ "./src/quickstarts/components/QuickStartDrawer.tsx");
    /* harmony import */ var _components_VanillaChildren__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/VanillaChildren */ "./src/quickstarts/components/VanillaChildren.tsx");
    /* harmony import */ var _components_Breadcrumb__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/Breadcrumb */ "./src/quickstarts/components/Breadcrumb.tsx");
    
    
    
    
    
    
    console.log('qs entry');
    var tutorialHeaderHeight = 49;
    var count = 0;
    var tutorial;
    var rootNode;
    var bodyCopy;
    var tutorialId = localStorage.getItem('tutorialId') || '';
    var tutorialPath = localStorage.getItem('tutorialPath') || '';
    if (!tutorialId && !tutorialPath) {
        var queryParams = new URLSearchParams(window.location.search);
        tutorialId = queryParams.get("tutorialid") || '';
        tutorialPath = queryParams.get("tutorialpath") || '';
        if (!tutorialId && !tutorialPath && document.location.hash) {
            // params could be after # hash
            var hash = window.location.hash.substring(window.location.hash.indexOf('?') + 1);
            var params = {};
            hash.split('&').map(function (hk) {
                var temp = hk.split('=');
                params[temp[0]] = temp[1];
            });
            if (params['tutorialid']) {
                tutorialId = params['tutorialid'];
            }
            if (params['tutorialpath']) {
                tutorialPath = params['tutorialpath'];
            }
        }
    }
    console.log("script tutorialId: " + tutorialId);
    console.log("script tutorialPath: " + tutorialPath);
    if (tutorialId) {
        console.log("fetching " + "/apps/cloud-tutorials/quickstarts" + "/" + tutorialId + ".json");
        fetch("/apps/cloud-tutorials/quickstarts" + "/" + tutorialId + ".json")
            .then(function (res) { return res.json(); })
            .then(function (json) {
            tutorial = json;
            var successEvent = new CustomEvent("tutorial-load-success", {
                detail: json,
            });
            document.dispatchEvent(successEvent);
        })
            .catch(function (error) {
            console.error("Could not fetch quickstart:", tutorialId);
            var errorEvent = new Event("tutorial-load-error");
            document.dispatchEvent(errorEvent);
        });
    }
    else if (tutorialPath) {
        setTimeout(function () {
            addMasthead();
            // @ts-ignore
            document.body.style['border-width'] = '0 5px 5px 5px';
        }, 1);
    }
    function makeDiv(className, styles) {
        var div = document.createElement("div");
        if (Array.isArray(className)) {
            div.className = className.join(" ");
        }
        else {
            div.className = className;
        }
        if (styles) {
            for (var property in styles) {
                // @ts-ignore
                div.style[property] = styles[property];
            }
        }
        return div;
    }
    function copyAttrs(src, target) {
        var e_1, _a;
        try {
            for (var _b = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__values)(src.getAttributeNames()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_1 = _c.value;
                var value = src.getAttribute(name_1);
                if (value && target.getAttributeNames().indexOf(name_1) >= 0) {
                    // merge the values
                    value = value.concat(" " + target.getAttribute(name_1));
                }
                value && target.setAttribute(name_1, value);
                src.removeAttribute(name_1);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    function duplicateChildNodes(from, to) {
        var children = Array.from(from.childNodes);
        children.forEach(function (item) {
            // var cln = item.cloneNode(true);
            // to.appendChild(cln);
            // (item as HTMLElement).style.display = "none";
            item.remove();
        });
    }
    function addMasthead() {
        /*
         * Tutorial header
         */
        var tutorialHeader = makeDiv("tut-main", {
            'position': 'relative'
        });
        react_dom__WEBPACK_IMPORTED_MODULE_1___default().render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Breadcrumb__WEBPACK_IMPORTED_MODULE_4__.TutorialBreadcrumb, {
            basename: "/apps/cloud-tutorials/",
            crumbs: (tutorialPath === null || tutorialPath === void 0 ? void 0 : tutorialPath.split("/")) || [],
        }), tutorialHeader);
        // if (document.body.firstChild) {
        //   // @ts-ignore
        //   (document.body.firstChild as HTMLElement).style['height'] = 'calc(100% - 50px)';
        //   (document.body.firstChild as HTMLElement).style['border'] = '5px solid #0088ce';
        // }
        // document.body.prepend(tutorialHeader);
        document.body.classList.add('tutorial-mode');
        // @ts-ignore
        document.body.parentNode.insertBefore(tutorialHeader, document.body);
    }
    function addDrawer() {
        // @ts-ignore
        document.body.style['margin-right'] = '450px';
        var tutorialDrawer = makeDiv("tut-drawer-static");
        // @ts-ignore
        document.body.parentNode.insertBefore(tutorialDrawer, document.body);
        react_dom__WEBPACK_IMPORTED_MODULE_1___default().render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_QuickStartDrawer__WEBPACK_IMPORTED_MODULE_2__.default, {
            children: null,
            tutorial: tutorial,
            tutorialId: tutorialId,
            tutorialPath: tutorialPath
            // tutorial: (e as CustomEvent).detail,
        }), tutorialDrawer);
    }
    function wrapBody(e) {
        console.log("wrapping body");
        var frameOnly = !tutorialId && tutorialPath;
        /*
         * Tutorial header
         */
        var tutorialHeader = makeDiv("tut-main");
        react_dom__WEBPACK_IMPORTED_MODULE_1___default().render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Breadcrumb__WEBPACK_IMPORTED_MODULE_4__.TutorialBreadcrumb, {
            basename: "/apps/cloud-tutorials/",
            crumbs: (tutorialPath === null || tutorialPath === void 0 ? void 0 : tutorialPath.split("/")) || [],
        }), tutorialHeader);
        /*
         * Wrap document body so we can move it to the drawer content
         */
        var wrappedDocBody = makeDiv("tut-doc-body", {
            height: "calc(100vh - " + tutorialHeaderHeight + "px - 10px)",
        });
        while (document.body.firstChild) {
            wrappedDocBody.appendChild(document.body.firstChild);
        }
        copyAttrs(document.body, wrappedDocBody);
        if (!frameOnly) {
            var tutorialDrawer = makeDiv("tut-drawer");
            document.body.append(tutorialHeader);
            document.body.append(tutorialDrawer);
            react_dom__WEBPACK_IMPORTED_MODULE_1___default().render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_QuickStartDrawer__WEBPACK_IMPORTED_MODULE_2__.default, {
                children: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_VanillaChildren__WEBPACK_IMPORTED_MODULE_3__.default, {}, wrappedDocBody),
                tutorial: tutorial,
                tutorialId: tutorialId,
                tutorialPath: tutorialPath
            }), tutorialDrawer);
            var checkExist = setInterval(function () {
                // console.log(count);
                if (count >= 200) {
                    clearInterval(checkExist);
                }
                else {
                    // First hide the in-built quick starts (if applicable)
                    var inBuiltDrawer = document.querySelectorAll(".co-quick-start-panel-content");
                    if (inBuiltDrawer.length > 1) {
                        inBuiltDrawer[0].style.display = "none";
                        clearInterval(checkExist);
                    }
                    count++;
                }
            }, 250); // check every 100ms
        }
    }
    function changeAllLinks() {
        var params = new URLSearchParams(location.search);
        var tutorialId = params.get("tutorialid");
        var tutorialPath = params.get("tutorialpath");
        if (tutorialPath) {
            for (var i = 0; i < document.links.length; i++) {
                document.links[i].href = document.links[i].href + "?tutorialid=" + tutorialId + "&tutorialpath=" + encodeURIComponent(tutorialPath);
            }
        }
    }
    function interceptClickEvent(e) {
        var params = new URLSearchParams(location.search);
        var tutorialId = params.get("tutorialid");
        var tutorialPath = params.get("tutorialpath") || "";
        var href;
        var newHref;
        var target = e.target;
        // @ts-ignore
        if (target.tagName === "A") {
            e.preventDefault;
            // rootNode.replaceChild(bodyCopy, document.body);
            window.location.href = "" + target.getAttribute("href") + location.search;
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
    function updateView(e) {
        console.log("updating view");
        setTimeout(function () {
            addMasthead();
            addDrawer();
        }, 1);
    }
    document.addEventListener("tutorial-load-success", updateView, false);
    document.addEventListener("click", interceptClickEvent);
    document.addEventListener("DOMContentLoaded", function (event) {
        alert('Hey');
    });
    setTimeout(function () {
        alert('Hey timeout');
    }, 5000);
    
    
    /***/ })
    
    /******/ 	});
    /************************************************************************/
    /******/ 	// The module cache
    /******/ 	var __webpack_module_cache__ = {};
    /******/ 	
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
    /******/ 		// Check if module is in cache
    /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
    /******/ 		if (cachedModule !== undefined) {
    /******/ 			return cachedModule.exports;
    /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = __webpack_module_cache__[moduleId] = {
    /******/ 			id: moduleId,
    /******/ 			loaded: false,
    /******/ 			exports: {}
    /******/ 		};
    /******/ 	
    /******/ 		// Execute the module function
    /******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/ 	
    /******/ 		// Flag the module as loaded
    /******/ 		module.loaded = true;
    /******/ 	
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
    /******/ 	
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = __webpack_modules__;
    /******/ 	
    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = __webpack_module_cache__;
    /******/ 	
    /************************************************************************/
    /******/ 	/* webpack/runtime/chunk loaded */
    /******/ 	(() => {
    /******/ 		var deferred = [];
    /******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
    /******/ 			if(chunkIds) {
    /******/ 				priority = priority || 0;
    /******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
    /******/ 				deferred[i] = [chunkIds, fn, priority];
    /******/ 				return;
    /******/ 			}
    /******/ 			var notFulfilled = Infinity;
    /******/ 			for (var i = 0; i < deferred.length; i++) {
    /******/ 				var [chunkIds, fn, priority] = deferred[i];
    /******/ 				var fulfilled = true;
    /******/ 				for (var j = 0; j < chunkIds.length; j++) {
    /******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
    /******/ 						chunkIds.splice(j--, 1);
    /******/ 					} else {
    /******/ 						fulfilled = false;
    /******/ 						if(priority < notFulfilled) notFulfilled = priority;
    /******/ 					}
    /******/ 				}
    /******/ 				if(fulfilled) {
    /******/ 					deferred.splice(i--, 1)
    /******/ 					result = fn();
    /******/ 				}
    /******/ 			}
    /******/ 			return result;
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/compat get default export */
    /******/ 	(() => {
    /******/ 		// getDefaultExport function for compatibility with non-harmony modules
    /******/ 		__webpack_require__.n = (module) => {
    /******/ 			var getter = module && module.__esModule ?
    /******/ 				() => (module['default']) :
    /******/ 				() => (module);
    /******/ 			__webpack_require__.d(getter, { a: getter });
    /******/ 			return getter;
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/define property getters */
    /******/ 	(() => {
    /******/ 		// define getter functions for harmony exports
    /******/ 		__webpack_require__.d = (exports, definition) => {
    /******/ 			for(var key in definition) {
    /******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
    /******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
    /******/ 				}
    /******/ 			}
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/ensure chunk */
    /******/ 	(() => {
    /******/ 		__webpack_require__.f = {};
    /******/ 		// This file contains only the entry chunk.
    /******/ 		// The chunk loading function for additional chunks
    /******/ 		__webpack_require__.e = (chunkId) => {
    /******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
    /******/ 				__webpack_require__.f[key](chunkId, promises);
    /******/ 				return promises;
    /******/ 			}, []));
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/get javascript chunk filename */
    /******/ 	(() => {
    /******/ 		// This function allow to reference async chunks
    /******/ 		__webpack_require__.u = (chunkId) => {
    /******/ 			// return url for filenames based on template
    /******/ 			return "js/" + chunkId + "." + "c5affb0d0b2c4f420167" + ".js";
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/get mini-css chunk filename */
    /******/ 	(() => {
    /******/ 		// This function allow to reference all chunks
    /******/ 		__webpack_require__.miniCssF = (chunkId) => {
    /******/ 			// return url for filenames based on template
    /******/ 			return "css/" + chunkId + "." + {"pfVendor":"184c844436c2a9daafb2","src_quickstarts_components_Breadcrumb_tsx-src_quickstarts_components_QuickStartDrawer_tsx":"504113bb3a3640c8c5ce"}[chunkId] + ".css";
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/global */
    /******/ 	(() => {
    /******/ 		__webpack_require__.g = (function() {
    /******/ 			if (typeof globalThis === 'object') return globalThis;
    /******/ 			try {
    /******/ 				return this || new Function('return this')();
    /******/ 			} catch (e) {
    /******/ 				if (typeof window === 'object') return window;
    /******/ 			}
    /******/ 		})();
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/harmony module decorator */
    /******/ 	(() => {
    /******/ 		__webpack_require__.hmd = (module) => {
    /******/ 			module = Object.create(module);
    /******/ 			if (!module.children) module.children = [];
    /******/ 			Object.defineProperty(module, 'exports', {
    /******/ 				enumerable: true,
    /******/ 				set: () => {
    /******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
    /******/ 				}
    /******/ 			});
    /******/ 			return module;
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/hasOwnProperty shorthand */
    /******/ 	(() => {
    /******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/load script */
    /******/ 	(() => {
    /******/ 		var inProgress = {};
    /******/ 		var dataWebpackPrefix = "cloud-tutorials:";
    /******/ 		// loadScript function to load a script via script tag
    /******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
    /******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
    /******/ 			var script, needAttach;
    /******/ 			if(key !== undefined) {
    /******/ 				var scripts = document.getElementsByTagName("script");
    /******/ 				for(var i = 0; i < scripts.length; i++) {
    /******/ 					var s = scripts[i];
    /******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
    /******/ 				}
    /******/ 			}
    /******/ 			if(!script) {
    /******/ 				needAttach = true;
    /******/ 				script = document.createElement('script');
    /******/ 		
    /******/ 				script.charset = 'utf-8';
    /******/ 				script.timeout = 120;
    /******/ 				if (__webpack_require__.nc) {
    /******/ 					script.setAttribute("nonce", __webpack_require__.nc);
    /******/ 				}
    /******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
    /******/ 				script.src = url;
    /******/ 			}
    /******/ 			inProgress[url] = [done];
    /******/ 			var onScriptComplete = (prev, event) => {
    /******/ 				// avoid mem leaks in IE.
    /******/ 				script.onerror = script.onload = null;
    /******/ 				clearTimeout(timeout);
    /******/ 				var doneFns = inProgress[url];
    /******/ 				delete inProgress[url];
    /******/ 				script.parentNode && script.parentNode.removeChild(script);
    /******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
    /******/ 				if(prev) return prev(event);
    /******/ 			}
    /******/ 			;
    /******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
    /******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
    /******/ 			script.onload = onScriptComplete.bind(null, script.onload);
    /******/ 			needAttach && document.head.appendChild(script);
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/make namespace object */
    /******/ 	(() => {
    /******/ 		// define __esModule on exports
    /******/ 		__webpack_require__.r = (exports) => {
    /******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    /******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    /******/ 			}
    /******/ 			Object.defineProperty(exports, '__esModule', { value: true });
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/node module decorator */
    /******/ 	(() => {
    /******/ 		__webpack_require__.nmd = (module) => {
    /******/ 			module.paths = [];
    /******/ 			if (!module.children) module.children = [];
    /******/ 			return module;
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/sharing */
    /******/ 	(() => {
    /******/ 		__webpack_require__.S = {};
    /******/ 		var initPromises = {};
    /******/ 		var initTokens = {};
    /******/ 		__webpack_require__.I = (name, initScope) => {
    /******/ 			if(!initScope) initScope = [];
    /******/ 			// handling circular init calls
    /******/ 			var initToken = initTokens[name];
    /******/ 			if(!initToken) initToken = initTokens[name] = {};
    /******/ 			if(initScope.indexOf(initToken) >= 0) return;
    /******/ 			initScope.push(initToken);
    /******/ 			// only runs once
    /******/ 			if(initPromises[name]) return initPromises[name];
    /******/ 			// creates a new share scope if needed
    /******/ 			if(!__webpack_require__.o(__webpack_require__.S, name)) __webpack_require__.S[name] = {};
    /******/ 			// runs all init snippets from all modules reachable
    /******/ 			var scope = __webpack_require__.S[name];
    /******/ 			var warn = (msg) => (typeof console !== "undefined" && console.warn && console.warn(msg));
    /******/ 			var uniqueName = "cloud-tutorials";
    /******/ 			var register = (name, version, factory, eager) => {
    /******/ 				var versions = scope[name] = scope[name] || {};
    /******/ 				var activeVersion = versions[version];
    /******/ 				if(!activeVersion || (!activeVersion.loaded && (!eager != !activeVersion.eager ? eager : uniqueName > activeVersion.from))) versions[version] = { get: factory, from: uniqueName, eager: !!eager };
    /******/ 			};
    /******/ 			var initExternal = (id) => {
    /******/ 				var handleError = (err) => (warn("Initialization of sharing external failed: " + err));
    /******/ 				try {
    /******/ 					var module = __webpack_require__(id);
    /******/ 					if(!module) return;
    /******/ 					var initFn = (module) => (module && module.init && module.init(__webpack_require__.S[name], initScope))
    /******/ 					if(module.then) return promises.push(module.then(initFn, handleError));
    /******/ 					var initResult = initFn(module);
    /******/ 					if(initResult && initResult.then) return promises.push(initResult.catch(handleError));
    /******/ 				} catch(err) { handleError(err); }
    /******/ 			}
    /******/ 			var promises = [];
    /******/ 			switch(name) {
    /******/ 				case "default": {
    /******/ 					register("@patternfly/react-core", "4.101.3", () => (Promise.all([__webpack_require__.e("pfVendor"), __webpack_require__.e("vendor"), __webpack_require__.e("webpack_sharing_consume_default_react_react"), __webpack_require__.e("webpack_sharing_consume_default_react-dom_react-dom")]).then(() => (() => (__webpack_require__(/*! ./node_modules/@patternfly/react-core/dist/esm/index.js */ "./node_modules/@patternfly/react-core/dist/esm/index.js"))))));
    /******/ 					register("react-dom", "17.0.1", () => (Promise.all([__webpack_require__.e("reactVendor"), __webpack_require__.e("vendor"), __webpack_require__.e("webpack_sharing_consume_default_react_react")]).then(() => (() => (__webpack_require__(/*! ./node_modules/react-dom/index.js */ "./node_modules/react-dom/index.js"))))));
    /******/ 					register("react-router-dom", "5.2.0", () => (Promise.all([__webpack_require__.e("vendor"), __webpack_require__.e("webpack_sharing_consume_default_react_react")]).then(() => (() => (__webpack_require__(/*! ./node_modules/react-router-dom/esm/react-router-dom.js */ "./node_modules/react-router-dom/esm/react-router-dom.js"))))));
    /******/ 					register("react", "17.0.1", () => (Promise.all([__webpack_require__.e("reactVendor"), __webpack_require__.e("vendor")]).then(() => (() => (__webpack_require__(/*! ./node_modules/react/index.js */ "./node_modules/react/index.js"))))));
    /******/ 				}
    /******/ 				break;
    /******/ 			}
    /******/ 			if(!promises.length) return initPromises[name] = 1;
    /******/ 			return initPromises[name] = Promise.all(promises).then(() => (initPromises[name] = 1));
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/publicPath */
    /******/ 	(() => {
    /******/ 		__webpack_require__.p = "/apps/cloud-tutorials/";
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/consumes */
    /******/ 	(() => {
    /******/ 		var parseVersion = (str) => {
    /******/ 			// see webpack/lib/util/semver.js for original code
    /******/ 			var p=p=>{return p.split(".").map((p=>{return+p==p?+p:p}))},n=/^([^-+]+)?(?:-([^+]+))?(?:\+(.+))?$/.exec(str),r=n[1]?p(n[1]):[];return n[2]&&(r.length++,r.push.apply(r,p(n[2]))),n[3]&&(r.push([]),r.push.apply(r,p(n[3]))),r;
    /******/ 		}
    /******/ 		var versionLt = (a, b) => {
    /******/ 			// see webpack/lib/util/semver.js for original code
    /******/ 			a=parseVersion(a),b=parseVersion(b);for(var r=0;;){if(r>=a.length)return r<b.length&&"u"!=(typeof b[r])[0];var e=a[r],n=(typeof e)[0];if(r>=b.length)return"u"==n;var t=b[r],f=(typeof t)[0];if(n!=f)return"o"==n&&"n"==f||("s"==f||"u"==n);if("o"!=n&&"u"!=n&&e!=t)return e<t;r++}
    /******/ 		}
    /******/ 		var rangeToString = (range) => {
    /******/ 			// see webpack/lib/util/semver.js for original code
    /******/ 			var r=range[0],n="";if(1===range.length)return"*";if(r+.5){n+=0==r?">=":-1==r?"<":1==r?"^":2==r?"~":r>0?"=":"!=";for(var e=1,a=1;a<range.length;a++){e--,n+="u"==(typeof(t=range[a]))[0]?"-":(e>0?".":"")+(e=2,t)}return n}var g=[];for(a=1;a<range.length;a++){var t=range[a];g.push(0===t?"not("+o()+")":1===t?"("+o()+" || "+o()+")":2===t?g.pop()+" "+g.pop():rangeToString(t))}return o();function o(){return g.pop().replace(/^\((.+)\)$/,"$1")}
    /******/ 		}
    /******/ 		var satisfy = (range, version) => {
    /******/ 			// see webpack/lib/util/semver.js for original code
    /******/ 			if(0 in range){version=parseVersion(version);var e=range[0],r=e<0;r&&(e=-e-1);for(var n=0,i=1,a=!0;;i++,n++){var f,s,g=i<range.length?(typeof range[i])[0]:"";if(n>=version.length||"o"==(s=(typeof(f=version[n]))[0]))return!a||("u"==g?i>e&&!r:""==g!=r);if("u"==s){if(!a||"u"!=g)return!1}else if(a)if(g==s)if(i<=e){if(f!=range[i])return!1}else{if(r?f>range[i]:f<range[i])return!1;f!=range[i]&&(a=!1)}else if("s"!=g&&"n"!=g){if(r||i<=e)return!1;a=!1,i--}else{if(i<=e||s<g!=r)return!1;a=!1}else"s"!=g&&"n"!=g&&(a=!1,i--)}}var t=[],o=t.pop.bind(t);for(n=1;n<range.length;n++){var u=range[n];t.push(1==u?o()|o():2==u?o()&o():u?satisfy(u,version):!o())}return!!o();
    /******/ 		}
    /******/ 		var ensureExistence = (scopeName, key) => {
    /******/ 			var scope = __webpack_require__.S[scopeName];
    /******/ 			if(!scope || !__webpack_require__.o(scope, key)) throw new Error("Shared module " + key + " doesn't exist in shared scope " + scopeName);
    /******/ 			return scope;
    /******/ 		};
    /******/ 		var findVersion = (scope, key) => {
    /******/ 			var versions = scope[key];
    /******/ 			var key = Object.keys(versions).reduce((a, b) => {
    /******/ 				return !a || versionLt(a, b) ? b : a;
    /******/ 			}, 0);
    /******/ 			return key && versions[key]
    /******/ 		};
    /******/ 		var findSingletonVersionKey = (scope, key) => {
    /******/ 			var versions = scope[key];
    /******/ 			return Object.keys(versions).reduce((a, b) => {
    /******/ 				return !a || (!versions[a].loaded && versionLt(a, b)) ? b : a;
    /******/ 			}, 0);
    /******/ 		};
    /******/ 		var getInvalidSingletonVersionMessage = (key, version, requiredVersion) => {
    /******/ 			return "Unsatisfied version " + version + " of shared singleton module " + key + " (required " + rangeToString(requiredVersion) + ")"
    /******/ 		};
    /******/ 		var getSingletonVersion = (scope, scopeName, key, requiredVersion) => {
    /******/ 			var version = findSingletonVersionKey(scope, key);
    /******/ 			if (!satisfy(requiredVersion, version)) typeof console !== "undefined" && console.warn && console.warn(getInvalidSingletonVersionMessage(key, version, requiredVersion));
    /******/ 			return get(scope[key][version]);
    /******/ 		};
    /******/ 		var getStrictSingletonVersion = (scope, scopeName, key, requiredVersion) => {
    /******/ 			var version = findSingletonVersionKey(scope, key);
    /******/ 			if (!satisfy(requiredVersion, version)) throw new Error(getInvalidSingletonVersionMessage(key, version, requiredVersion));
    /******/ 			return get(scope[key][version]);
    /******/ 		};
    /******/ 		var findValidVersion = (scope, key, requiredVersion) => {
    /******/ 			var versions = scope[key];
    /******/ 			var key = Object.keys(versions).reduce((a, b) => {
    /******/ 				if (!satisfy(requiredVersion, b)) return a;
    /******/ 				return !a || versionLt(a, b) ? b : a;
    /******/ 			}, 0);
    /******/ 			return key && versions[key]
    /******/ 		};
    /******/ 		var getInvalidVersionMessage = (scope, scopeName, key, requiredVersion) => {
    /******/ 			var versions = scope[key];
    /******/ 			return "No satisfying version (" + rangeToString(requiredVersion) + ") of shared module " + key + " found in shared scope " + scopeName + ".\n" +
    /******/ 				"Available versions: " + Object.keys(versions).map((key) => {
    /******/ 				return key + " from " + versions[key].from;
    /******/ 			}).join(", ");
    /******/ 		};
    /******/ 		var getValidVersion = (scope, scopeName, key, requiredVersion) => {
    /******/ 			var entry = findValidVersion(scope, key, requiredVersion);
    /******/ 			if(entry) return get(entry);
    /******/ 			throw new Error(getInvalidVersionMessage(scope, scopeName, key, requiredVersion));
    /******/ 		};
    /******/ 		var warnInvalidVersion = (scope, scopeName, key, requiredVersion) => {
    /******/ 			typeof console !== "undefined" && console.warn && console.warn(getInvalidVersionMessage(scope, scopeName, key, requiredVersion));
    /******/ 		};
    /******/ 		var get = (entry) => {
    /******/ 			entry.loaded = 1;
    /******/ 			return entry.get()
    /******/ 		};
    /******/ 		var init = (fn) => (function(scopeName, a, b, c) {
    /******/ 			var promise = __webpack_require__.I(scopeName);
    /******/ 			if (promise && promise.then) return promise.then(fn.bind(fn, scopeName, __webpack_require__.S[scopeName], a, b, c));
    /******/ 			return fn(scopeName, __webpack_require__.S[scopeName], a, b, c);
    /******/ 		});
    /******/ 		
    /******/ 		var load = /*#__PURE__*/ init((scopeName, scope, key) => {
    /******/ 			ensureExistence(scopeName, key);
    /******/ 			return get(findVersion(scope, key));
    /******/ 		});
    /******/ 		var loadFallback = /*#__PURE__*/ init((scopeName, scope, key, fallback) => {
    /******/ 			return scope && __webpack_require__.o(scope, key) ? get(findVersion(scope, key)) : fallback();
    /******/ 		});
    /******/ 		var loadVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
    /******/ 			ensureExistence(scopeName, key);
    /******/ 			return get(findValidVersion(scope, key, version) || warnInvalidVersion(scope, scopeName, key, version) || findVersion(scope, key));
    /******/ 		});
    /******/ 		var loadSingletonVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
    /******/ 			ensureExistence(scopeName, key);
    /******/ 			return getSingletonVersion(scope, scopeName, key, version);
    /******/ 		});
    /******/ 		var loadStrictVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
    /******/ 			ensureExistence(scopeName, key);
    /******/ 			return getValidVersion(scope, scopeName, key, version);
    /******/ 		});
    /******/ 		var loadStrictSingletonVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
    /******/ 			ensureExistence(scopeName, key);
    /******/ 			return getStrictSingletonVersion(scope, scopeName, key, version);
    /******/ 		});
    /******/ 		var loadVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
    /******/ 			if(!scope || !__webpack_require__.o(scope, key)) return fallback();
    /******/ 			return get(findValidVersion(scope, key, version) || warnInvalidVersion(scope, scopeName, key, version) || findVersion(scope, key));
    /******/ 		});
    /******/ 		var loadSingletonVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
    /******/ 			if(!scope || !__webpack_require__.o(scope, key)) return fallback();
    /******/ 			return getSingletonVersion(scope, scopeName, key, version);
    /******/ 		});
    /******/ 		var loadStrictVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
    /******/ 			var entry = scope && __webpack_require__.o(scope, key) && findValidVersion(scope, key, version);
    /******/ 			return entry ? get(entry) : fallback();
    /******/ 		});
    /******/ 		var loadStrictSingletonVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
    /******/ 			if(!scope || !__webpack_require__.o(scope, key)) return fallback();
    /******/ 			return getStrictSingletonVersion(scope, scopeName, key, version);
    /******/ 		});
    /******/ 		var installedModules = {};
    /******/ 		var moduleToHandlerMapping = {
    /******/ 			"webpack/sharing/consume/default/react/react": () => (loadSingletonVersionCheckFallback("default", "react", [1,17,0,0], () => (Promise.all([__webpack_require__.e("reactVendor"), __webpack_require__.e("vendor")]).then(() => (() => (__webpack_require__(/*! react */ "./node_modules/react/index.js"))))))),
    /******/ 			"webpack/sharing/consume/default/react-dom/react-dom": () => (loadSingletonVersionCheckFallback("default", "react-dom", [1,17,0,0], () => (Promise.all([__webpack_require__.e("reactVendor"), __webpack_require__.e("vendor")]).then(() => (() => (__webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js"))))))),
    /******/ 			"webpack/sharing/consume/default/@patternfly/react-core/@patternfly/react-core": () => (loadStrictVersionCheckFallback("default", "@patternfly/react-core", [1,4,101,3], () => (Promise.all([__webpack_require__.e("pfVendor"), __webpack_require__.e("vendor")]).then(() => (() => (__webpack_require__(/*! @patternfly/react-core */ "./node_modules/@patternfly/react-core/dist/esm/index.js")))))))
    /******/ 		};
    /******/ 		var initialConsumes = ["webpack/sharing/consume/default/react/react","webpack/sharing/consume/default/react-dom/react-dom","webpack/sharing/consume/default/@patternfly/react-core/@patternfly/react-core"];
    /******/ 		initialConsumes.forEach((id) => {
    /******/ 			__webpack_require__.m[id] = (module) => {
    /******/ 				// Handle case when module is used sync
    /******/ 				installedModules[id] = 0;
    /******/ 				delete __webpack_require__.c[id];
    /******/ 				var factory = moduleToHandlerMapping[id]();
    /******/ 				if(typeof factory !== "function") throw new Error("Shared module is not available for eager consumption: " + id);
    /******/ 				module.exports = factory();
    /******/ 			}
    /******/ 		});
    /******/ 		var chunkMapping = {};
    /******/ 		__webpack_require__.f.consumes = (chunkId, promises) => {
    /******/ 			if(__webpack_require__.o(chunkMapping, chunkId)) {
    /******/ 				chunkMapping[chunkId].forEach((id) => {
    /******/ 					if(__webpack_require__.o(installedModules, id)) return promises.push(installedModules[id]);
    /******/ 					var onFactory = (factory) => {
    /******/ 						installedModules[id] = 0;
    /******/ 						__webpack_require__.m[id] = (module) => {
    /******/ 							delete __webpack_require__.c[id];
    /******/ 							module.exports = factory();
    /******/ 						}
    /******/ 					};
    /******/ 					var onError = (error) => {
    /******/ 						delete installedModules[id];
    /******/ 						__webpack_require__.m[id] = (module) => {
    /******/ 							delete __webpack_require__.c[id];
    /******/ 							throw error;
    /******/ 						}
    /******/ 					};
    /******/ 					try {
    /******/ 						var promise = moduleToHandlerMapping[id]();
    /******/ 						if(promise.then) {
    /******/ 							promises.push(installedModules[id] = promise.then(onFactory).catch(onError));
    /******/ 						} else onFactory(promise);
    /******/ 					} catch(e) { onError(e); }
    /******/ 				});
    /******/ 			}
    /******/ 		}
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/jsonp chunk loading */
    /******/ 	(() => {
    /******/ 		// no baseURI
    /******/ 		
    /******/ 		// object to store loaded and loading chunks
    /******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
    /******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
    /******/ 		var installedChunks = {
    /******/ 			"quickstarts": 0,
    /******/ 			"webpack_sharing_consume_default_react_react": 0,
    /******/ 			"webpack_sharing_consume_default_react-dom_react-dom": 0,
    /******/ 			"webpack_sharing_provide_default_patternfly_react-core-webpack_sharing_provide_default_react-d-edecac": 0
    /******/ 		};
    /******/ 		
    /******/ 		__webpack_require__.f.j = (chunkId, promises) => {
    /******/ 				// JSONP chunk loading for javascript
    /******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
    /******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
    /******/ 		
    /******/ 					// a Promise means "currently loading".
    /******/ 					if(installedChunkData) {
    /******/ 						promises.push(installedChunkData[2]);
    /******/ 					} else {
    /******/ 						if(!/^webpack_sharing_(consume_default_react(\-dom_react\-dom|_react)|provide_default_patternfly_react\-core\-webpack_sharing_provide_default_react\-d\-edecac)$/.test(chunkId)) {
    /******/ 							// setup Promise in chunk cache
    /******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
    /******/ 							promises.push(installedChunkData[2] = promise);
    /******/ 		
    /******/ 							// start chunk loading
    /******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
    /******/ 							// create error before stack unwound to get useful stacktrace later
    /******/ 							var error = new Error();
    /******/ 							var loadingEnded = (event) => {
    /******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
    /******/ 									installedChunkData = installedChunks[chunkId];
    /******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
    /******/ 									if(installedChunkData) {
    /******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
    /******/ 										var realSrc = event && event.target && event.target.src;
    /******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
    /******/ 										error.name = 'ChunkLoadError';
    /******/ 										error.type = errorType;
    /******/ 										error.request = realSrc;
    /******/ 										installedChunkData[1](error);
    /******/ 									}
    /******/ 								}
    /******/ 							};
    /******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
    /******/ 						} else installedChunks[chunkId] = 0;
    /******/ 					}
    /******/ 				}
    /******/ 		};
    /******/ 		
    /******/ 		// no prefetching
    /******/ 		
    /******/ 		// no preloaded
    /******/ 		
    /******/ 		// no HMR
    /******/ 		
    /******/ 		// no HMR manifest
    /******/ 		
    /******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
    /******/ 		
    /******/ 		// install a JSONP callback for chunk loading
    /******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
    /******/ 			var [chunkIds, moreModules, runtime] = data;
    /******/ 			// add "moreModules" to the modules object,
    /******/ 			// then flag all "chunkIds" as loaded and fire callback
    /******/ 			var moduleId, chunkId, i = 0;
    /******/ 			for(moduleId in moreModules) {
    /******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
    /******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
    /******/ 				}
    /******/ 			}
    /******/ 			if(runtime) var result = runtime(__webpack_require__);
    /******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
    /******/ 			for(;i < chunkIds.length; i++) {
    /******/ 				chunkId = chunkIds[i];
    /******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
    /******/ 					installedChunks[chunkId][0]();
    /******/ 				}
    /******/ 				installedChunks[chunkIds[i]] = 0;
    /******/ 			}
    /******/ 			return __webpack_require__.O(result);
    /******/ 		}
    /******/ 		
    /******/ 		var chunkLoadingGlobal = self["webpackChunkcloud_tutorials"] = self["webpackChunkcloud_tutorials"] || [];
    /******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
    /******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
    /******/ 	})();
    /******/ 	
    /************************************************************************/
    /******/ 	
    /******/ 	// module cache are used so entry inlining is disabled
    /******/ 	// startup
    /******/ 	// Load entry module and return exports
    /******/ 	__webpack_require__.O(undefined, ["pfVendor","vendor","webpack_sharing_consume_default_react_react","webpack_sharing_consume_default_react-dom_react-dom","src_quickstarts_components_Breadcrumb_tsx-src_quickstarts_components_QuickStartDrawer_tsx","webpack_sharing_provide_default_patternfly_react-core-webpack_sharing_provide_default_react-d-edecac","node_modules_webpack_hot_sync_log_"], () => (__webpack_require__("./src/quickstarts/entry.ts")))
    /******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["pfVendor","vendor","webpack_sharing_consume_default_react_react","webpack_sharing_consume_default_react-dom_react-dom","src_quickstarts_components_Breadcrumb_tsx-src_quickstarts_components_QuickStartDrawer_tsx","webpack_sharing_provide_default_patternfly_react-core-webpack_sharing_provide_default_react-d-edecac","node_modules_webpack_hot_sync_log_"], () => (__webpack_require__("./node_modules/webpack-dev-server/client/index.js?http://0.0.0.0:1337")))
    /******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
    /******/ 	window.quickstarts = __webpack_exports__;
    /******/ 	
    /******/ })()
    ;