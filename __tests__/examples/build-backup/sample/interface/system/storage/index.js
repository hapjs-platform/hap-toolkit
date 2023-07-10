/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/system/storage/index.ux?uxType=page": (module, __unused_webpack_exports, __webpack_require__) => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$("@app-module/system.storage"));
                        var _system2 = _interopRequireDefault($app_require$("@app-module/system.prompt"));
                        var _catching = _interopRequireDefault(__webpack_require__("./node_modules/catching/index.js"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            private: {
                                componentName: "storage",
                                storageKey: "",
                                storageValue: "",
                                inputKey: "",
                                inputValue: ""
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Storage"
                                });
                            },
                            keyFn(e) {
                                this.storageKey = e.text;
                            },
                            valueFn(e) {
                                this.storageValue = e.text;
                            },
                            async setStorage() {
                                const self = this;
                                if (this.storageKey && this.storageValue) {
                                    await _system.default.set({
                                        key: this.storageKey,
                                        value: this.storageValue
                                    });
                                    _system2.default.showToast({
                                        message: "{key:" + self.storageKey + ",value:" + self.storageValue + "}"
                                    });
                                } else {
                                    _system2.default.showToast({
                                        message: "请输入key和value值"
                                    });
                                }
                            },
                            async getStorageUseAsync() {
                                const ret = await (0, _catching.default)(_system.default.get({
                                    key: this.storageKey
                                }));
                                _system2.default.showToast({
                                    message: "value: " + ret.data
                                });
                            },
                            async getStorageUseAsyncTryCatch() {
                                try {
                                    const ret = await _system.default.get({
                                        key: this.storageKey
                                    });
                                    _system2.default.showToast({
                                        message: "value: " + ret.data
                                    });
                                } catch (err) {
                                    _system2.default.showToast({
                                        message: "err: " + JSON.stringify(err)
                                    });
                                }
                            },
                            getStorageNormal() {
                                _system.default.get({
                                    key: this.storageKey,
                                    success: function(ret) {
                                        _system2.default.showToast({
                                            message: "value: " + ret
                                        });
                                    }
                                });
                            },
                            clearStorage() {
                                const self = this;
                                _system.default.clear({
                                    success: function() {
                                        self.storageKey = "";
                                        self.storageValue = "";
                                        self.inputKey = "";
                                        self.inputValue = "";
                                        _system2.default.showToast({
                                            message: "success"
                                        });
                                    }
                                });
                            }
                        };
                        exports.default = _default;
                        const moduleOwn = exports.default || module.exports;
                        const accessors = [ "public", "protected", "private" ];
                        if (moduleOwn.data && accessors.some((function(acc) {
                            return moduleOwn[acc];
                        }))) {
                            throw new Error('页面VM对象中的属性data不可与"' + accessors.join(",") + '"同时存在，请使用private替换data名称');
                        } else if (!moduleOwn.data) {
                            moduleOwn.data = {};
                            moduleOwn._descriptor = {};
                            accessors.forEach((function(acc) {
                                const accType = typeof moduleOwn[acc];
                                if (accType === "object") {
                                    moduleOwn.data = Object.assign(moduleOwn.data, moduleOwn[acc]);
                                    for (const name in moduleOwn[acc]) {
                                        moduleOwn._descriptor[name] = {
                                            access: acc
                                        };
                                    }
                                } else if (accType === "function") {
                                    console.warn("页面VM对象中的属性" + acc + "的值不能是函数，请使用对象");
                                }
                            }));
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/system/storage/index.ux?uxType=page": module => {
                    module.exports = {
                        ".doc-page": {
                            flex: 1,
                            flexDirection: "column"
                        },
                        ".page-title-wrap": {
                            paddingTop: "50px",
                            paddingBottom: "80px",
                            justifyContent: "center"
                        },
                        ".page-title": {
                            paddingTop: "30px",
                            paddingBottom: "30px",
                            paddingLeft: "40px",
                            paddingRight: "40px",
                            borderTopColor: "#bbbbbb",
                            borderRightColor: "#bbbbbb",
                            borderBottomColor: "#bbbbbb",
                            borderLeftColor: "#bbbbbb",
                            color: "#bbbbbb",
                            borderBottomWidth: "2px"
                        },
                        ".btn": {
                            height: "80px",
                            textAlign: "center",
                            borderRadius: "5px",
                            marginRight: "60px",
                            marginLeft: "60px",
                            marginBottom: "50px",
                            color: "#ffffff",
                            fontSize: "30px",
                            backgroundColor: "#0faeff"
                        },
                        ".text-center": {
                            justifyContent: "center"
                        },
                        ".m-bottom-lg": {
                            marginBottom: "40px"
                        },
                        ".m-bottom-md": {
                            marginBottom: "20px"
                        },
                        ".m-bottom-sm": {
                            marginBottom: "10px"
                        },
                        ".m-bottom-xs": {
                            marginBottom: "5px"
                        },
                        ".vertical": {
                            flexDirection: "column"
                        },
                        ".item-container": {
                            marginBottom: "50px",
                            marginRight: "60px",
                            marginLeft: "60px",
                            flexDirection: "column"
                        },
                        ".item-content": {
                            flexDirection: "column",
                            backgroundColor: "#ffffff",
                            paddingLeft: "30px",
                            paddingRight: "30px",
                            paddingTop: "15px",
                            paddingBottom: "15px",
                            marginBottom: "100px"
                        },
                        ".item-content-detail": {
                            alignItems: "center"
                        },
                        ".input": {
                            flex: 1,
                            fontSize: "30px",
                            paddingLeft: "20px"
                        },
                        ".txt": {
                            width: "100px",
                            paddingTop: "15px",
                            paddingBottom: "15px",
                            textAlign: "right"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/system/storage/index.ux?uxType=page&": module => {
                    module.exports = {
                        type: "div",
                        attr: {},
                        classList: [ "doc-page" ],
                        children: [ {
                            type: "div",
                            attr: {},
                            classList: [ "page-title-wrap" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: function() {
                                        return this.componentName;
                                    }
                                },
                                classList: [ "page-title" ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "div",
                                    attr: {},
                                    classList: [ "item-content-detail" ],
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "key:"
                                        },
                                        classList: [ "txt" ]
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "text",
                                            placeholder: "请输入key",
                                            value: function() {
                                                return this.storageKey;
                                            }
                                        },
                                        classList: [ "input" ],
                                        events: {
                                            change: "keyFn"
                                        }
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "item-content-detail" ],
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "value:"
                                        },
                                        classList: [ "txt" ]
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "text",
                                            placeholder: "请输入value",
                                            value: function() {
                                                return this.storageValue;
                                            }
                                        },
                                        classList: [ "input" ],
                                        events: {
                                            change: "valueFn"
                                        }
                                    } ]
                                } ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "设置storage"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "setStorage"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: function() {
                                        return "" + "读取storage key:" + this.storageKey;
                                    }
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "getStorageUseAsync"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "清除storage"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "clearStorage"
                                }
                            } ]
                        } ]
                    };
                },
                "./node_modules/catching/index.js": module => {
                    "use strict";
                    function catching(promise) {
                        return Promise.resolve(promise).catch((function(err) {
                            return err;
                        }));
                    }
                    module.exports = catching;
                }
            };
            var __webpack_module_cache__ = {};
            function __webpack_require__(moduleId) {
                var cachedModule = __webpack_module_cache__[moduleId];
                if (cachedModule !== undefined) {
                    return cachedModule.exports;
                }
                var module = __webpack_module_cache__[moduleId] = {
                    exports: {}
                };
                __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
                return module.exports;
            }
            var __webpack_exports__ = {};
            (() => {
                var $app_style$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/system/storage/index.ux?uxType=page");
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/system/storage/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/system/storage/index.ux?uxType=page&");
                    $app_module$.exports.style = $app_style$;
                }));
                $app_bootstrap$("@app-component/index", {
                    packagerVersion: undefined
                });
            })();
        })();
    };
    if (typeof window === "undefined") {
        return createPageHandler();
    } else {
        window.createPageHandler = createPageHandler;
    }
})();