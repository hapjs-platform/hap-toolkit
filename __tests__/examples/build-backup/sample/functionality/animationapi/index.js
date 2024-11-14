/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/functionality/animationapi/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        let animate;
                        var _default = {
                            private: {
                                state: "idle",
                                currentRotate: 0
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Animation api"
                                });
                            },
                            play(_anime) {
                                this.cancelAnimation();
                                animate = _anime;
                                if (animate) {
                                    animate.play();
                                    this.state = animate.playState;
                                    animate.oncancel = () => {
                                        this.state = animate.playState;
                                        console.info("### animate canceled ###");
                                    };
                                    animate.onfinish = () => {
                                        this.state = animate.playState;
                                        console.info("### animate finished ###");
                                    };
                                }
                            },
                            onChangeWH() {
                                var testEl = this.$element("test");
                                var keyframes = [ {
                                    width: "120px",
                                    height: "120px",
                                    time: 0
                                }, {
                                    width: "300px",
                                    height: "300px",
                                    time: 100
                                } ];
                                var options = {
                                    duration: 1000,
                                    easing: "cubic-bezier(0, 0.9, 0.9, 0)",
                                    delay: 0,
                                    fill: "none",
                                    iterations: 5,
                                    needLayout: true
                                };
                                this.play(testEl.animate(keyframes, options));
                            },
                            onTranslate() {
                                var testEl = this.$element("test");
                                var keyframes = [ {
                                    transform: "{translateX:0px}",
                                    time: 0
                                }, {
                                    transform: "{translateX:100px}",
                                    time: 100
                                } ];
                                var options = {
                                    duration: 1000,
                                    easing: "linear",
                                    delay: 0,
                                    fill: "none",
                                    iterations: 5,
                                    needLayout: true
                                };
                                this.play(testEl.animate(keyframes, options));
                            },
                            onScale() {
                                var testEl = this.$element("test");
                                var keyframes = [ {
                                    transform: "{scaleX:1, scaleY:1}",
                                    time: 0
                                }, {
                                    transform: "{scaleX:2, scaleY:2}",
                                    time: 100
                                } ];
                                var options = {
                                    duration: 1000,
                                    easing: "linear",
                                    delay: 0,
                                    fill: "none",
                                    iterations: 5,
                                    needLayout: true
                                };
                                this.play(testEl.animate(keyframes, options));
                            },
                            onRotate() {
                                var testEl = this.$element("test");
                                var keyframes = [ {
                                    "transform-origin": "0px 10px",
                                    transform: "{rotate:10deg}",
                                    time: 0
                                }, {
                                    "transform-origin": "0px 10px",
                                    transform: "{rotate:360deg}",
                                    time: 100
                                } ];
                                var options = {
                                    duration: 1000,
                                    easing: "cubic-bezier(0, 0.9, 0.9, 0)",
                                    delay: 0,
                                    fill: "none",
                                    iterations: 5,
                                    needLayout: true
                                };
                                this.play(testEl.animate(keyframes, options));
                            },
                            pauseAnimation() {
                                animate && animate.pause();
                            },
                            cancelAnimation() {
                                animate && animate.cancel();
                            },
                            reverseAnimation() {
                                animate && animate.reverse();
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/functionality/animationapi/index.ux?uxType=page": module => {
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
                            marginRight: "30px",
                            marginLeft: "30px",
                            marginBottom: "50px",
                            color: "#ffffff",
                            fontSize: "30px",
                            backgroundColor: "#0faeff",
                            marginTop: "10px"
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
                        ".container": {
                            flex: 1,
                            alignItems: "center",
                            backgroundColor: "#0faeff",
                            justifyContent: "center",
                            alignContent: "center"
                        },
                        ".widget": {
                            width: "120px",
                            height: "120px",
                            backgroundColor: "rgb(80,209,28)",
                            borderTopColor: "#dddddd",
                            borderRightColor: "#dddddd",
                            borderBottomColor: "#dddddd",
                            borderLeftColor: "#dddddd",
                            borderTopWidth: "1px",
                            borderRightWidth: "1px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "1px",
                            color: "#FFFFFF",
                            justifyContent: "center"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/functionality/animationapi/index.ux?uxType=page&": module => {
                    module.exports = {
                        type: "div",
                        attr: {},
                        classList: [ "doc-page" ],
                        children: [ {
                            type: "div",
                            attr: {
                                flexDirection: "column"
                            },
                            children: [ {
                                type: "div",
                                attr: {},
                                children: [ {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "宽高"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "onChangeWH"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "放大"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "onScale"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "移动"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "onTranslate"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "旋转"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "onRotate"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                children: [ {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "pause"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "pauseAnimation"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "cancel"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "cancelAnimation"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "reverse"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "reverseAnimation"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "container" ],
                            children: [ {
                                type: "div",
                                attr: {
                                    id: "test"
                                },
                                classList: [ "widget" ],
                                id: "test",
                                children: [ {
                                    type: "text",
                                    attr: {
                                        color: "#FFFFFF",
                                        value: function() {
                                            return this.state;
                                        }
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/functionality/animationapi/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/functionality/animationapi/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/functionality/animationapi/index.ux?uxType=page");
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