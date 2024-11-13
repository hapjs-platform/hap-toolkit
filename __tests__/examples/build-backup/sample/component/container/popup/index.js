/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/container/popup/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$("@app-module/system.prompt"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            private: {
                                componentName: "popup",
                                posList: [ "top", "left", "bottom", "right", "topLeft", "topRight", "bottomLeft", "bottomRight" ],
                                currentDire: "bottom"
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "popup"
                                });
                            },
                            show() {
                                this.$element("picker").show();
                            },
                            selectDire(e) {
                                this.currentDire = e.newValue;
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../node_modules/less-loader/dist/cjs.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/container/popup/index.ux?uxType=page": module => {
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
                            marginTop: "0px",
                            marginRight: "50px",
                            marginBottom: "50px",
                            marginLeft: "50px",
                            flexDirection: "column",
                            alignItems: "center"
                        },
                        ".item-container-wrap": {
                            flexDirection: "column",
                            position: "fixed",
                            left: "0px",
                            right: "0px",
                            top: "500px",
                            bottom: "0px",
                            justifyContent: "space-between",
                            zIndex: 0
                        },
                        ".item-container-wrap-inner": {
                            flexDirection: "row",
                            justifyContent: "space-between"
                        },
                        ".item-container-wrap-inner-item": {
                            height: "90px",
                            width: "200px",
                            borderTopWidth: "1px",
                            borderRightWidth: "1px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "1px",
                            borderStyle: "solid",
                            borderTopColor: "#dfdfdf",
                            borderRightColor: "#dfdfdf",
                            borderBottomColor: "#dfdfdf",
                            borderLeftColor: "#dfdfdf"
                        },
                        ".item-container-wrap-inner-item-center": {
                            flexGrow: 1,
                            textAlign: "center"
                        },
                        ".item-container-select": {
                            top: "300px",
                            position: "fixed",
                            width: "100%",
                            paddingTop: "30px",
                            paddingRight: "30px",
                            paddingBottom: "30px",
                            paddingLeft: "30px",
                            borderTopWidth: "1px",
                            borderBottomWidth: "1px",
                            borderTopColor: "#bbbbbb",
                            borderRightColor: "#bbbbbb",
                            borderBottomColor: "#bbbbbb",
                            borderLeftColor: "#bbbbbb",
                            marginBottom: "10px"
                        },
                        ".item-container-poptext": {
                            paddingTop: "30px",
                            paddingRight: "30px",
                            paddingBottom: "30px",
                            paddingLeft: "30px"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/container/popup/index.ux?uxType=page&": module => {
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
                                classList: [ "item-container-wrap" ],
                                children: [ {
                                    type: "div",
                                    attr: {},
                                    classList: [ "item-container-wrap-inner" ],
                                    children: [ {
                                        type: "div",
                                        attr: {
                                            id: "popup1"
                                        },
                                        classList: [ "item-container-wrap-inner-item" ],
                                        id: "popup1",
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: "位置1"
                                            },
                                            classList: [ "item-container-wrap-inner-item-center" ]
                                        } ]
                                    }, {
                                        type: "div",
                                        attr: {
                                            id: "popup2"
                                        },
                                        classList: [ "item-container-wrap-inner-item" ],
                                        id: "popup2",
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: "位置2"
                                            },
                                            classList: [ "item-container-wrap-inner-item-center" ]
                                        } ]
                                    }, {
                                        type: "div",
                                        attr: {
                                            id: "popup3"
                                        },
                                        classList: [ "item-container-wrap-inner-item" ],
                                        id: "popup3",
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: "位置3"
                                            },
                                            classList: [ "item-container-wrap-inner-item-center" ]
                                        } ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {
                                        id: "popup4"
                                    },
                                    classList: [ "item-container-wrap-inner-item" ],
                                    style: {
                                        width: "100%"
                                    },
                                    id: "popup4",
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "位置4"
                                        },
                                        classList: [ "item-container-wrap-inner-item-center" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "item-container-wrap-inner" ],
                                    children: [ {
                                        type: "div",
                                        attr: {
                                            id: "popup5"
                                        },
                                        classList: [ "item-container-wrap-inner-item" ],
                                        id: "popup5",
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: "位置5"
                                            },
                                            classList: [ "item-container-wrap-inner-item-center" ]
                                        } ]
                                    }, {
                                        type: "div",
                                        attr: {
                                            id: "popup6"
                                        },
                                        classList: [ "item-container-wrap-inner-item" ],
                                        id: "popup6",
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: "位置6"
                                            },
                                            classList: [ "item-container-wrap-inner-item-center" ]
                                        } ]
                                    }, {
                                        type: "div",
                                        attr: {
                                            id: "popup7"
                                        },
                                        classList: [ "item-container-wrap-inner-item" ],
                                        id: "popup7",
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: "位置7"
                                            },
                                            classList: [ "item-container-wrap-inner-item-center" ]
                                        } ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "item-container-select" ],
                                    events: {
                                        click: "show"
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "选择popup出现的方向——当前选择:"
                                        },
                                        classList: [ "label" ]
                                    }, {
                                        type: "picker",
                                        attr: {
                                            type: "text",
                                            range: function() {
                                                return this.posList;
                                            },
                                            value: function() {
                                                return this.currentDire;
                                            },
                                            id: "picker"
                                        },
                                        classList: [ "picker" ],
                                        events: {
                                            change: "selectDire"
                                        },
                                        id: "picker"
                                    } ]
                                }, {
                                    type: "popup",
                                    attr: {
                                        target: "popup1",
                                        placement: function() {
                                            return this.currentDire;
                                        }
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "popup测试"
                                        },
                                        classList: [ "item-container-poptext" ]
                                    } ]
                                }, {
                                    type: "popup",
                                    attr: {
                                        target: "popup2",
                                        placement: function() {
                                            return this.currentDire;
                                        }
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "popup测试"
                                        },
                                        classList: [ "item-container-poptext" ]
                                    } ]
                                }, {
                                    type: "popup",
                                    attr: {
                                        target: "popup3",
                                        placement: function() {
                                            return this.currentDire;
                                        }
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "popup测试"
                                        },
                                        classList: [ "item-container-poptext" ]
                                    } ]
                                }, {
                                    type: "popup",
                                    attr: {
                                        target: "popup4",
                                        placement: function() {
                                            return this.currentDire;
                                        }
                                    },
                                    style: {
                                        maskColor: "#ff0000"
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "popup测试"
                                        },
                                        classList: [ "item-container-poptext" ]
                                    } ]
                                }, {
                                    type: "popup",
                                    attr: {
                                        target: "popup5",
                                        placement: function() {
                                            return this.currentDire;
                                        }
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "popup测试"
                                        },
                                        classList: [ "item-container-poptext" ]
                                    } ]
                                }, {
                                    type: "popup",
                                    attr: {
                                        target: "popup6",
                                        placement: function() {
                                            return this.currentDire;
                                        }
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "popup测试"
                                        },
                                        classList: [ "item-container-poptext" ]
                                    } ]
                                }, {
                                    type: "popup",
                                    attr: {
                                        target: "popup7",
                                        placement: function() {
                                            return this.currentDire;
                                        }
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "popup测试"
                                        },
                                        classList: [ "item-container-poptext" ]
                                    } ]
                                } ]
                            } ]
                        } ]
                    };
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/container/popup/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/container/popup/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../node_modules/less-loader/dist/cjs.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/container/popup/index.ux?uxType=page");
                }));
                $app_bootstrap$("@app-component/index", {
                    packagerVersion: "<VERSION>"
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