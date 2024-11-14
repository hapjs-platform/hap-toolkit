/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/system/websocket/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$("@app-module/system.prompt"));
                        var _system2 = _interopRequireDefault($app_require$("@app-module/system.websocketfactory"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        let ws = {
                            websock1: null,
                            websock2: null
                        };
                        var _default = {
                            data: {
                                componentName: "websocket",
                                message: ""
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: this.componentName
                                });
                            },
                            create(name, isbuffer) {
                                if (ws[name]) {
                                    _system.default.showToast({
                                        message: `[client ${name}] has been existed`
                                    });
                                    return false;
                                }
                                _system.default.showToast({
                                    message: `[client ${name}] is creating, wait please.`
                                });
                                let _ws = _system2.default.create({
                                    url: isbuffer === true ? "ws://demos.kaazing.com/echo" : "wss://echo.websocket.org",
                                    header: {
                                        "content-type": "application/json"
                                    },
                                    protocols: [ "protocol" ]
                                });
                                if (isbuffer === true) {
                                    _ws.binaryType = "arraybuffer";
                                }
                                _ws.onopen = function() {
                                    _system.default.showToast({
                                        message: `[client ${name}] connect open`
                                    });
                                };
                                _ws.onmessage = function(data) {
                                    let res = data.data;
                                    let type = Object.prototype.toString.call(res);
                                    function ab2str(buf) {
                                        return String.fromCharCode.apply(null, new Uint16Array(buf));
                                    }
                                    if (Object.prototype.toString.call(res) === "[object ArrayBuffer]") {
                                        res = ab2str(res);
                                    }
                                    _system.default.showToast({
                                        message: `[client ${name}] has received,type: ${type}; message: ${res} from server`
                                    });
                                };
                                _ws.onerror = function(data) {
                                    _system.default.showToast({
                                        message: `onerror [client ${name}] data.data = ${data.data}`
                                    });
                                };
                                _ws.onclose = function(data) {
                                    _system.default.showToast({
                                        message: `onclose [client ${name}] data.code = ${data.code}, data.reason = ${data.reason}, data.wasClean = ${data.wasClean}`
                                    });
                                };
                                ws[name] = _ws;
                            },
                            handleChange(e) {
                                this.message = e.value;
                            },
                            send(name) {
                                let _ws = ws[name];
                                if (!_ws) {
                                    return false;
                                }
                                function str2ab(str) {
                                    var buf = new ArrayBuffer(str.length * 2);
                                    var bufView = new Uint16Array(buf);
                                    for (var i = 0, strLen = str.length; i < strLen; i++) {
                                        bufView[i] = str.charCodeAt(i);
                                    }
                                    return buf;
                                }
                                let msg = _ws.binaryType !== "arraybuffer" ? this.message : str2ab(this.message);
                                _ws.send({
                                    data: msg,
                                    success: function() {
                                        _system.default.showToast({
                                            message: `[client ${name}] send success`
                                        });
                                    },
                                    fail: function(data, code) {
                                        _system.default.showToast({
                                            message: `[client ${name}] handling fail, code = ${code}`
                                        });
                                    }
                                });
                            },
                            close(name) {
                                if (!ws[name]) {
                                    return false;
                                }
                                ws[name].close({
                                    success: function() {
                                        _system.default.showToast({
                                            message: `[client ${name}] close success`
                                        });
                                        ws[name] = null;
                                    },
                                    fail: function(data, code) {
                                        _system.default.showToast({
                                            message: `[client ${name}] handling fail, code = ${code}`
                                        });
                                    }
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/system/websocket/index.ux?uxType=page": module => {
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
                        },
                        ".input-text": {
                            height: "80px",
                            lineHeight: "80px",
                            paddingLeft: "30px",
                            paddingRight: "30px",
                            marginLeft: "30px",
                            marginRight: "30px",
                            marginBottom: "50px",
                            borderTopWidth: "1px",
                            borderBottomWidth: "1px",
                            borderTopColor: "#999999",
                            borderRightColor: "#999999",
                            borderBottomColor: "#999999",
                            borderLeftColor: "#999999",
                            fontSize: "30px",
                            backgroundColor: "#ffffff"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/system/websocket/index.ux?uxType=page&": module => {
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
                                    value: "创建实例websocket1"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: function(evt) {
                                        return this.create("websock1", false, evt);
                                    }
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "创建buffer实例websocket2"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: function(evt) {
                                        return this.create("websock2", true, evt);
                                    }
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "text",
                                    placeholder: "请输入"
                                },
                                classList: [ "input-text" ],
                                events: {
                                    change: "handleChange"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "websock1发送消息"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: function(evt) {
                                        return this.send("websock1", evt);
                                    }
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "websock2发送消息"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: function(evt) {
                                        return this.send("websock2", evt);
                                    }
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "websock1关闭连接"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: function(evt) {
                                        return this.close("websock1", evt);
                                    }
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "websock2关闭连接"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: function(evt) {
                                        return this.close("websock2", evt);
                                    }
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/system/websocket/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/system/websocket/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/system/websocket/index.ux?uxType=page");
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