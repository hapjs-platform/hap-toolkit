/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/basic/rating/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _default = {
                            private: {
                                componentName: "rating",
                                starNum: 0
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Rating"
                                });
                            },
                            onstarStatus(e) {
                                this.starNum = e.rating;
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/basic/rating/index.ux?uxType=page": module => {
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
                        ".item": {
                            flexDirection: "column",
                            marginBottom: "20px",
                            paddingTop: "20px",
                            paddingRight: "20px",
                            paddingBottom: "20px",
                            paddingLeft: "20px",
                            alignItems: "center"
                        },
                        ".title": {
                            borderTopWidth: "0px",
                            borderRightWidth: "0px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "0px",
                            borderStyle: "solid",
                            borderTopColor: "#dddddd",
                            borderRightColor: "#dddddd",
                            borderBottomColor: "#dddddd",
                            borderLeftColor: "#dddddd",
                            marginBottom: "20px",
                            paddingBottom: "20px"
                        },
                        ".rating-bg1": {
                            starBackground: "/component/basic/rating/star/star-1-1.png",
                            starSecondary: "/component/basic/rating/star/star-1-2.png",
                            starForeground: "/component/basic/rating/star/star-1-3.png",
                            marginBottom: "20px",
                            width: "600px",
                            height: "200px"
                        },
                        ".rating-bg2": {
                            starBackground: "/component/basic/rating/star/star-2-1.png",
                            starSecondary: "/component/basic/rating/star/star-2-2.png",
                            starForeground: "/component/basic/rating/star/star-2-3.png",
                            marginBottom: "20px",
                            width: "600px"
                        },
                        ".rating-bg3": {
                            starBackground: "/component/basic/rating/star/star-3-1.png",
                            starSecondary: "/component/basic/rating/star/star-3-2.png",
                            starForeground: "/component/basic/rating/star/star-3-3.png",
                            marginBottom: "20px",
                            width: "600px"
                        },
                        ".rating-bg4": {
                            starBackground: "/component/basic/rating/star/star-4-1.png",
                            starSecondary: "/component/basic/rating/star/star-4-2.png",
                            starForeground: "/component/basic/rating/star/star-4-3.png",
                            marginBottom: "20px",
                            width: "600px"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/basic/rating/index.ux?uxType=page&": module => {
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
                            classList: [ "item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: function() {
                                        return "" + "显示: " + this.starNum + "星";
                                    }
                                },
                                classList: [ "title" ]
                            }, {
                                type: "rating",
                                attr: {},
                                classList: [ "rating" ],
                                events: {
                                    change: "onstarStatus"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "使用背景图片:"
                                },
                                classList: [ "title" ]
                            }, {
                                type: "rating",
                                attr: {
                                    numstars: "8",
                                    rating: "3",
                                    stepsize: "0.5",
                                    indicator: "false"
                                },
                                classList: [ "rating-bg4" ]
                            }, {
                                type: "rating",
                                attr: {
                                    numstars: "6",
                                    rating: "3",
                                    stepsize: "0.5",
                                    indicator: "false"
                                },
                                classList: [ "rating-bg2" ]
                            }, {
                                type: "rating",
                                attr: {
                                    numstars: "5",
                                    rating: "3",
                                    stepsize: "0.5",
                                    indicator: "false"
                                },
                                classList: [ "rating-bg3" ]
                            }, {
                                type: "rating",
                                attr: {
                                    numstars: "3",
                                    rating: "1",
                                    stepsize: "0.5",
                                    indicator: "false"
                                },
                                classList: [ "rating-bg1" ]
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/basic/rating/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/basic/rating/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/basic/rating/index.ux?uxType=page");
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