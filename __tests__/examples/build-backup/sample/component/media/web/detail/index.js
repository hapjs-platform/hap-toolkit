/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/media/web/detail/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$("@app-module/system.router"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            data: {
                                websrc: "",
                                titleBarParams: {
                                    type: "titlebar",
                                    config: {
                                        titleBarShow: true
                                    }
                                },
                                allow: false
                            },
                            onInit() {
                                this.websrc = this.url;
                                this.allow = this.allowthirdpartycookies === "true";
                                this.$page.setTitleBar({
                                    text: `allowthirdpartycookies=${this.allow}`
                                });
                                this.$on("arrowLeft", this.arrowLeftIcon);
                                this.$on("arrowRight", this.arrowRightIcon);
                            },
                            onPageStart(e) {
                                console.info("### pagestart ###" + e.url);
                            },
                            onTitleReceive(e) {
                                this.titleBarParams.config.title = e.title;
                            },
                            onError() {
                                console.info("### pageError ###");
                            },
                            arrowLeftIcon() {
                                this.isCanBack();
                            },
                            arrowRightIcon() {
                                this.isCanForward();
                            },
                            isCanForward() {
                                this.$element("web").canForward({
                                    callback: function(e) {
                                        if (e) {
                                            this.$element("web").forward();
                                        }
                                    }.bind(this)
                                });
                            },
                            isCanBack() {
                                this.$element("web").canBack({
                                    callback: function(e) {
                                        if (e) {
                                            this.$element("web").back();
                                        } else {
                                            _system.default.back();
                                        }
                                    }.bind(this)
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
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/media/web/component/titlebar.ux?uxType=comp": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _default = {
                            data: {
                                titleBar: {
                                    type: "titleBar",
                                    config: {
                                        titleBarShow: false,
                                        height: "100px",
                                        backgroundColor: "#0faeff",
                                        color: "#ffffff",
                                        title: "",
                                        textAlign: "center",
                                        arrowLeftShow: true,
                                        leftIconSrc: "./component/arrow-left.png",
                                        arrowRightShow: false,
                                        rightIconSrc: "./component/arrow-right.png"
                                    }
                                }
                            },
                            onInit() {
                                for (const i in this.value.config) {
                                    this.titleBar.config[i] = this.value.config[i];
                                }
                                this.$extend(this.value, this.titleBar);
                            },
                            back() {
                                this.$dispatch("arrowLeft");
                            },
                            share() {
                                this.$dispatch("arrowRight");
                            }
                        };
                        exports.default = _default;
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/media/web/component/titlebar.ux?uxType=comp": module => {
                    module.exports = {
                        ".doc-page": {
                            flexDirection: "column"
                        },
                        ".titleBar": {
                            flexDirection: "row",
                            paddingTop: "20px",
                            paddingRight: "20px",
                            paddingBottom: "20px",
                            paddingLeft: "20px",
                            height: "100px",
                            width: "100%",
                            alignItems: "center"
                        },
                        ".arrow-content": {
                            height: "80px",
                            width: "80px",
                            paddingTop: "15px",
                            paddingRight: "15px",
                            paddingBottom: "15px",
                            paddingLeft: "15px"
                        },
                        ".arrow-left": {
                            height: "50px",
                            width: "50px",
                            paddingTop: "10px",
                            paddingRight: "10px",
                            paddingBottom: "10px",
                            paddingLeft: "10px",
                            borderRadius: "25px"
                        },
                        ".titleBar-title": {
                            lines: 1,
                            textOverflow: "ellipsis",
                            textAlign: "center",
                            flex: 1,
                            fontSize: "40px",
                            color: "#ffffff"
                        },
                        ".flex-1": {
                            flex: 1
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/media/web/detail/index.ux?uxType=page": module => {
                    module.exports = {
                        ".doc-comp": {
                            flex: 1,
                            flexDirection: "column"
                        },
                        ".web-comp": {
                            flex: 1
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/media/web/component/titlebar.ux?uxType=comp&": module => {
                    module.exports = {
                        type: "div",
                        attr: {},
                        classList: [ "doc-page" ],
                        children: [ {
                            type: "block",
                            attr: {},
                            shown: function() {
                                return this.titleBar.config.titleBarShow;
                            },
                            children: [ {
                                type: "div",
                                attr: {},
                                classList: [ "titleBar" ],
                                style: {
                                    height: function() {
                                        return this.titleBar.config.height;
                                    },
                                    backgroundColor: function() {
                                        return this.titleBar.config.backgroundColor;
                                    }
                                },
                                children: [ {
                                    type: "div",
                                    attr: {},
                                    classList: [ "arrow-content" ],
                                    events: {
                                        click: "back"
                                    },
                                    shown: function() {
                                        return this.titleBar.config.arrowLeftShow;
                                    },
                                    children: [ {
                                        type: "image",
                                        attr: {
                                            src: function() {
                                                return this.titleBar.config.leftIconSrc;
                                            }
                                        },
                                        classList: [ "arrow-left" ],
                                        style: {
                                            resizeMode: "contain"
                                        }
                                    } ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return this.titleBar.config.title;
                                        }
                                    },
                                    classList: [ "titleBar-title" ],
                                    style: {
                                        color: function() {
                                            return this.titleBar.config.color;
                                        },
                                        textAlign: function() {
                                            return this.titleBar.config.textAlign;
                                        }
                                    }
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "arrow-content" ],
                                    events: {
                                        click: "share"
                                    },
                                    shown: function() {
                                        return this.titleBar.config.arrowRightShow;
                                    },
                                    children: [ {
                                        type: "image",
                                        attr: {
                                            src: function() {
                                                return this.titleBar.config.rightIconSrc;
                                            }
                                        },
                                        classList: [ "flex-1" ],
                                        style: {
                                            resizeMode: "contain"
                                        }
                                    } ]
                                } ]
                            } ]
                        } ]
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/media/web/detail/index.ux?uxType=page&importNames[]=titlebar": module => {
                    module.exports = {
                        type: "div",
                        attr: {},
                        classList: [ "doc-comp" ],
                        children: [ {
                            type: "titlebar",
                            attr: {
                                value: function() {
                                    return this.titleBarParams;
                                }
                            }
                        }, {
                            type: "web",
                            attr: {
                                src: function() {
                                    return this.websrc;
                                },
                                allowthirdpartycookies: function() {
                                    return this.allow;
                                },
                                id: "web"
                            },
                            classList: [ "web-comp" ],
                            events: {
                                pagestart: "onPageStart",
                                pagefinish: "onPageFinish",
                                titlereceive: "onTitleReceive",
                                error: "onError"
                            },
                            id: "web"
                        } ]
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/ux-loader.js?cwd=<project-root>&type=import!./src/component/media/web/component/titlebar.ux?uxType=comp&name=titlebar": (__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
                    var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/media/web/component/titlebar.ux?uxType=comp");
                    $app_define$("@app-component/titlebar", [], (function($app_require$, $app_exports$, $app_module$) {
                        $app_script$($app_module$, $app_exports$, $app_require$);
                        if ($app_exports$.__esModule && $app_exports$.default) {
                            $app_module$.exports = $app_exports$.default;
                        }
                        $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/media/web/component/titlebar.ux?uxType=comp&");
                        $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/media/web/component/titlebar.ux?uxType=comp");
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
                __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/ux-loader.js?cwd=<project-root>&type=import!./src/component/media/web/component/titlebar.ux?uxType=comp&name=titlebar");
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/media/web/detail/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/media/web/detail/index.ux?uxType=page&importNames[]=titlebar");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/media/web/detail/index.ux?uxType=page");
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