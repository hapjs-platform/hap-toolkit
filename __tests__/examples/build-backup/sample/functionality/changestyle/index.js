/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/functionality/changestyle/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$("@app-module/system.prompt"));
                        var _system2 = _interopRequireDefault($app_require$("@app-module/system.router"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            private: {
                                params: "",
                                times: 0,
                                text: "style 属性的数据绑定",
                                str: "",
                                typeList: [ "button", "checkbox", "radio", "text", "email", "date", "time", "number", "password" ],
                                csstext: "fontSize: 19px; backgroundColor: red; color: #123456;",
                                csstextJson: {
                                    fontSize: "20px",
                                    backgroundColor: "yellow",
                                    color: "black"
                                },
                                csstextListJson: [ {
                                    fontSize: "20px",
                                    "background-color": "black",
                                    color: "green"
                                }, {
                                    fontSize: "40px",
                                    backgroundColor: "yellow",
                                    color: "blue"
                                }, {
                                    "font-size": "60px",
                                    backgroundColor: "pink",
                                    color: "red"
                                } ],
                                csstextList: [ "font-size: 40px; backgroundColor: green; color: black;", "font-size: 80px; background-color: blue; color: white;", "fontSize: 120px; background-color: red; color: pink;" ]
                            },
                            onInit: function() {
                                this.$page.setTitleBar({
                                    text: this.text
                                });
                                this.str = JSON.stringify(this.csstextJson);
                            },
                            rolling() {
                                this.times++;
                                this.csstext = this.csstextList[this.times % this.csstextList.length];
                                this.csstextJson = this.csstextListJson[this.times % this.csstextListJson.length];
                                this.str = JSON.stringify(this.csstextJson);
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/functionality/changestyle/index.ux?uxType=page": module => {
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
                            height: "70px",
                            textAlign: "center",
                            borderRadius: "43px",
                            marginRight: "60px",
                            marginLeft: "60px",
                            marginBottom: "50px",
                            color: "#f2f2f2",
                            fontSize: "30px",
                            backgroundColor: "#007dff",
                            width: "500px",
                            marginTop: "40px"
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
                            marginTop: "50px",
                            marginRight: "60px",
                            marginLeft: "60px",
                            flexDirection: "column",
                            height: "200px"
                        },
                        ".box": {
                            borderTopWidth: "1px",
                            borderRightWidth: "1px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "1px",
                            borderStyle: "solid",
                            borderTopColor: "#000000",
                            borderRightColor: "#000000",
                            borderBottomColor: "#000000",
                            borderLeftColor: "#000000"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/functionality/changestyle/index.ux?uxType=page&": module => {
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
                                        return this.text;
                                    }
                                },
                                classList: [ "page-title" ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            style: function() {
                                return this.csstextJson;
                            },
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "我是对象"
                                },
                                style: function() {
                                    return this.csstextJson;
                                }
                            } ]
                        }, {
                            type: "text",
                            attr: {
                                value: "当前样式为:"
                            }
                        }, {
                            type: "text",
                            attr: {
                                value: function() {
                                    return this.str;
                                }
                            }
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            style: function() {
                                return this.csstext;
                            },
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "我是字符串"
                                },
                                style: function() {
                                    return this.csstext;
                                }
                            } ]
                        }, {
                            type: "text",
                            attr: {
                                value: "当前样式为:"
                            }
                        }, {
                            type: "text",
                            attr: {
                                value: function() {
                                    return this.csstext;
                                }
                            }
                        }, {
                            type: "input",
                            attr: {
                                type: "button",
                                value: "点我改变样式"
                            },
                            classList: [ "btn" ],
                            events: {
                                click: "rolling"
                            }
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/functionality/changestyle/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/functionality/changestyle/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/functionality/changestyle/index.ux?uxType=page");
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