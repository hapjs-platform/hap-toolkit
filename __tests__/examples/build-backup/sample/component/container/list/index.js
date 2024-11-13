/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/container/list/index.ux?uxType=page": module => {
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
                            private: {
                                componentName: "list",
                                loadMore: true,
                                listAdd: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ],
                                listData: [],
                                scrollPage: false,
                                showListBtn: true,
                                listClass: "selected",
                                arrayClass: "",
                                columnsNum: 3,
                                columnsNumNew: 0
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "List"
                                });
                                this.listData = [].concat(this.listAdd);
                                this.$page.setTitleBar({
                                    text: "List"
                                });
                            },
                            showListMethod() {
                                if (!this.showListBtn) {
                                    this.showListBtn = true;
                                    this.listClass = "selected";
                                    this.arrayClass = "";
                                }
                            },
                            showArrayMethod() {
                                if (this.showListBtn) {
                                    this.showListBtn = false;
                                    this.listClass = "";
                                    this.arrayClass = "selected";
                                }
                            },
                            scrollbottom() {
                                const self = this;
                                const renderData = [].concat(self.listData, self.listAdd);
                                setTimeout((function() {
                                    self.listData = renderData;
                                }), 1000);
                            },
                            handleScroll(param) {
                                if (param.scrollState === 0) {
                                    console.info(`### handleScroll ### scrollState: ${param.scrollState}, scrollX: ${param.scrollX}, scrollY: ${param.scrollY}`);
                                }
                            },
                            writeCloumnsNum(e) {
                                this.columnsNumNew = e.text || 0;
                            },
                            setCloumnsNum() {
                                if (this.columnsNumNew && this.columnsNumNew != this.columnsNum) {
                                    this.goIndex();
                                    this.columnsNum = this.columnsNumNew;
                                }
                                this.$element("columns").focus({
                                    focus: false
                                });
                            },
                            switchScrollMode() {
                                this.goIndex();
                                this.scrollPage = !this.scrollPage;
                            },
                            goIndex() {
                                this.$element("list").scrollTo({
                                    index: 0,
                                    smooth: true
                                });
                            },
                            clickPush() {
                                this.listData.push("push");
                                _system.default.showToast({
                                    message: '向数组的末尾添加一个"push"元素'
                                });
                            },
                            clickPop() {
                                _system.default.showToast({
                                    message: "删除数组的最后一个元素" + JSON.stringify(this.listData.pop())
                                });
                            },
                            clickShift() {
                                _system.default.showToast({
                                    message: "删除数组的第一个元素" + JSON.stringify(this.listData.shift())
                                });
                            },
                            clickUnshift() {
                                this.listData.unshift("unshift");
                                _system.default.showToast({
                                    message: '向数组的开头添加一个"unshift"元素'
                                });
                            },
                            clickSplice() {
                                _system.default.showToast({
                                    message: "删除第一个元素" + JSON.stringify(this.listData.splice(0, 1, "splice")[0]) + '，并添加一个"splice元素"'
                                });
                            },
                            clickSort() {
                                this.listData.sort();
                                _system.default.showToast({
                                    message: "sort"
                                });
                            },
                            clickReverse() {
                                this.listData.reverse();
                                _system.default.showToast({
                                    message: "reverse"
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/container/list/index.ux?uxType=page": module => {
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
                        ".list-content": {
                            flex: 1,
                            paddingLeft: "60px",
                            paddingRight: "60px"
                        },
                        ".item": {
                            height: "150px",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "15px"
                        },
                        ".input-number-wrap": {
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingLeft: "60px",
                            paddingRight: "60px",
                            paddingBottom: "50px"
                        },
                        ".input-number": {
                            flex: 1,
                            marginLeft: "50px",
                            fontSize: "30px"
                        },
                        ".load-more": {
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100px",
                            borderTopColor: "#bbbbbb",
                            borderRightColor: "#bbbbbb",
                            borderBottomColor: "#bbbbbb",
                            borderLeftColor: "#bbbbbb",
                            borderBottomWidth: "1px"
                        },
                        ".btn-wrap-column": {
                            flexDirection: "column",
                            marginRight: "60px",
                            marginLeft: "60px"
                        },
                        ".btn-wrap-row": {
                            marginRight: "60px",
                            marginLeft: "45px",
                            marginBottom: "30px"
                        },
                        ".btn-little": {
                            flex: 1,
                            height: "80px",
                            marginLeft: "15px",
                            borderRadius: "5px",
                            color: "#ffffff",
                            fontSize: "30px",
                            textAlign: "center",
                            borderTopWidth: "0px",
                            borderRightWidth: "0px",
                            borderBottomWidth: "0px",
                            borderLeftWidth: "0px",
                            backgroundColor: "#0faeff"
                        },
                        ".item-color": {
                            backgroundColor: "#f76160"
                        },
                        ".nav": {
                            paddingLeft: "60px",
                            paddingRight: "60px",
                            paddingBottom: "30px"
                        },
                        ".nav-item": {
                            flex: 1,
                            paddingBottom: "30px",
                            borderBottomWidth: "5px",
                            borderTopColor: "#fbf9fe",
                            borderRightColor: "#fbf9fe",
                            borderBottomColor: "#fbf9fe",
                            borderLeftColor: "#fbf9fe",
                            fontSize: "35px",
                            color: "#666666",
                            textAlign: "center"
                        },
                        ".selected": {
                            borderTopColor: "#0faeff",
                            borderRightColor: "#0faeff",
                            borderBottomColor: "#0faeff",
                            borderLeftColor: "#0faeff"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/container/list/index.ux?uxType=page&": module => {
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
                            classList: [ "nav" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "列表组件方法"
                                },
                                classList: function() {
                                    return [ "nav-item", this.listClass ];
                                },
                                events: {
                                    click: "showListMethod"
                                }
                            }, {
                                type: "text",
                                attr: {
                                    value: "数组对象方法"
                                },
                                classList: function() {
                                    return [ "nav-item", this.arrayClass ];
                                },
                                events: {
                                    click: "showArrayMethod"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {
                                show: function() {
                                    return this.showListBtn;
                                }
                            },
                            classList: [ "btn-wrap-column" ],
                            children: [ {
                                type: "div",
                                attr: {},
                                classList: [ "input-number-wrap" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "请输入list的列数:"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        id: "columns",
                                        type: "number",
                                        value: function() {
                                            return this.columnsNum;
                                        }
                                    },
                                    id: "columns",
                                    classList: [ "input-number" ],
                                    events: {
                                        change: "writeCloumnsNum"
                                    }
                                } ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "修改list列数"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "setCloumnsNum"
                                }
                            }, {
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
                            } ]
                        }, {
                            type: "div",
                            attr: {
                                show: function() {
                                    return !this.showListBtn;
                                }
                            },
                            classList: [ "btn-wrap-row" ],
                            children: [ {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "push"
                                },
                                classList: [ "btn-little" ],
                                events: {
                                    click: "clickPush"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "pop"
                                },
                                classList: [ "btn-little" ],
                                events: {
                                    click: "clickPop"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "shift"
                                },
                                classList: [ "btn-little" ],
                                events: {
                                    click: "clickShift"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "unshift"
                                },
                                classList: [ "btn-little" ],
                                events: {
                                    click: "clickUnshift"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {
                                show: function() {
                                    return !this.showListBtn;
                                }
                            },
                            classList: [ "btn-wrap-row" ],
                            children: [ {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "splice"
                                },
                                classList: [ "btn-little" ],
                                events: {
                                    click: "clickSplice"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "sort"
                                },
                                classList: [ "btn-little" ],
                                events: {
                                    click: "clickSort"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "reverse"
                                },
                                classList: [ "btn-little" ],
                                events: {
                                    click: "clickReverse"
                                }
                            } ]
                        }, {
                            type: "list",
                            attr: {
                                id: "list",
                                scrollpage: function() {
                                    return this.scrollPage;
                                }
                            },
                            classList: [ "list-content" ],
                            events: {
                                scroll: "handleScroll",
                                scrollbottom: "scrollbottom"
                            },
                            id: "list",
                            style: {
                                columns: function() {
                                    return this.columnsNum;
                                }
                            },
                            children: [ {
                                type: "list-item",
                                attr: {
                                    type: "listItem"
                                },
                                classList: [ "item", "item-color" ],
                                repeat: function() {
                                    return this.listData;
                                },
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + this.$item + "--" + this.$idx;
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
                                style: {
                                    columnSpan: function() {
                                        return this.columnsNum;
                                    }
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/container/list/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/container/list/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/container/list/index.ux?uxType=page");
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