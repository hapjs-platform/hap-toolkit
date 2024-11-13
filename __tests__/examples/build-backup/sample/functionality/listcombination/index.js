/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/functionality/listcombination/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _default = {
                            private: {
                                clearTime: null,
                                menuList: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
                                activeIndex: 0,
                                menuClick: false,
                                contentList: [ {
                                    type: "type7",
                                    title: "0",
                                    content: [ 0, 1, 2, 3, 4, 5, 6 ]
                                }, {
                                    type: "type9",
                                    title: "1",
                                    content: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
                                }, {
                                    type: "type13",
                                    title: "2",
                                    content: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]
                                }, {
                                    type: "type7",
                                    title: "3",
                                    content: [ 0, 1, 2, 3, 4, 5, 6 ]
                                }, {
                                    type: "type3",
                                    title: "4",
                                    content: [ 0, 1, 2 ]
                                }, {
                                    type: "type16",
                                    title: "5",
                                    content: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ]
                                }, {
                                    type: "type7",
                                    title: "6",
                                    content: [ 0, 1, 2, 3, 4, 5, 6 ]
                                }, {
                                    type: "type12",
                                    title: "7",
                                    content: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ]
                                }, {
                                    type: "type7",
                                    title: "8",
                                    content: [ 0, 1, 2, 3, 4, 5, 6 ]
                                }, {
                                    type: "type7",
                                    title: "9",
                                    content: [ 0, 1, 2, 3, 4, 5, 6 ]
                                }, {
                                    type: "type6",
                                    title: "10",
                                    content: [ 0, 1, 2, 3, 4, 5 ]
                                }, {
                                    type: "type12",
                                    title: "11",
                                    content: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ]
                                }, {
                                    type: "type3",
                                    title: "12",
                                    content: [ 0, 1, 2 ]
                                } ]
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "list联动"
                                });
                            },
                            appearfn(index) {
                                if (this.menuClick) {
                                    return;
                                }
                                if (this.activeIndex < index) {
                                    this.activeIndex = index - 1;
                                } else {
                                    this.activeIndex = index;
                                }
                            },
                            showContent(index) {
                                this.menuClick = true;
                                this.$element("content").scrollTo({
                                    index
                                });
                                this.activeIndex = index;
                                setTimeout(function() {
                                    this.menuClick = false;
                                }.bind(this), 600);
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../node_modules/less-loader/dist/cjs.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/functionality/listcombination/index.ux?uxType=page": module => {
                    module.exports = {
                        ".tutorial-page": {
                            flex: 1,
                            flexDirection: "row",
                            backgroundColor: "#eeeeee"
                        },
                        ".tutorial-page .menu": {
                            width: "20%",
                            borderTopWidth: "1px",
                            borderRightWidth: "1px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "1px",
                            borderStyle: "solid",
                            borderTopColor: "#eeeeee",
                            borderRightColor: "#eeeeee",
                            borderBottomColor: "#eeeeee",
                            borderLeftColor: "#eeeeee",
                            flexDirection: "column",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "tutorial-page"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "menu"
                                } ]
                            }
                        },
                        ".tutorial-page .menu .menu-text": {
                            flex: 1,
                            height: "100px",
                            textAlign: "center",
                            borderTopWidth: "0px",
                            borderRightWidth: "0px",
                            borderBottomWidth: "5px",
                            borderLeftWidth: "0px",
                            borderStyle: "solid",
                            borderTopColor: "#eeeeee",
                            borderRightColor: "#eeeeee",
                            borderBottomColor: "#eeeeee",
                            borderLeftColor: "#eeeeee",
                            backgroundColor: "#ffffff",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "tutorial-page"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "menu"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "menu-text"
                                } ]
                            }
                        },
                        ".tutorial-page .menu .active-text": {
                            color: "#0faeff",
                            borderTopColor: "#0faeff",
                            borderRightColor: "#0faeff",
                            borderBottomColor: "#0faeff",
                            borderLeftColor: "#0faeff",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "tutorial-page"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "menu"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "active-text"
                                } ]
                            }
                        },
                        ".tutorial-page .content": {
                            width: "80%",
                            flexDirection: "column",
                            marginLeft: "10px",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "tutorial-page"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "content"
                                } ]
                            }
                        },
                        ".tutorial-page .content .content-title": {
                            width: "100%",
                            height: "200px",
                            textAlign: "center",
                            borderTopWidth: "0px",
                            borderRightWidth: "0px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "0px",
                            borderStyle: "solid",
                            borderTopColor: "#eeeeee",
                            borderRightColor: "#eeeeee",
                            borderBottomColor: "#eeeeee",
                            borderLeftColor: "#eeeeee",
                            backgroundColor: "#ffffff",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "tutorial-page"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "content"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "content-title"
                                } ]
                            }
                        },
                        ".tutorial-page .content .content-item": {
                            flexWrap: "wrap",
                            backgroundColor: "#ffffff",
                            marginBottom: "20px",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "tutorial-page"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "content"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "content-item"
                                } ]
                            }
                        },
                        ".tutorial-page .content .item-text": {
                            height: "200px",
                            width: "33.33%",
                            textAlign: "center",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "tutorial-page"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "content"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "item-text"
                                } ]
                            }
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/functionality/listcombination/index.ux?uxType=page&": module => {
                    module.exports = {
                        type: "div",
                        attr: {},
                        classList: [ "tutorial-page" ],
                        children: [ {
                            type: "list",
                            attr: {},
                            classList: [ "menu" ],
                            children: [ {
                                type: "block",
                                attr: {},
                                repeat: function() {
                                    return this.menuList;
                                },
                                children: [ {
                                    type: "list-item",
                                    attr: {
                                        type: "menu"
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: function() {
                                                return this.$item;
                                            }
                                        },
                                        classList: function() {
                                            return [ "menu-text", this.activeIndex == this.$idx ? "active-text" : "" ];
                                        },
                                        events: {
                                            click: function(evt) {
                                                return this.showContent(this.$idx, evt);
                                            }
                                        }
                                    } ]
                                } ]
                            } ]
                        }, {
                            type: "list",
                            attr: {
                                id: "content"
                            },
                            classList: [ "content" ],
                            id: "content",
                            children: [ {
                                type: "block",
                                attr: {},
                                repeat: function() {
                                    return this.contentList;
                                },
                                children: [ {
                                    type: "list-item",
                                    attr: {
                                        type: function() {
                                            return "" + "content" + this.$item.type;
                                        }
                                    },
                                    classList: [ "content-item" ],
                                    children: [ {
                                        type: "div",
                                        attr: {},
                                        classList: [ "content-title" ],
                                        events: {
                                            appear: function(evt) {
                                                return this.appearfn(this.$idx, evt);
                                            }
                                        },
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: function() {
                                                    return "" + "以下是：title-" + this.$item.title;
                                                }
                                            },
                                            classList: [ "item-text" ]
                                        } ]
                                    }, {
                                        type: "div",
                                        attr: {},
                                        classList: [ "content-item" ],
                                        children: [ {
                                            type: "block",
                                            attr: {},
                                            repeat: function() {
                                                return this.$item.content;
                                            },
                                            children: [ {
                                                type: "text",
                                                attr: {
                                                    value: function() {
                                                        return this.$item;
                                                    }
                                                },
                                                classList: [ "item-text" ]
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/functionality/listcombination/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/functionality/listcombination/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../node_modules/less-loader/dist/cjs.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/functionality/listcombination/index.ux?uxType=page");
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