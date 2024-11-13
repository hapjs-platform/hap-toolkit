/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/system/sensor/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$("@app-module/system.sensor"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            private: {
                                componentName: "sensor",
                                sensorAccelerometerData: {
                                    x: "",
                                    y: "",
                                    z: ""
                                },
                                sensorCompassData: 0,
                                subscribeProximityData: 0,
                                lightData: 0
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Sensor"
                                });
                            },
                            accelerometer() {
                                const self = this;
                                _system.default.subscribeAccelerometer({
                                    callback: function(ret) {
                                        self.sensorAccelerometerData = ret;
                                    }
                                });
                            },
                            unaccelerometer() {
                                _system.default.unsubscribeAccelerometer();
                            },
                            compass() {
                                const self = this;
                                _system.default.subscribeCompass({
                                    callback: function(e) {
                                        self.sensorCompassData = e.direction;
                                    }
                                });
                            },
                            uncompass() {
                                _system.default.unsubscribeCompass();
                            },
                            proximity() {
                                const self = this;
                                _system.default.subscribeProximity({
                                    callback: function(e) {
                                        self.subscribeProximityData = e.distance;
                                    }
                                });
                            },
                            unproximity() {
                                _system.default.unsubscribeProximity();
                            },
                            light() {
                                const self = this;
                                _system.default.subscribeLight({
                                    callback: function(e) {
                                        self.lightData = e.intensity;
                                    }
                                });
                            },
                            unlight() {
                                _system.default.unsubscribeLight();
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/system/sensor/index.ux?uxType=page": module => {
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
                            marginBottom: "100px",
                            alignItems: "flex-start"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/system/sensor/index.ux?uxType=page&": module => {
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
                                        value: "重力感应数据:"
                                    },
                                    classList: [ "txt" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "X: " + this.sensorAccelerometerData.x;
                                        }
                                    },
                                    classList: [ "txt" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "Y: " + this.sensorAccelerometerData.y;
                                        }
                                    },
                                    classList: [ "txt" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "Z: " + this.sensorAccelerometerData.z;
                                        }
                                    },
                                    classList: [ "txt" ]
                                } ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "监听重力感应数据"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "accelerometer"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "取消重力感应监听"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "unaccelerometer"
                                }
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "罗盘数据:"
                                    },
                                    classList: [ "txt" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "direction: " + this.sensorCompassData;
                                        }
                                    },
                                    classList: [ "txt" ]
                                } ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "监听罗盘数据"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "compass"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "取消罗盘监听"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "uncompass"
                                }
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "距离感应数据:"
                                    },
                                    classList: [ "txt" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "distance: " + this.subscribeProximityData + " cm";
                                        }
                                    },
                                    classList: [ "txt" ]
                                } ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "监听距离感应数据"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "proximity"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "取消距离感应监听"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "unproximity"
                                }
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "光线感应数据:"
                                    },
                                    classList: [ "txt" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "intensity: " + this.lightData + " lux";
                                        }
                                    },
                                    classList: [ "txt" ]
                                } ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "监听光线感应数据"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "light"
                                }
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "取消光线感应监听"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "unlight"
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/system/sensor/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/system/sensor/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/system/sensor/index.ux?uxType=page");
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