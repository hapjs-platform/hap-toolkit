/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/container/tabs/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _default = {
                            private: {
                                componentName: "tabs",
                                time: "",
                                loadMore: true,
                                scrollPage: false,
                                scrollable: true,
                                listData: [ {
                                    name: "A"
                                }, {
                                    name: "B"
                                }, {
                                    name: "C"
                                }, {
                                    name: "D"
                                } ]
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Tabs"
                                });
                                this.time = (new Date).getHours() + ":" + (new Date).getMinutes();
                            },
                            changeTabactive(e) {
                                console.info("切换tab: " + e.index);
                            },
                            setTime(e) {
                                this.time = e.hour + ":" + e.minute;
                            },
                            scrollbottom() {
                                const self = this;
                                setTimeout((function() {
                                    self.listData = self.listData.concat([ {
                                        name: "A"
                                    }, {
                                        name: "B"
                                    }, {
                                        name: "C"
                                    }, {
                                        name: "D"
                                    } ]);
                                }), 1000);
                            },
                            goIndex() {
                                this.$element("list").scrollTo({
                                    index: 0,
                                    smooth: true
                                });
                            },
                            switchScrollMode() {
                                this.goIndex();
                                this.scrollPage = !this.scrollPage;
                            },
                            switchScrollable(e) {
                                this.scrollable = e.checked;
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/container/tabs/index.ux?uxType=page": module => {
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
                        ".tabs": {
                            flex: 1,
                            marginTop: "20px",
                            marginRight: "30px",
                            marginLeft: "30px",
                            backgroundColor: "#ffffff"
                        },
                        ".tab-content": {
                            flex: 1
                        },
                        ".tab-bar": {
                            height: "100px",
                            borderTopColor: "#bbbbbb",
                            borderRightColor: "#bbbbbb",
                            borderBottomColor: "#bbbbbb",
                            borderLeftColor: "#bbbbbb",
                            color: "#bbbbbb",
                            borderBottomWidth: "1px"
                        },
                        ".tab-text": {
                            textAlign: "center",
                            "color:active": "#f76160"
                        },
                        ".item-container": {
                            paddingTop: "30px",
                            paddingLeft: "30px",
                            paddingRight: "30px",
                            flexDirection: "column"
                        },
                        ".item-content": {
                            flexDirection: "column",
                            paddingBottom: "30px"
                        },
                        ".item-title": {
                            paddingTop: "50px",
                            paddingBottom: "20px",
                            color: "#aaaaaa"
                        },
                        ".item-title-first": {
                            paddingTop: "0px"
                        },
                        ".item-input": {
                            height: "80px",
                            marginRight: "60px",
                            marginLeft: "60px",
                            paddingTop: "20px",
                            paddingRight: "20px",
                            paddingBottom: "20px",
                            paddingLeft: "20px",
                            borderTopWidth: "1px",
                            borderRightWidth: "1px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "1px",
                            borderTopColor: "#bbbbbb",
                            borderRightColor: "#bbbbbb",
                            borderBottomColor: "#bbbbbb",
                            borderLeftColor: "#bbbbbb",
                            borderRadius: "5px",
                            fontSize: "30px"
                        },
                        ".item-picker": {
                            marginRight: "60px",
                            marginLeft: "60px",
                            paddingTop: "20px",
                            paddingRight: "20px",
                            paddingBottom: "20px",
                            paddingLeft: "20px",
                            borderTopWidth: "1px",
                            borderRightWidth: "1px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "1px",
                            borderTopColor: "#bbbbbb",
                            borderRightColor: "#bbbbbb",
                            borderBottomColor: "#bbbbbb",
                            borderLeftColor: "#bbbbbb",
                            borderRadius: "5px"
                        },
                        ".item-slider": {
                            paddingTop: "20px",
                            paddingRight: "20px",
                            paddingBottom: "20px",
                            paddingLeft: "20px"
                        },
                        ".circular": {
                            width: "40px",
                            height: "40px"
                        },
                        ".list": {
                            flex: 1
                        },
                        ".load-more": {
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100px"
                        },
                        ".item": {
                            height: "150px",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "15px"
                        },
                        ".item_color": {
                            backgroundColor: "#f76160"
                        },
                        ".switch-content": {
                            flexDirection: "row",
                            marginLeft: "30px",
                            marginRight: "30px"
                        },
                        ".item-content-title": {
                            flex: 1,
                            paddingTop: "20px",
                            paddingBottom: "20px"
                        },
                        ".switch": {
                            height: "50px",
                            width: "320px"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/container/tabs/index.ux?uxType=page&": module => {
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
                            classList: [ "switch-content" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "滑动切换页面"
                                },
                                classList: [ "item-content-title" ]
                            }, {
                                type: "switch",
                                attr: {
                                    checked: "true"
                                },
                                classList: [ "switch" ],
                                events: {
                                    change: "switchScrollable"
                                }
                            } ]
                        }, {
                            type: "tabs",
                            attr: {
                                index: "2"
                            },
                            classList: [ "tabs" ],
                            events: {
                                change: "changeTabactive"
                            },
                            children: [ {
                                type: "tab-bar",
                                attr: {},
                                classList: [ "tab-bar" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "基础组件"
                                    },
                                    classList: [ "tab-text" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: "表单组件"
                                    },
                                    classList: [ "tab-text" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: "列表组件"
                                    },
                                    classList: [ "tab-text" ]
                                } ]
                            }, {
                                type: "tab-content",
                                attr: {
                                    scrollable: function() {
                                        return this.scrollable;
                                    }
                                },
                                classList: [ "tab-content" ],
                                children: [ {
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
                                                value: "a"
                                            },
                                            classList: [ "item-title", "item-title-first" ]
                                        }, {
                                            type: "a",
                                            attr: {
                                                href: "https://www.quickapp.cn/",
                                                value: "链接示例"
                                            },
                                            style: {
                                                color: "#09ba07"
                                            }
                                        } ]
                                    }, {
                                        type: "div",
                                        attr: {},
                                        classList: [ "item-content" ],
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: "image"
                                            },
                                            classList: [ "item-title" ]
                                        }, {
                                            type: "image",
                                            attr: {
                                                src: "/component/container/tabs/pic.webp"
                                            },
                                            classList: [ "image" ]
                                        } ]
                                    }, {
                                        type: "div",
                                        attr: {},
                                        classList: [ "item-content" ],
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: 'progerss type="horizontal"'
                                            },
                                            classList: [ "item-title" ]
                                        }, {
                                            type: "progress",
                                            attr: {
                                                percent: "20"
                                            },
                                            style: {
                                                marginTop: "20px",
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
                                                value: 'progerss type="circular"'
                                            },
                                            classList: [ "item-title" ]
                                        }, {
                                            type: "progress",
                                            attr: {
                                                type: "circular"
                                            },
                                            classList: [ "circular" ],
                                            style: {
                                                marginTop: "20px",
                                                color: "#A020F0"
                                            }
                                        } ]
                                    }, {
                                        type: "div",
                                        attr: {},
                                        classList: [ "item-content" ],
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: "text"
                                            },
                                            classList: [ "item-title" ]
                                        }, {
                                            type: "text",
                                            attr: {
                                                value: "I am text"
                                            },
                                            style: {
                                                color: "#f76160"
                                            }
                                        } ]
                                    }, {
                                        type: "div",
                                        attr: {},
                                        classList: [ "item-content" ],
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: "span"
                                            },
                                            classList: [ "item-title" ]
                                        }, {
                                            type: "text",
                                            attr: {},
                                            children: [ {
                                                type: "span",
                                                attr: {
                                                    value: "I am span"
                                                },
                                                style: {
                                                    color: "#09ba07"
                                                }
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
                                                value: "input"
                                            },
                                            classList: [ "item-title", "item-title-first" ]
                                        }, {
                                            type: "input",
                                            attr: {
                                                type: "text",
                                                placeholder: "I am input"
                                            },
                                            classList: [ "item-input" ]
                                        } ]
                                    }, {
                                        type: "div",
                                        attr: {},
                                        classList: [ "item-content" ],
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: "picker"
                                            },
                                            classList: [ "item-title" ]
                                        }, {
                                            type: "picker",
                                            attr: {
                                                type: "time",
                                                value: function() {
                                                    return this.time;
                                                }
                                            },
                                            classList: [ "item-picker" ],
                                            events: {
                                                change: "setTime"
                                            }
                                        } ]
                                    }, {
                                        type: "div",
                                        attr: {},
                                        classList: [ "item-content" ],
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: "slider"
                                            },
                                            classList: [ "item-title" ]
                                        }, {
                                            type: "slider",
                                            attr: {
                                                min: "50",
                                                max: "200",
                                                value: "100"
                                            },
                                            classList: [ "item-slider" ],
                                            style: {
                                                selectedColor: "#0faeff"
                                            }
                                        } ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "item-container" ],
                                    children: [ {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            name: "",
                                            value: "切换滚动模式"
                                        },
                                        classList: [ "btn" ],
                                        events: {
                                            click: "switchScrollMode"
                                        }
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            name: "",
                                            value: "回到第一个item"
                                        },
                                        classList: [ "btn" ],
                                        events: {
                                            click: "goIndex"
                                        }
                                    }, {
                                        type: "list",
                                        attr: {
                                            id: "list",
                                            scrollpage: function() {
                                                return this.scrollPage;
                                            }
                                        },
                                        classList: [ "list" ],
                                        events: {
                                            scrollbottom: "scrollbottom"
                                        },
                                        id: "list",
                                        children: [ {
                                            type: "list-item",
                                            attr: {
                                                type: "listItem"
                                            },
                                            classList: [ "item", "item_color" ],
                                            repeat: function() {
                                                return this.listData;
                                            },
                                            children: [ {
                                                type: "text",
                                                attr: {
                                                    value: function() {
                                                        return "" + this.$item.name + "--" + this.$idx;
                                                    }
                                                },
                                                classList: [ "txt" ]
                                            } ]
                                        }, {
                                            type: "list-item",
                                            attr: {
                                                type: "loadMore"
                                            },
                                            classList: [ "load-more" ],
                                            shown: function() {
                                                return this.loadMore;
                                            },
                                            children: [ {
                                                type: "progress",
                                                attr: {
                                                    type: "circular"
                                                }
                                            }, {
                                                type: "text",
                                                attr: {
                                                    value: "加载更多"
                                                }
                                            } ]
                                        } ]
                                    } ]
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/container/tabs/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/container/tabs/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/container/tabs/index.ux?uxType=page");
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