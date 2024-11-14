/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/basic/text/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _default = {
                            private: {
                                componentName: "text",
                                loneText: "本框架是一套以前端开发技术栈为主进行应用开发的框架，采用流行的前端开发模式，贴合主流前端开发者的思维习惯，同时大幅提升应用的性能，提供大量前端环境无法使用的系统能力，以及很多第三方服务的对接能力。"
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Text"
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/basic/text/index.ux?uxType=page": module => {
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
                        ".item-title": {
                            paddingTop: "50px",
                            paddingBottom: "20px",
                            color: "#aaaaaa"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/basic/text/index.ux?uxType=page&": module => {
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
                                type: "text",
                                attr: {
                                    value: "在text中span的多种表现形式"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "text",
                                attr: {},
                                classList: [ "txt" ],
                                children: [ {
                                    type: "span",
                                    attr: {
                                        value: "文本内容"
                                    },
                                    style: {
                                        color: "#09ba07"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "文本内容"
                                    },
                                    style: {
                                        color: "#0faeff",
                                        textDecoration: "underline"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "文本内容"
                                    },
                                    style: {
                                        color: "#f76160",
                                        textDecoration: "line-through"
                                    }
                                } ]
                            }, {
                                type: "text",
                                attr: {
                                    value: "在text中a的多种表现形式"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "text",
                                attr: {},
                                classList: [ "txt" ],
                                children: [ {
                                    type: "a",
                                    attr: {
                                        href: "https://www.quickapp.cn/",
                                        value: "文本内容"
                                    },
                                    style: {
                                        color: "#09ba07"
                                    }
                                }, {
                                    type: "a",
                                    attr: {
                                        href: "https://www.quickapp.cn/",
                                        value: "文本内容"
                                    },
                                    style: {
                                        color: "#0faeff",
                                        textDecoration: "underline"
                                    }
                                }, {
                                    type: "a",
                                    attr: {
                                        href: "https://www.quickapp.cn/",
                                        value: "文本内容"
                                    },
                                    style: {
                                        color: "#f76160",
                                        textDecoration: "line-through"
                                    }
                                } ]
                            }, {
                                type: "text",
                                attr: {
                                    value: "lines: 默认值-1"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "text",
                                attr: {
                                    value: function() {
                                        return this.loneText;
                                    }
                                },
                                classList: [ "txt" ]
                            }, {
                                type: "text",
                                attr: {
                                    value: "lines: 设置为3; text-overflow: clip"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "text",
                                attr: {
                                    value: function() {
                                        return this.loneText;
                                    }
                                },
                                classList: [ "txt" ],
                                style: {
                                    lines: 3,
                                    textOverflow: "clip"
                                }
                            }, {
                                type: "text",
                                attr: {
                                    value: "lines: 设置为3; text-overflow: ellipsis"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "text",
                                attr: {
                                    value: function() {
                                        return this.loneText;
                                    }
                                },
                                classList: [ "txt" ],
                                style: {
                                    lines: 3,
                                    textOverflow: "ellipsis"
                                }
                            }, {
                                type: "text",
                                attr: {
                                    value: "line-height: 设置为50px"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "text",
                                attr: {
                                    value: function() {
                                        return this.loneText;
                                    }
                                },
                                classList: [ "txt" ],
                                style: {
                                    lineHeight: "50px"
                                }
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/basic/text/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/basic/text/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/basic/text/index.ux?uxType=page");
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