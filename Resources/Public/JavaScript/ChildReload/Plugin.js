/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _neosUiExtensibility = __webpack_require__(2);

var _neosUiExtensibility2 = _interopRequireDefault(_neosUiExtensibility);

var _plowJs = __webpack_require__(7);

var _neosUiReduxStore = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Taken from here, as it's not exposed: '@neos-project/neos-ui-redux-store/src/CR/Nodes/helpers';
var parentNodeContextPath = function parentNodeContextPath(contextPath) {
    if (typeof contextPath !== 'string') {
        return null;
    }

    var _contextPath$split = contextPath.split('@'),
        _contextPath$split2 = _slicedToArray(_contextPath$split, 2),
        path = _contextPath$split2[0],
        context = _contextPath$split2[1];

    if (path.length === 0) {
        // we are at top level; so there is no parent anymore!
        return false;
    }

    return path.substr(0, path.lastIndexOf('/')) + '@' + context;
};

(0, _neosUiExtensibility2.default)('Internezzo.ChildReload:ChildReload', {}, function (globalRegistry) {
    var serverFeedbackHandlers = globalRegistry.get('serverFeedbackHandlers');
    var nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');

    var handleReload = function handleReload(feedbackPayload, _ref) {
        var store = _ref.store;

        var state = store.getState();

        var currentNodeContextPath = feedbackPayload.contextPath;
        // Search up the node tree, starting with the modified node
        while (true) {
            var getNodeByContextPathSelector = _neosUiReduxStore.selectors.CR.Nodes.makeGetNodeByContextPathSelector(currentNodeContextPath);
            var node = getNodeByContextPathSelector(state);
            var nodeTypeName = (0, _plowJs.$get)('nodeType', node);
            var nodeTypeDefinition = nodeTypesRegistry.getNodeType(nodeTypeName);

            // If any of the parents' nodetype has `ui.reloadIfChildChanged` configured, then reload the iframe
            if ((0, _plowJs.$get)('options.reloadIfChildChanged', nodeTypeDefinition)) {
                [].slice.call(document.querySelectorAll('iframe[name=neos-content-main]')).forEach(function (iframe) {
                    var iframeWindow = iframe.contentWindow || iframe;
                    iframeWindow.location.reload();
                });
                break;
            }
            // Don't traverse higher then the first found document node
            var isDocument = nodeTypesRegistry.hasRole(nodeTypeName, 'document');
            if (isDocument) {
                break;
            }
            currentNodeContextPath = parentNodeContextPath(currentNodeContextPath);
        }
    };

    // We need to run after the main NodeCreated feedback on creation
    serverFeedbackHandlers.set('Neos.Neos.Ui:NodeCreated/ChildReload', handleReload, 'after Neos.Neos.Ui:NodeCreated/Main');
    // We need to run before the main NodeCreated feedback on removal
    serverFeedbackHandlers.set('Neos.Neos.Ui:RemoveNode/ChildReload', handleReload, 'before Neos.Neos.Ui:RemoveNode/Main');
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createConsumerApi = undefined;

var _createConsumerApi = __webpack_require__(3);

var _createConsumerApi2 = _interopRequireDefault(_createConsumerApi);

var _readFromConsumerApi = __webpack_require__(6);

var _readFromConsumerApi2 = _interopRequireDefault(_readFromConsumerApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _readFromConsumerApi2.default)('manifest');
exports.createConsumerApi = _createConsumerApi2.default;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createConsumerApi;

var _package = __webpack_require__(4);

var _manifest = __webpack_require__(5);

var _manifest2 = _interopRequireDefault(_manifest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createReadOnlyValue = function createReadOnlyValue(value) {
    return {
        value: value,
        writable: false,
        enumerable: false,
        configurable: true
    };
};

function createConsumerApi(manifests, exposureMap) {
    var api = {};

    Object.keys(exposureMap).forEach(function (key) {
        Object.defineProperty(api, key, createReadOnlyValue(exposureMap[key]));
    });

    Object.defineProperty(api, '@manifest', createReadOnlyValue((0, _manifest2.default)(manifests)));

    Object.defineProperty(window, '@Neos:HostPluginAPI', createReadOnlyValue(api));
    Object.defineProperty(window['@Neos:HostPluginAPI'], 'VERSION', createReadOnlyValue(_package.version));
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = {"name":"@neos-project/neos-ui-extensibility","version":"1.0.9","description":"Extensibility mechanisms for the Neos CMS UI","main":"./src/index.js","scripts":{"prebuild":"check-dependencies && yarn clean","test":"yarn jest -- -w 2 --coverage","test:watch":"yarn jest -- --watch","build":"exit 0","build:watch":"exit 0","clean":"rimraf ./lib ./dist","lint":"eslint src","jest":"NODE_ENV=test jest"},"devDependencies":{"@neos-project/babel-preset-neos-ui":"1.0.9","@neos-project/jest-preset-neos-ui":"1.0.9"},"dependencies":{"@neos-project/build-essentials":"1.0.9","@neos-project/positional-array-sorter":"1.0.9","babel-core":"^6.13.2","babel-eslint":"^7.1.1","babel-loader":"^7.1.2","babel-plugin-transform-decorators-legacy":"^1.3.4","babel-plugin-transform-object-rest-spread":"^6.20.1","babel-plugin-webpack-alias":"^2.1.1","babel-preset-es2015":"^6.13.2","babel-preset-react":"^6.3.13","babel-preset-stage-0":"^6.3.13","chalk":"^1.1.3","css-loader":"^0.28.4","file-loader":"^1.1.5","json-loader":"^0.5.4","postcss-loader":"^2.0.10","react-dev-utils":"^0.5.0","style-loader":"^0.19.0"},"bin":{"neos-react-scripts":"./bin/neos-react-scripts.js"},"jest":{"preset":"@neos-project/jest-preset-neos-ui"}}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (manifests) {
    return function manifest(identifier, options, bootstrap) {
        manifests.push(_defineProperty({}, identifier, {
            options: options,
            bootstrap: bootstrap
        }));
    };
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = readFromConsumerApi;
function readFromConsumerApi(key) {
    return function () {
        if (window['@Neos:HostPluginAPI'] && window['@Neos:HostPluginAPI']['@' + key]) {
            var _window$NeosHostPlu;

            return (_window$NeosHostPlu = window['@Neos:HostPluginAPI'])['@' + key].apply(_window$NeosHostPlu, arguments);
        }

        throw new Error('You are trying to read from a consumer api that hasn\'t been initialized yet!');
    };
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _readFromConsumerApi = __webpack_require__(6);

var _readFromConsumerApi2 = _interopRequireDefault(_readFromConsumerApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _readFromConsumerApi2.default)('vendor')().plow;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _readFromConsumerApi = __webpack_require__(6);

var _readFromConsumerApi2 = _interopRequireDefault(_readFromConsumerApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _readFromConsumerApi2.default)('NeosProjectPackages')().NeosUiReduxStore;

/***/ })
/******/ ]);
//# sourceMappingURL=Plugin.js.map