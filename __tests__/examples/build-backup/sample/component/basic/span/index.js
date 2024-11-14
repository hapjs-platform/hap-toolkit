/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/basic/span/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _default = {
                            private: {
                                componentName: "span"
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Span"
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/basic/span/index.ux?uxType=page": module => {
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
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/basic/span/index.ux?uxType=page&": module => {
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
                                    value: "作为text的子组件"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "text",
                                attr: {},
                                children: [ {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#f76160"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#f76160",
                                        textDecoration: "underline"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#f76160",
                                        textDecoration: "line-through"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#f76160",
                                        fontStyle: "italic"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#f76160",
                                        fontWeight: "bold"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span."
                                    },
                                    style: {
                                        color: "#f76160",
                                        fontSize: "50px"
                                    }
                                } ]
                            }, {
                                type: "text",
                                attr: {
                                    value: "作为text的子组件: 给text设置样式"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "text",
                                attr: {},
                                style: {
                                    lines: 1,
                                    textOverflow: "ellipsis",
                                    color: "#09ba07"
                                },
                                children: [ {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#f76160"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#f76160",
                                        textDecoration: "underline"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#f76160",
                                        textDecoration: "line-through"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#f76160",
                                        fontStyle: "italic"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#f76160",
                                        fontWeight: "bold"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span."
                                    },
                                    style: {
                                        color: "#f76160",
                                        fontSize: "50px"
                                    }
                                } ]
                            }, {
                                type: "text",
                                attr: {
                                    value: "作为a的子组件"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "a",
                                attr: {
                                    href: "https://www.quickapp.cn/"
                                },
                                children: [ {
                                    type: "span",
                                    attr: {
                                        value: "链接示例 "
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#0faeff"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#0faeff",
                                        textDecoration: "underline"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#0faeff",
                                        textDecoration: "line-through"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#0faeff",
                                        fontStyle: "italic"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#0faeff",
                                        fontWeight: "bold"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span."
                                    },
                                    style: {
                                        color: "#0faeff",
                                        fontSize: "50px"
                                    }
                                } ]
                            }, {
                                type: "text",
                                attr: {
                                    value: "作为a的子组件: 给a设置样式"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "a",
                                attr: {
                                    href: "https://www.quickapp.cn/"
                                },
                                style: {
                                    lines: 1,
                                    textOverflow: "ellipsis",
                                    color: "#09ba07"
                                },
                                children: [ {
                                    type: "span",
                                    attr: {
                                        value: "链接示例 "
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#0faeff"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#0faeff",
                                        textDecoration: "underline"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#0faeff",
                                        textDecoration: "line-through"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#0faeff",
                                        fontStyle: "italic"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span,"
                                    },
                                    style: {
                                        color: "#0faeff",
                                        fontWeight: "bold"
                                    }
                                }, {
                                    type: "span",
                                    attr: {
                                        value: "I am span."
                                    },
                                    style: {
                                        color: "#0faeff",
                                        fontSize: "50px"
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/basic/span/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/basic/span/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/basic/span/index.ux?uxType=page");
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