/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/container/div/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _default = {
                            private: {
                                componentName: "div",
                                state: "操作事件类型"
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Div"
                                });
                            },
                            getEventType(event) {
                                this.state = event.type;
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/container/div/index.ux?uxType=page": module => {
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
                            flexDirection: "column"
                        },
                        ".item-title": {
                            lineHeight: "100px",
                            backgroundColor: "#fbf9fe"
                        },
                        ".item": {
                            height: "150px",
                            width: "150px",
                            textAlign: "center"
                        },
                        ".color-1": {
                            backgroundColor: "#09ba07"
                        },
                        ".color-2": {
                            backgroundColor: "#f76160"
                        },
                        ".color-3": {
                            backgroundColor: "#0faeff"
                        },
                        ".bg-png": {
                            height: "120px",
                            backgroundImage: "https://doc.quickapp.cn/assets/images/logo.png"
                        },
                        ".bg-webp": {
                            height: "480px",
                            width: "360px",
                            backgroundImage: "https://www.gstatic.com/webp/gallery/1.webp"
                        },
                        ".bg-gif": {
                            height: "480px",
                            width: "360px",
                            backgroundImage: "http://www.w3school.com.cn/i/eg_cute.gif"
                        },
                        ".bg-jpg": {
                            height: "480px",
                            width: "360px",
                            backgroundImage: "https://doc.quickapp.cn/tutorial/widgets/img/canvas_drawimage.jpg"
                        },
                        ".bg-load-error": {
                            height: "480px",
                            width: "360px",
                            backgroundImage: "https://doc.quickapp.cn/assets/images/l.png"
                        },
                        ".touch-region": {
                            width: "80%",
                            height: "200px",
                            backgroundColor: "#007dff"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/container/div/index.ux?uxType=page&": module => {
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
                                    value: "flex-direction: row;"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                style: {
                                    flexDirection: "row"
                                },
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "1"
                                    },
                                    classList: [ "item", "color-1" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: "2"
                                    },
                                    classList: [ "item", "color-2" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: "3"
                                    },
                                    classList: [ "item", "color-3" ]
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "flex-direction: column;"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                style: {
                                    flexDirection: "column",
                                    alignItems: "flex-start"
                                },
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "1"
                                    },
                                    classList: [ "item", "color-1" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: "2"
                                    },
                                    classList: [ "item", "color-2" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: "3"
                                    },
                                    classList: [ "item", "color-3" ]
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "justify-content: flex-end;"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                style: {
                                    flexDirection: "row",
                                    justifyContent: "flex-end"
                                },
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "1"
                                    },
                                    classList: [ "item", "color-1" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: "2"
                                    },
                                    classList: [ "item", "color-2" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: "3"
                                    },
                                    classList: [ "item", "color-3" ]
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "justify-content: space-around;"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                style: {
                                    flexDirection: "row",
                                    justifyContent: "space-around"
                                },
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "1"
                                    },
                                    classList: [ "item", "color-1" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: "2"
                                    },
                                    classList: [ "item", "color-2" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: "3"
                                    },
                                    classList: [ "item", "color-3" ]
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "align-items: center;"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                style: {
                                    flexDirection: "column",
                                    alignItems: "center"
                                },
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "1"
                                    },
                                    classList: [ "item", "color-1" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: "2"
                                    },
                                    classList: [ "item", "color-2" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: "3"
                                    },
                                    classList: [ "item", "color-3" ]
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "align-self: flex-end;"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                style: {
                                    flexDirection: "column",
                                    alignItems: "center"
                                },
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "1"
                                    },
                                    classList: [ "item", "color-1" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: "2"
                                    },
                                    classList: [ "item", "color-2" ],
                                    style: {
                                        alignSelf: "flex-end"
                                    }
                                }, {
                                    type: "text",
                                    attr: {
                                        value: "3"
                                    },
                                    classList: [ "item", "color-3" ]
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "background-image 加载网络图片【https】：png格式"
                                }
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "bg-png" ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "background-image 加载网络图片【https】：webp格式"
                                }
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "bg-webp" ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "background-image 加载网络图片【http】：gif格式"
                                }
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "bg-gif" ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "background-image 加载网络图片【https】：jpg格式"
                                }
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "bg-jpg" ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "background-image 加载错误的网络图片地址：加载错误，显示空白"
                                }
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "bg-load-error" ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "请触摸，滑动，长按，以下区域，查看事件类型"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "text",
                                attr: {
                                    value: function() {
                                        return "" + "当前事件类型：" + this.state;
                                    }
                                }
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "touch-region" ],
                                events: {
                                    touchstart: "getEventType",
                                    click: "getEventType",
                                    longpress: "getEventType",
                                    touchmove: "getEventType",
                                    touchend: "getEventType"
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/container/div/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/container/div/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/container/div/index.ux?uxType=page");
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