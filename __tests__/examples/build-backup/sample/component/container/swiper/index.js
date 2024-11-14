/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/container/swiper/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _default = {
                            private: {
                                componentName: "swiper",
                                autoPlay: true,
                                indicator: true,
                                loopPlay: true,
                                sliderValue: 1000
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Swiper"
                                });
                            },
                            startAutoPlay: function(e) {
                                this.autoPlay = e.checked;
                            },
                            showIndicator: function(e) {
                                this.indicator = e.checked;
                            },
                            switchLoopPlay: function(e) {
                                this.loopPlay = e.checked;
                            },
                            setSliderValue: function(e) {
                                this.sliderValue = e.progress;
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/container/swiper/index.ux?uxType=page": module => {
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
                        ".swiper-container": {
                            flexDirection: "column"
                        },
                        ".swiper": {
                            flexDirection: "column",
                            height: "250px"
                        },
                        ".item-content_title": {
                            flex: 1,
                            paddingTop: "20px",
                            paddingBottom: "20px"
                        },
                        ".item_left": {
                            paddingTop: "20px",
                            paddingRight: "20px",
                            paddingBottom: "20px",
                            paddingLeft: "20px"
                        },
                        ".switch": {
                            height: "50px",
                            width: "320px"
                        },
                        ".slider": {
                            width: "100%",
                            paddingLeft: "50px",
                            paddingRight: "50px"
                        },
                        ".item": {
                            height: "250px",
                            textAlign: "center",
                            color: "#ffffff"
                        },
                        ".color-1": {
                            backgroundColor: "#09ba07"
                        },
                        ".color-2": {
                            backgroundColor: "#f76160"
                        },
                        ".color-3": {
                            backgroundColor: "#0faeff"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/container/swiper/index.ux?uxType=page&": module => {
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
                                classList: [ "swiper-container" ],
                                children: [ {
                                    type: "swiper",
                                    attr: {
                                        autoplay: function() {
                                            return this.autoPlay;
                                        },
                                        interval: function() {
                                            return this.sliderValue;
                                        },
                                        indicator: function() {
                                            return this.indicator;
                                        },
                                        loop: function() {
                                            return this.loopPlay;
                                        }
                                    },
                                    classList: [ "swiper" ],
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "A"
                                        },
                                        classList: [ "item", "color-1" ]
                                    }, {
                                        type: "text",
                                        attr: {
                                            value: "B"
                                        },
                                        classList: [ "item", "color-2" ]
                                    }, {
                                        type: "text",
                                        attr: {
                                            value: "C"
                                        },
                                        classList: [ "item", "color-3" ]
                                    } ]
                                } ]
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
                                        value: "指示点"
                                    },
                                    classList: [ "item-content_title" ]
                                }, {
                                    type: "switch",
                                    attr: {
                                        checked: "true"
                                    },
                                    classList: [ "switch" ],
                                    events: {
                                        change: "showIndicator"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "自动播放"
                                    },
                                    classList: [ "item-content_title" ]
                                }, {
                                    type: "switch",
                                    attr: {
                                        checked: "true"
                                    },
                                    classList: [ "switch" ],
                                    events: {
                                        change: "startAutoPlay"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "循环播放"
                                    },
                                    classList: [ "item-content_title" ]
                                }, {
                                    type: "switch",
                                    attr: {
                                        checked: "true"
                                    },
                                    classList: [ "switch" ],
                                    events: {
                                        change: "switchLoopPlay"
                                    }
                                } ]
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
                                        value: "自动播放间隔时长(ms)"
                                    },
                                    classList: [ "item-content_title" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return this.sliderValue;
                                        }
                                    },
                                    classList: [ "item_left" ]
                                } ]
                            }, {
                                type: "slider",
                                attr: {
                                    min: "1000",
                                    max: "3000"
                                },
                                classList: [ "slider" ],
                                events: {
                                    change: "setSliderValue"
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/container/swiper/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/container/swiper/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/container/swiper/index.ux?uxType=page");
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