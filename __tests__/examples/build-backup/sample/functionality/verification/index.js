/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/functionality/verification/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _default = {
                            private: {
                                btn_class: "disabled",
                                btn_submit_class: "disabled",
                                btn_val: "发送验证码",
                                phone: "",
                                second: 0
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "手机号验证"
                                });
                            },
                            verifyPhone(e) {
                                this.phone = e.text;
                                if (/^1[34578]\d{9}$/.test(this.phone) && !this.second) {
                                    this.btn_class = "";
                                } else {
                                    this.btn_class = "disabled";
                                }
                                if (!/^1[34578]\d{9}$/.test(this.phone)) {
                                    this.btn_submit_class = "disabled";
                                }
                            },
                            verifyCode(e) {
                                if (/^\d{6}$/.test(e.text) && /^1[34578]\d{9}$/.test(this.phone)) {
                                    this.btn_submit_class = "";
                                } else {
                                    this.btn_submit_class = "disabled";
                                }
                            },
                            sendVerification() {
                                const self = this;
                                if (!self.btn_class) {
                                    self.second = 60;
                                    self.btn_class = "disabled";
                                    self.intervalID = setInterval(self.count.bind(self), 1000);
                                }
                            },
                            count() {
                                const self = this;
                                --self.second;
                                self.btn_val = self.second + "s后再次发送验证码";
                                if (self.second === 0) {
                                    clearInterval(self.intervalID);
                                    self.btn_class = "";
                                    self.btn_val = "发送验证码";
                                }
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/functionality/verification/index.ux?uxType=page": module => {
                    module.exports = {
                        ".doc-page": {
                            flexDirection: "column",
                            flex: 1,
                            backgroundColor: "#fbf9fe"
                        },
                        ".doc-row": {
                            borderTopWidth: "1px",
                            borderTopColor: "rgb(187,187,187)",
                            flexDirection: "column"
                        },
                        ".doc-row-inline": {
                            borderTopWidth: "1px",
                            borderTopColor: "rgb(187,187,187)"
                        },
                        ".doc-height": {
                            height: "150px"
                        },
                        ".doc-visual": {
                            backgroundColor: "rgba(86,61,124,0.15)",
                            borderTopWidth: "1px",
                            borderRightWidth: "1px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "1px",
                            borderStyle: "solid",
                            borderTopColor: "rgba(86,61,124,0.2)",
                            borderRightColor: "rgba(86,61,124,0.2)",
                            borderBottomColor: "rgba(86,61,124,0.2)",
                            borderLeftColor: "rgba(86,61,124,0.2)",
                            paddingTop: "15px",
                            paddingBottom: "15px"
                        },
                        ".doc-m-r-20": {
                            marginRight: "20px"
                        },
                        ".doc-row-desc": {
                            color: "#3d3d3f",
                            paddingTop: "10px",
                            paddingRight: "0px",
                            paddingBottom: "10px",
                            paddingLeft: "20px",
                            backgroundColor: "#f1ebeb"
                        },
                        ".doc-row-desc-inline": {
                            color: "#3d3d3f",
                            paddingTop: "10px",
                            paddingRight: "0px",
                            paddingBottom: "10px",
                            paddingLeft: "20px",
                            backgroundColor: "#f1ebeb",
                            width: "300px"
                        },
                        ".flex-1": {
                            flex: 1
                        },
                        ".flex-row": {
                            flexDirection: "row"
                        },
                        ".flex-grow-1": {
                            flexGrow: 1
                        },
                        ".flex-column": {
                            flexDirection: "column"
                        },
                        ".justify-content-between": {
                            justifyContent: "space-between"
                        },
                        ".align-item-start": {
                            alignItems: "flex-start"
                        },
                        ".align-item-center": {
                            alignItems: "center"
                        },
                        ".justify-content-center": {
                            justifyContent: "center"
                        },
                        ".flex-wrap": {
                            flexWrap: "wrap"
                        },
                        ".flex-nowrap": {
                            flexWrap: "nowrap"
                        },
                        ".flex-wrapReverse": {
                            flexWrap: "wrap-reverse"
                        },
                        ".xui-list": {
                            flexDirection: "column",
                            flex: 1
                        },
                        ".xui-x-s": {
                            width: "100%",
                            textAlign: "left",
                            justifyContent: "flex-start"
                        },
                        ".xui-x-c": {
                            width: "100%",
                            textAlign: "center",
                            justifyContent: "center"
                        },
                        ".xui-x-e": {
                            width: "100%",
                            textAlign: "right",
                            justifyContent: "flex-end"
                        },
                        ".xui-y-s": {
                            alignItems: "flex-start"
                        },
                        ".xui-y-c": {
                            alignItems: "center"
                        },
                        ".xui-y-e": {
                            alignItems: "flex-end"
                        },
                        ".xui-row": {
                            marginTop: "20px"
                        },
                        ".xui-demo-head": {
                            marginTop: "50px"
                        },
                        ".xui-demo-head-title": {
                            fontSize: "45px",
                            marginTop: "20px",
                            color: "#3c3a3a",
                            paddingTop: "10px",
                            paddingRight: "20px",
                            paddingBottom: "10px",
                            paddingLeft: "20px"
                        },
                        ".xui-demo-head-desc": {
                            fontSize: "30px",
                            paddingTop: "10px",
                            paddingRight: "20px",
                            paddingBottom: "10px",
                            paddingLeft: "20px",
                            borderBottomWidth: "1px",
                            borderBottomColor: "#d3d3d3",
                            color: "#908c8c"
                        },
                        ".xui-col": {
                            flexGrow: 1
                        },
                        ".xui-col-1": {
                            flexBasis: "8.333333%"
                        },
                        ".xui-col-2": {
                            flexBasis: "16.666667%"
                        },
                        ".xui-col-3": {
                            flexBasis: "25%"
                        },
                        ".xui-col-4": {
                            flexBasis: "33.333333%"
                        },
                        ".xui-col-5": {
                            flexBasis: "41.666667%"
                        },
                        ".xui-col-6": {
                            flexBasis: "50%"
                        },
                        ".xui-col-7": {
                            flexBasis: "58.333333%"
                        },
                        ".xui-col-8": {
                            flexBasis: "66.666667%"
                        },
                        ".xui-col-9": {
                            flexBasis: "75%"
                        },
                        ".xui-col-10": {
                            flexBasis: "83.333333%"
                        },
                        ".xui-col-11": {
                            flexBasis: "91.666667%"
                        },
                        ".xui-col-12": {
                            flexBasis: "100%"
                        },
                        ".xui-input-group-col": {
                            marginTop: "30px",
                            paddingTop: "10px",
                            paddingRight: "30px",
                            paddingBottom: "10px",
                            paddingLeft: "30px",
                            flexDirection: "column"
                        },
                        ".xui-input-group-row": {
                            marginTop: "30px",
                            paddingTop: "10px",
                            paddingRight: "30px",
                            paddingBottom: "10px",
                            paddingLeft: "30px",
                            flexDirection: "row"
                        },
                        ".xui-input": {
                            borderTopWidth: "1px",
                            borderRightWidth: "1px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "1px",
                            borderStyle: "solid",
                            borderTopColor: "#cccccc",
                            borderRightColor: "#cccccc",
                            borderBottomColor: "#cccccc",
                            borderLeftColor: "#cccccc",
                            paddingTop: "20px",
                            paddingRight: "30px",
                            paddingBottom: "20px",
                            paddingLeft: "30px",
                            backgroundColor: "rgba(0,0,0,0)",
                            height: "80px"
                        },
                        ".xui-input-round": {
                            borderTopWidth: "1px",
                            borderRightWidth: "1px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "1px",
                            borderStyle: "solid",
                            borderTopColor: "#cccccc",
                            borderRightColor: "#cccccc",
                            borderBottomColor: "#cccccc",
                            borderLeftColor: "#cccccc",
                            borderRadius: "10px",
                            paddingTop: "20px",
                            paddingRight: "30px",
                            paddingBottom: "20px",
                            paddingLeft: "30px",
                            backgroundColor: "rgba(0,0,0,0)",
                            height: "80px",
                            fontSize: "30px"
                        },
                        ".xui-input-group-col-title": {
                            marginBottom: "10px"
                        },
                        ".xui-input-group-row-title": {
                            marginRight: "30px"
                        },
                        ".xui-tab-bar": {
                            backgroundColor: "#ffffff"
                        },
                        ".xui-tab-bar-text": {
                            textAlign: "center",
                            "color:active": "#0faeff"
                        },
                        ".xui-text-bold": {
                            fontWeight: "bold"
                        },
                        ".xui-div-left-right": {
                            flexDirection: "row",
                            justifyContent: "space-between"
                        },
                        ".xui-color-0": {
                            color: "#000000"
                        },
                        ".xui-color-1": {
                            color: "#ffffff"
                        },
                        ".xui-bgColor-0": {
                            backgroundColor: "#000000"
                        },
                        ".xui-bgColor-1": {
                            backgroundColor: "#ffffff"
                        },
                        ".xui-padding": {
                            paddingTop: "30px",
                            paddingRight: "30px",
                            paddingBottom: "30px",
                            paddingLeft: "30px"
                        },
                        ".xui-padding-top": {
                            paddingTop: "30px"
                        },
                        ".xui-padding-right": {
                            paddingRight: "30px"
                        },
                        ".xui-padding-bottom": {
                            paddingBottom: "30px"
                        },
                        ".xui-padding-left": {
                            paddingLeft: "30px"
                        },
                        ".xui-padding-s": {
                            paddingTop: "15px",
                            paddingRight: "15px",
                            paddingBottom: "15px",
                            paddingLeft: "15px"
                        },
                        ".xui-padding-top-s": {
                            paddingTop: "15px"
                        },
                        ".xui-padding-right-s": {
                            paddingRight: "15px"
                        },
                        ".xui-padding-bottom-s": {
                            paddingBottom: "15px"
                        },
                        ".xui-padding-left-s": {
                            paddingLeft: "15px"
                        },
                        ".xui-padding-m": {
                            paddingTop: "20px",
                            paddingRight: "20px",
                            paddingBottom: "20px",
                            paddingLeft: "20px"
                        },
                        ".xui-padding-top-m": {
                            paddingTop: "20px"
                        },
                        ".xui-padding-right-m": {
                            paddingRight: "20px"
                        },
                        ".xui-padding-bottom-m": {
                            paddingBottom: "20px"
                        },
                        ".xui-padding-left-m": {
                            paddingLeft: "20px"
                        },
                        ".xui-margin": {
                            marginTop: "30px",
                            marginRight: "30px",
                            marginBottom: "30px",
                            marginLeft: "30px"
                        },
                        ".xui-margin-top": {
                            marginTop: "30px"
                        },
                        ".xui-margin-right": {
                            marginRight: "30px"
                        },
                        ".xui-margin-bottom": {
                            marginBottom: "30px"
                        },
                        ".xui-margin-left": {
                            marginLeft: "30px"
                        },
                        ".xui-margin-s": {
                            marginTop: "15px",
                            marginRight: "15px",
                            marginBottom: "15px",
                            marginLeft: "15px"
                        },
                        ".xui-margin-top-s": {
                            marginTop: "15px"
                        },
                        ".xui-margin-right-s": {
                            marginRight: "15px"
                        },
                        ".xui-margin-bottom-s": {
                            marginBottom: "15px"
                        },
                        ".xui-margin-left-s": {
                            marginLeft: "15px"
                        },
                        ".xui-margin-m": {
                            marginTop: "20px",
                            marginRight: "20px",
                            marginBottom: "20px",
                            marginLeft: "20px"
                        },
                        ".xui-margin-top-m": {
                            marginTop: "20px"
                        },
                        ".xui-margin-right-m": {
                            marginRight: "20px"
                        },
                        ".xui-margin-bottom-m": {
                            marginBottom: "20px"
                        },
                        ".xui-margin-left-m": {
                            marginLeft: "20px"
                        },
                        ".xui-width-10": {
                            width: "10%"
                        },
                        ".xui-width-20": {
                            width: "20%"
                        },
                        ".xui-width-25": {
                            width: "25%"
                        },
                        ".xui-width-30": {
                            width: "30%"
                        },
                        ".xui-width-40": {
                            width: "40%"
                        },
                        ".xui-width-50": {
                            width: "50%"
                        },
                        ".xui-width-60": {
                            width: "60%"
                        },
                        ".xui-width-70": {
                            width: "70%"
                        },
                        ".xui-width-80": {
                            width: "80%"
                        },
                        ".xui-width-90": {
                            width: "90%"
                        },
                        ".xui-width-100": {
                            width: "100%"
                        },
                        ".xui-height-40": {
                            height: "40px"
                        },
                        ".xui-height-60": {
                            height: "60px"
                        },
                        ".xui-height-80": {
                            height: "80px"
                        },
                        ".xui-height-100": {
                            height: "100px"
                        },
                        ".xui-fontSize-20": {
                            fontSize: "20px"
                        },
                        ".xui-fontSize-25": {
                            fontSize: "25px"
                        },
                        ".xui-fontSize-30": {
                            fontSize: "30px"
                        },
                        ".xui-fontSize-35": {
                            fontSize: "35px"
                        },
                        ".xui-fontSize-40": {
                            fontSize: "40px"
                        },
                        ".xui-border": {
                            borderTopColor: "#dddddd",
                            borderRightColor: "#dddddd",
                            borderBottomColor: "#dddddd",
                            borderLeftColor: "#dddddd",
                            borderTopWidth: "1px",
                            borderRightWidth: "1px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "1px"
                        },
                        ".xui-border-top": {
                            borderTopColor: "#dddddd",
                            borderRightColor: "#dddddd",
                            borderBottomColor: "#dddddd",
                            borderLeftColor: "#dddddd",
                            borderTopWidth: "1px"
                        },
                        ".xui-border-right": {
                            borderTopColor: "#dddddd",
                            borderRightColor: "#dddddd",
                            borderBottomColor: "#dddddd",
                            borderLeftColor: "#dddddd",
                            borderRightWidth: "1px"
                        },
                        ".xui-border-bottom": {
                            borderTopColor: "#dddddd",
                            borderRightColor: "#dddddd",
                            borderBottomColor: "#dddddd",
                            borderLeftColor: "#dddddd",
                            borderBottomWidth: "1px"
                        },
                        ".xui-border-left": {
                            borderTopColor: "#dddddd",
                            borderRightColor: "#dddddd",
                            borderBottomColor: "#dddddd",
                            borderLeftColor: "#dddddd",
                            borderLeftWidth: "1px"
                        },
                        ".xui-bRadius-2": {
                            borderRadius: "2px"
                        },
                        ".xui-bRadius-4": {
                            borderRadius: "4px"
                        },
                        ".xui-bRadius-6": {
                            borderRadius: "6px"
                        },
                        ".xui-bRadius-8": {
                            borderRadius: "8px"
                        },
                        ".xui-bRadius-10": {
                            borderRadius: "12px"
                        },
                        ".xui-bRadius-14": {
                            borderRadius: "14px"
                        },
                        ".xui-text-center": {
                            textAlign: "center"
                        },
                        ".xui-text-right": {
                            textAlign: "right"
                        },
                        ".xui-text-left": {
                            textAlign: "left"
                        },
                        ".xui-line-height-35": {
                            lineHeight: "35px"
                        },
                        ".xui-line-height-40": {
                            lineHeight: "40px"
                        },
                        ".xui-line-height-45": {
                            lineHeight: "45px"
                        },
                        ".xui-line-height-50": {
                            lineHeight: "45px"
                        },
                        ".xui-hidden": {
                            display: "none"
                        },
                        ".xui-show": {
                            display: "flex"
                        },
                        ".input-btn": {
                            backgroundColor: "#0faeff",
                            color: "#ffffff",
                            borderRadius: "10px",
                            marginLeft: "30px"
                        },
                        ".disabled": {
                            backgroundColor: "#999999"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/functionality/verification/index.ux?uxType=page&": module => {
                    module.exports = {
                        type: "div",
                        attr: {},
                        classList: [ "doc-page" ],
                        children: [ {
                            type: "text",
                            attr: {
                                value: "手机号验证"
                            },
                            classList: [ "xui-demo-head-desc" ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "xui-input-group-row" ],
                            children: [ {
                                type: "input",
                                attr: {
                                    type: "number",
                                    placeholder: "请输入手机号码"
                                },
                                classList: [ "xui-col", "xui-input-round" ],
                                events: {
                                    change: "verifyPhone"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: function() {
                                        return this.btn_val;
                                    },
                                    disabled: function() {
                                        return this.btn_class == "disabled";
                                    }
                                },
                                classList: function() {
                                    return [ "input-btn", this.btn_class ];
                                },
                                events: {
                                    click: "sendVerification"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "xui-input-group-row" ],
                            children: [ {
                                type: "input",
                                attr: {
                                    type: "number",
                                    placeholder: "请输入验证码"
                                },
                                classList: [ "xui-col", "xui-input-round" ],
                                events: {
                                    change: "verifyCode"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "提交",
                                    disabled: function() {
                                        return this.btn_submit_class == "disabled";
                                    }
                                },
                                classList: function() {
                                    return [ "input-btn", this.btn_submit_class ];
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/functionality/verification/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/functionality/verification/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/functionality/verification/index.ux?uxType=page");
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