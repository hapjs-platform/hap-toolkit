/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/basic/progress/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _default = {
                            private: {
                                componentName: "progress"
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Progress"
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/basic/progress/index.ux?uxType=page": module => {
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
                            marginBottom: "60px",
                            flexDirection: "column"
                        },
                        ".item-content-circular": {
                            marginBottom: "60px",
                            flexDirection: "column",
                            alignItems: "center"
                        },
                        ".progerss": {
                            flex: 1,
                            paddingLeft: "20px",
                            paddingRight: "20px",
                            paddingTop: "20px",
                            paddingBottom: "20px"
                        },
                        ".item-title": {
                            textAlign: "center"
                        },
                        ".circular-1": {
                            width: "40px",
                            height: "40px"
                        },
                        ".circular-2": {
                            width: "60px",
                            height: "60px"
                        },
                        ".circular-3": {
                            width: "80px",
                            height: "80px"
                        },
                        ".circular-4": {
                            width: "100px",
                            height: "100px"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/basic/progress/index.ux?uxType=page&": module => {
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
                                    type: "text",
                                    attr: {
                                        value: "10%（默认：颜色#33b4ff, 高度32px）"
                                    },
                                    classList: [ "item-title" ]
                                }, {
                                    type: "progress",
                                    attr: {
                                        percent: "10"
                                    },
                                    classList: [ "progerss" ]
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "20%"
                                    },
                                    classList: [ "item-title" ]
                                }, {
                                    type: "progress",
                                    attr: {
                                        percent: "20"
                                    },
                                    classList: [ "progerss" ],
                                    style: {
                                        color: "#09ba07",
                                        strokeWidth: "10px"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "40%"
                                    },
                                    classList: [ "item-title" ]
                                }, {
                                    type: "progress",
                                    attr: {
                                        percent: "40"
                                    },
                                    classList: [ "progerss" ],
                                    style: {
                                        color: "#0faeff",
                                        strokeWidth: "10px"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "60%"
                                    },
                                    classList: [ "item-title" ]
                                }, {
                                    type: "progress",
                                    attr: {
                                        percent: "60"
                                    },
                                    classList: [ "progerss" ],
                                    style: {
                                        color: "#A020F0",
                                        strokeWidth: "10px"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "80%"
                                    },
                                    classList: [ "item-title" ]
                                }, {
                                    type: "progress",
                                    attr: {
                                        percent: "80"
                                    },
                                    classList: [ "progerss" ],
                                    style: {
                                        color: "#f76160",
                                        strokeWidth: "10px"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-circular" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "默认：宽度高度32px"
                                    },
                                    classList: [ "item-title" ]
                                }, {
                                    type: "progress",
                                    attr: {
                                        type: "circular"
                                    },
                                    classList: [ "circular", "circular_0" ],
                                    style: {
                                        color: "#09ba07"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-circular" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "高度40px"
                                    },
                                    classList: [ "item-title" ]
                                }, {
                                    type: "progress",
                                    attr: {
                                        type: "circular"
                                    },
                                    classList: [ "circular", "circular-1" ],
                                    style: {
                                        color: "#09ba07"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-circular" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "高度60px"
                                    },
                                    classList: [ "item-title" ]
                                }, {
                                    type: "progress",
                                    attr: {
                                        type: "circular"
                                    },
                                    classList: [ "circular", "circular-2" ],
                                    style: {
                                        color: "#0faeff"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-circular" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "高度80px"
                                    },
                                    classList: [ "item-title" ]
                                }, {
                                    type: "progress",
                                    attr: {
                                        type: "circular"
                                    },
                                    classList: [ "circular", "circular-3" ],
                                    style: {
                                        color: "#A020F0"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-circular" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "高度100px"
                                    },
                                    classList: [ "item-title" ]
                                }, {
                                    type: "progress",
                                    attr: {
                                        type: "circular"
                                    },
                                    classList: [ "circular", "circular-4" ],
                                    style: {
                                        color: "#f76160"
                                    }
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
                var $app_style$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/basic/progress/index.ux?uxType=page");
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/basic/progress/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/basic/progress/index.ux?uxType=page&");
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