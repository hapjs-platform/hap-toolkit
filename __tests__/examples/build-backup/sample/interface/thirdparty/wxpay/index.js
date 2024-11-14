/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/thirdparty/wxpay/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _service = _interopRequireDefault($app_require$("@app-module/service.wxpay"));
                        var _system = _interopRequireDefault($app_require$("@app-module/system.prompt"));
                        var _system2 = _interopRequireDefault($app_require$("@app-module/system.fetch"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            private: {
                                componentName: "wxpay"
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Wxpay"
                                });
                            },
                            useWxpay() {
                                const payType = _service.default.getType();
                                if (payType == "APP") {
                                    _system.default.showToast({
                                        message: "当前可用微信支付方式：原生支付"
                                    });
                                    _system2.default.fetch({
                                        url: "https://www.quickapp.cn/",
                                        success: function(ret) {
                                            const order = JSON.parse(ret.data);
                                            console.info("WXPAY:prepayid:" + order.prepayid);
                                            _system.default.showToast({
                                                message: "fetch order success  " + ret.data
                                            });
                                            _service.default.pay({
                                                prepayid: order.prepayid,
                                                extra: {
                                                    app_id: order.appid,
                                                    partner_id: order.partnerid,
                                                    package_value: order.package,
                                                    nonce_str: order.noncestr,
                                                    time_stamp: order.timestamp,
                                                    order_sign: order.sign
                                                },
                                                fail: function(data, code) {
                                                    console.info("WXPAY handling fail, code=" + code + " data:" + JSON.stringify(data));
                                                    if (code == "900") {
                                                        _system.default.showToast({
                                                            message: "支付失败：签名错误"
                                                        });
                                                    } else if (code == "901") {
                                                        _system.default.showToast({
                                                            message: "支付失败：包名错误"
                                                        });
                                                    } else if (code == "1000") {
                                                        _system.default.showToast({
                                                            message: "支付失败：未安装微信"
                                                        });
                                                    } else if (code == "2001") {
                                                        _system.default.showToast({
                                                            message: "支付失败：微信app返回订单错误"
                                                        });
                                                    } else {
                                                        _system.default.showToast({
                                                            message: "支付失败：" + code
                                                        });
                                                    }
                                                },
                                                cancel: function() {
                                                    console.info("WXPAY handling cancel");
                                                },
                                                success: function(data) {
                                                    console.info("WXPAY handling success" + " data:" + JSON.stringify(data));
                                                    _system.default.showToast({
                                                        message: "支付提交微信成功"
                                                    });
                                                }
                                            });
                                        }
                                    });
                                } else if (payType == "MWEB") {
                                    _system.default.showToast({
                                        message: "当前可用微信支付方式：网页支付"
                                    });
                                    _service.default.pay({
                                        prepayid: "xxxxxxxxxx",
                                        extra: {
                                            customeKey1: "customeValue1",
                                            customeKey2: "customeValue2"
                                        },
                                        fail: function(data, code) {
                                            console.info("H5 WXPAY handling fail, code=" + code + " data:" + JSON.stringify(data));
                                            if (code == "1000") {
                                                _system.default.showToast({
                                                    message: "支付失败：未安装微信"
                                                });
                                            } else if (code == "1001") {
                                                _system.default.showToast({
                                                    message: "支付失败：url not found"
                                                });
                                            } else {
                                                _system.default.showToast({
                                                    message: "支付失败：" + code
                                                });
                                            }
                                        },
                                        cancel: function() {
                                            console.info("H5 WXPAY handling cancel");
                                        },
                                        success: function(data) {
                                            console.info("H5 WXPAY handling success" + " data:" + JSON.stringify(data));
                                            _system.default.showToast({
                                                message: "支付提交微信成功"
                                            });
                                        }
                                    });
                                } else {
                                    _system.default.showToast({
                                        message: "当前无可用微信支付方式"
                                    });
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/thirdparty/wxpay/index.ux?uxType=page": module => {
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
                            marginTop: "50px",
                            marginRight: "60px",
                            marginLeft: "60px",
                            flexDirection: "column"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/thirdparty/wxpay/index.ux?uxType=page&": module => {
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
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "微信支付"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "useWxpay"
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/thirdparty/wxpay/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/thirdparty/wxpay/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/thirdparty/wxpay/index.ux?uxType=page");
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