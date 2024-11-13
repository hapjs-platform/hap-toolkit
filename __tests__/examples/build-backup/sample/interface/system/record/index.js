/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/system/record/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$("@app-module/system.record"));
                        var _system2 = _interopRequireDefault($app_require$("@app-module/system.audio"));
                        var _system3 = _interopRequireDefault($app_require$("@app-module/system.storage"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            private: {
                                componentName: "Record",
                                path: "",
                                duration: 1000,
                                sampleRate: 8000,
                                numberOfChannels: 1,
                                encodeBitRate: 16000,
                                format: ""
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: this.componentName
                                });
                            },
                            start() {
                                this.path = "录音中...";
                                _system.default.start({
                                    duration: this.duration,
                                    sampleRate: this.sampleRate,
                                    numberOfChannels: this.numberOfChannels,
                                    encodeBitRate: this.encodeBitRate,
                                    format: this.format,
                                    success: data => {
                                        this.path = data.uri;
                                    },
                                    fail: (err, code) => {
                                        this.path = "handling fail, code=" + code;
                                    }
                                });
                            },
                            stop() {
                                _system.default.stop();
                            },
                            playAudio() {
                                _system2.default.src = this.path;
                                _system2.default.play();
                            },
                            changeValue(args, evt) {
                                this[args] = evt.value;
                                _system3.default.set({
                                    key: args,
                                    value: evt.value
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/system/record/index.ux?uxType=page": module => {
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
                            marginBottom: "50px"
                        },
                        ".item-content input": {
                            width: "350px",
                            marginLeft: "10px",
                            paddingTop: "10px",
                            paddingRight: "10px",
                            paddingBottom: "10px",
                            paddingLeft: "10px",
                            textAlign: "center",
                            borderTopWidth: "1px",
                            borderRightWidth: "1px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "1px",
                            borderTopColor: "#dddddd",
                            borderRightColor: "#dddddd",
                            borderBottomColor: "#dddddd",
                            borderLeftColor: "#dddddd",
                            backgroundColor: "#ffffff",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "item-content"
                                }, {
                                    t: "d"
                                }, {
                                    t: "t",
                                    n: "input"
                                } ]
                            }
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/system/record/index.ux?uxType=page&": module => {
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
                                            return "" + "录音文件路径: " + this.path;
                                        }
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "label",
                                    attr: {
                                        value: "duration:"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "text",
                                        placeholder: "duration",
                                        value: function() {
                                            return this.duration;
                                        }
                                    },
                                    events: {
                                        change: function(evt) {
                                            return this.changeValue("duration", evt);
                                        }
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "label",
                                    attr: {
                                        value: "sampleRate:"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "text",
                                        placeholder: "sampleRate",
                                        value: function() {
                                            return this.sampleRate;
                                        }
                                    },
                                    events: {
                                        change: function(evt) {
                                            return this.changeValue("sampleRate", evt);
                                        }
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "label",
                                    attr: {
                                        value: "numberOfChannels:"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "text",
                                        placeholder: "numberOfChannels",
                                        value: function() {
                                            return this.numberOfChannels;
                                        }
                                    },
                                    events: {
                                        change: function(evt) {
                                            return this.changeValue("numberOfChannels", evt);
                                        }
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "label",
                                    attr: {
                                        value: "encodeBitRate:"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "text",
                                        placeholder: "encodeBitRate",
                                        value: function() {
                                            return this.encodeBitRate;
                                        }
                                    },
                                    events: {
                                        change: function(evt) {
                                            return this.changeValue("encodeBitRate", evt);
                                        }
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "label",
                                    attr: {
                                        value: "format:"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "text",
                                        placeholder: "3gpp/amr_nb/aac",
                                        value: function() {
                                            return this.format;
                                        }
                                    },
                                    events: {
                                        change: function(evt) {
                                            return this.changeValue("format", evt);
                                        }
                                    }
                                } ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "开始录音"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "start"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "录音完成"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "stop"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "播放当前录音"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "playAudio"
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/system/record/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/system/record/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/system/record/index.ux?uxType=page");
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