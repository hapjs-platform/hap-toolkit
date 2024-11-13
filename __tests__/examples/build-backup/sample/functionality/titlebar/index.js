/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/functionality/titlebar/index.ux?uxType=page": module => {
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
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "自定义titleBar"
                                });
                            },
                            onLeftButtonClicked() {
                                _system.default.showToast({
                                    message: "leftButtonClicked"
                                });
                            },
                            onRightButtonClicked() {
                                _system.default.showToast({
                                    message: "rightButtonClicked"
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
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/functionality/titlebar/ux-title-bar.ux?uxType=comp": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _default = {
                            props: {
                                leftButton: {
                                    default: "/functionality/titlebar/images/arrow-left-1.png"
                                },
                                leftText: {},
                                rightButton: {},
                                rightText: {},
                                title: {
                                    default: "title"
                                },
                                textAlign: {
                                    default: "center"
                                },
                                textColor: {
                                    default: "#FFFFFF"
                                },
                                fontSize: {
                                    default: "35px"
                                },
                                backgroundColor: {
                                    default: "#0faeff"
                                }
                            },
                            leftButtonClicked() {
                                this.$emit("leftButtonClicked");
                            },
                            rightButtonClicked() {
                                this.$emit("rightButtonClicked");
                            }
                        };
                        exports.default = _default;
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../node_modules/less-loader/dist/cjs.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/functionality/titlebar/ux-title-bar.ux?uxType=comp": module => {
                    module.exports = {
                        ".ux-titleBar": {
                            width: "100%",
                            flexDirection: "row",
                            paddingTop: "0px",
                            paddingRight: "20px",
                            paddingBottom: "0px",
                            paddingLeft: "20px",
                            height: "100px",
                            alignItems: "center"
                        },
                        ".ux-titleBar .left-icon": {
                            height: "50px",
                            width: "50px",
                            resizeMode: "contain",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "ux-titleBar"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "left-icon"
                                } ]
                            }
                        },
                        ".ux-titleBar .left-button": {
                            width: "80px",
                            justifyContent: "flex-start",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "ux-titleBar"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "left-button"
                                } ]
                            }
                        },
                        ".ux-titleBar .right-button": {
                            width: "80px",
                            justifyContent: "flex-end",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "ux-titleBar"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "right-button"
                                } ]
                            }
                        },
                        ".ux-titleBar .title": {
                            flexGrow: 1,
                            fontSize: "35px",
                            textAlign: "center",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "ux-titleBar"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "title"
                                } ]
                            }
                        },
                        ".ux-titleBar .right-icon": {
                            height: "50px",
                            width: "50px",
                            resizeMode: "contain",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "ux-titleBar"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "right-icon"
                                } ]
                            }
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/functionality/titlebar/index.ux?uxType=page": module => {
                    module.exports = {
                        ".doc-page": {
                            flexDirection: "column"
                        },
                        ".item": {
                            marginTop: "50px"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/functionality/titlebar/index.ux?uxType=page&importNames[]=titlebar": module => {
                    module.exports = {
                        type: "div",
                        attr: {},
                        classList: [ "doc-page" ],
                        children: [ {
                            type: "div",
                            attr: {},
                            classList: [ "item" ],
                            children: [ {
                                type: "titlebar",
                                attr: {
                                    show: "true",
                                    title: "titleBar1",
                                    rightButton: "./images/share-1.png"
                                },
                                events: {
                                    "left-button-clicked": "onLeftButtonClicked",
                                    "right-button-clicked": "onRightButtonClicked"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item" ],
                            children: [ {
                                type: "titlebar",
                                attr: {
                                    title: "tileBar2",
                                    rightButton: "./images/share-1.png",
                                    backgroundColor: "#ffd341"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item" ],
                            children: [ {
                                type: "titlebar",
                                attr: {
                                    title: "titleBar3",
                                    rightText: "完成"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item" ],
                            children: [ {
                                type: "titlebar",
                                attr: {
                                    title: "tileBar4",
                                    backgroundColor: "#f2f3f4",
                                    textColor: "#333333",
                                    textAlign: "left",
                                    leftButton: "./images/arrow-left-0.png"
                                }
                            } ]
                        } ]
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/functionality/titlebar/ux-title-bar.ux?uxType=comp&": module => {
                    module.exports = {
                        type: "div",
                        attr: {},
                        classList: [ "ux-titleBar" ],
                        style: {
                            backgroundColor: function() {
                                return this.backgroundColor;
                            }
                        },
                        children: [ {
                            type: "div",
                            attr: {},
                            classList: [ "left-button" ],
                            events: {
                                click: "leftButtonClicked"
                            },
                            children: [ {
                                type: "image",
                                attr: {
                                    src: function() {
                                        return this.leftButton;
                                    }
                                },
                                shown: function() {
                                    return !this.leftText;
                                },
                                classList: [ "left-icon" ]
                            }, {
                                type: "text",
                                attr: {
                                    value: function() {
                                        return this.leftText;
                                    }
                                }
                            } ]
                        }, {
                            type: "text",
                            attr: {
                                value: function() {
                                    return this.title;
                                }
                            },
                            classList: [ "title" ],
                            style: {
                                color: function() {
                                    return this.textColor;
                                },
                                textAlign: function() {
                                    return this.textAlign;
                                }
                            }
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "right-button" ],
                            events: {
                                click: "rightButtonClicked"
                            },
                            children: [ {
                                type: "image",
                                attr: {
                                    src: function() {
                                        return this.rightButton;
                                    }
                                },
                                shown: function() {
                                    return this.rightButton && !this.rightText;
                                },
                                classList: [ "right-icon" ]
                            }, {
                                type: "text",
                                attr: {
                                    value: function() {
                                        return this.rightText;
                                    }
                                },
                                style: {
                                    color: function() {
                                        return this.textColor;
                                    }
                                }
                            } ]
                        } ]
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/ux-loader.js?cwd=<project-root>&type=import!./src/functionality/titlebar/ux-title-bar.ux?uxType=comp&name=titlebar": (__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
                    var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/functionality/titlebar/ux-title-bar.ux?uxType=comp");
                    $app_define$("@app-component/titlebar", [], (function($app_require$, $app_exports$, $app_module$) {
                        $app_script$($app_module$, $app_exports$, $app_require$);
                        if ($app_exports$.__esModule && $app_exports$.default) {
                            $app_module$.exports = $app_exports$.default;
                        }
                        $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/functionality/titlebar/ux-title-bar.ux?uxType=comp&");
                        $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../node_modules/less-loader/dist/cjs.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/functionality/titlebar/ux-title-bar.ux?uxType=comp");
                    }));
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
                __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/ux-loader.js?cwd=<project-root>&type=import!./src/functionality/titlebar/ux-title-bar.ux?uxType=comp&name=titlebar");
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/functionality/titlebar/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/functionality/titlebar/index.ux?uxType=page&importNames[]=titlebar");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/functionality/titlebar/index.ux?uxType=page");
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