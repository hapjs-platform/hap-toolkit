/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/system/request/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$("@app-module/system.request"));
                        var _system2 = _interopRequireDefault($app_require$("@app-module/system.prompt"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            private: {
                                componentName: "request",
                                fileUploadData: "",
                                token: "",
                                fileDownloadData: ""
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Requst"
                                });
                            },
                            downloadFile() {
                                const self = this;
                                _system.default.download({
                                    url: "https://www.quickapp.cn/assets/images/home/logo.png",
                                    description: "一个网络图片",
                                    filename: "quickappLogo.png",
                                    success: function(ret) {
                                        self.token = ret.token;
                                        console.info(`### request.download ### ${JSON.stringify(ret)}`);
                                    }
                                });
                            },
                            downloadFileComplete() {
                                const self = this;
                                _system.default.onDownloadComplete({
                                    token: self.token,
                                    success: function(ret) {
                                        self.fileDownloadData = ret.uri;
                                        self.fileUploadData = ret.uri;
                                    },
                                    fail: function(msg, code) {
                                        console.info(`### request.onDownloadComplete ### ${code}: ${msg}`);
                                        _system2.default.showToast({
                                            message: `${code}: ${msg}`
                                        });
                                    }
                                });
                            },
                            uploadFile() {
                                const self = this;
                                _system.default.upload({
                                    url: "https://www.quickapp.cn/",
                                    files: [ {
                                        uri: self.fileUploadData,
                                        name: "component_test.pdf"
                                    } ],
                                    data: [ {
                                        name: "param1",
                                        value: "value1"
                                    } ],
                                    success: function(ret) {
                                        self.fileUploadData = ret.data;
                                    },
                                    fail: function(msg, code) {
                                        self.fileUploadData = `${code}: ${msg}`;
                                        console.info(`### request.upload ### ${code}: ${msg}`);
                                        _system2.default.showToast({
                                            message: `${code}: ${msg}`
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/system/request/index.ux?uxType=page": module => {
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
                            paddingLeft: "30px",
                            paddingRight: "30px",
                            paddingTop: "20px",
                            paddingBottom: "20px",
                            marginBottom: "30px",
                            alignItems: "flex-start"
                        },
                        ".txt": {
                            lines: 5,
                            paddingTop: "15px",
                            paddingBottom: "15px"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/system/request/index.ux?uxType=page&": module => {
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
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "下载的token：" + this.token;
                                        }
                                    },
                                    classList: [ "txt" ]
                                } ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "下载文件"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "downloadFile"
                                }
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "下载文件的Uri：" + this.fileDownloadData;
                                        }
                                    },
                                    classList: [ "txt" ]
                                } ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "监听下载任务"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "downloadFileComplete"
                                }
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "上传文件：" + this.fileUploadData;
                                        }
                                    },
                                    classList: [ "txt" ]
                                } ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "上传文件"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "uploadFile"
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/system/request/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/system/request/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/system/request/index.ux?uxType=page");
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