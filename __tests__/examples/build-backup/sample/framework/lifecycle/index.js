/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/framework/lifecycle/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _default = {
                            private: {
                                componentName: "lifecycle",
                                lifecycleObject: {
                                    onInit: {
                                        count: 0,
                                        desc: `当页面完成初始化时调用，只触发一次`
                                    },
                                    onReady: {
                                        count: 0,
                                        desc: `当页面完成创建可以显示时触发，只触发一次`
                                    },
                                    onShow: {
                                        count: 0,
                                        desc: `当进入页面时触发`
                                    },
                                    onHide: {
                                        count: 0,
                                        desc: `当页面跳转离开时触发`
                                    },
                                    onDestroy: {
                                        count: 0,
                                        desc: `当页面跳转离开（不进入导航栈）时触发`
                                    },
                                    onBackPress: {
                                        count: 0,
                                        desc: `当用户点击返回按钮时触发。返回true表示页面自己处理返回逻辑，返回false表示使用默认的返回逻辑，不返回值会作为false处理`,
                                        params: ""
                                    },
                                    onMenuPress: {
                                        count: 0,
                                        desc: `当用户点击菜单按钮时触发`
                                    }
                                },
                                lifecycleList: [],
                                pageInfo: {}
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Lifecycle"
                                });
                                Object.keys(this.lifecycleObject).forEach((item => {
                                    this.lifecycleList.push(item);
                                }));
                                console.info(`### onInit ###`);
                                ++this.lifecycleObject.onInit.count;
                                this.pageInfo = this.$page;
                            },
                            onReady() {
                                console.info(`### onReady ###`);
                                ++this.lifecycleObject.onReady.count;
                            },
                            onShow() {
                                console.info(`### onShow ###`);
                                ++this.lifecycleObject.onShow.count;
                            },
                            onHide() {
                                console.info(`### onHide ###`);
                                ++this.lifecycleObject.onHide.count;
                            },
                            onDestroy() {
                                console.info(`### onDestroy ###`);
                                ++this.lifecycleObject.onDestroy.count;
                            },
                            onBackPress(params) {
                                console.info(`### onBackPress ###`);
                                ++this.lifecycleObject.onBackPress.count;
                                this.lifecycleObject.onBackPress.params = JSON.stringify(params);
                            },
                            onMenuPress() {
                                console.info(`### onMenuPress ###`);
                                ++this.lifecycleObject.onMenuPress.count;
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/framework/lifecycle/index.ux?uxType=page": module => {
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
                            flexDirection: "column",
                            backgroundColor: "#ffffff",
                            paddingTop: "30px",
                            paddingRight: "30px",
                            paddingBottom: "30px",
                            paddingLeft: "30px",
                            marginBottom: "30px",
                            alignItems: "flex-start"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/framework/lifecycle/index.ux?uxType=page&": module => {
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
                                repeat: function() {
                                    return this.lifecycleList;
                                },
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return this.$item;
                                        }
                                    },
                                    classList: [ "txt" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "触发时机: " + this.lifecycleObject[this.$item].desc;
                                        }
                                    },
                                    classList: [ "txt" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "触发次数: " + this.lifecycleObject[this.$item].count;
                                        }
                                    },
                                    classList: [ "txt" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "参数: " + this.lifecycleObject[this.$item].params;
                                        }
                                    },
                                    classList: [ "txt" ],
                                    shown: function() {
                                        return this.lifecycleObject[this.$item].params;
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
                                        value: "通过$page变量获取页面的元信息"
                                    },
                                    classList: [ "title" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "name: " + this.pageInfo.name;
                                        }
                                    }
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "path: " + this.pageInfo.path;
                                        }
                                    }
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "component: " + this.pageInfo.component;
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/framework/lifecycle/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/framework/lifecycle/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/framework/lifecycle/index.ux?uxType=page");
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