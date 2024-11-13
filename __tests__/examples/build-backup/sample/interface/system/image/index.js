/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/system/image/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$("@app-module/system.image"));
                        var _system2 = _interopRequireDefault($app_require$("@app-module/system.request"));
                        var _system3 = _interopRequireDefault($app_require$("@app-module/system.prompt"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            private: {
                                componentName: "image",
                                imageUri: "",
                                showMask: true,
                                hint: "Loading...",
                                imageGetInfo: {},
                                imageCompressInfo: {},
                                imageOperateInfo: {},
                                imageEditInfo: {}
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Image"
                                });
                                this.preTask();
                            },
                            preTask() {
                                const self = this;
                                _system2.default.download({
                                    url: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2247692397,1189743173&fm=5",
                                    success: function(data) {
                                        _system2.default.onDownloadComplete({
                                            token: data.token,
                                            success: function(ret) {
                                                self.imageUri = ret.uri;
                                                self.showMask = false;
                                            },
                                            fail: function(erromsg, errocode) {
                                                self.hint = `${errocode}: ${erromsg}`;
                                                console.info(`### request.onDownloadComplete ### ${errocode}: ${erromsg}`);
                                                _system3.default.showToast({
                                                    message: `${errocode}: ${erromsg}`
                                                });
                                            }
                                        });
                                    }
                                });
                            },
                            showToast() {
                                _system3.default.showToast({
                                    message: `${this.hint}`
                                });
                            },
                            getImageInfo() {
                                const self = this;
                                _system.default.getInfo({
                                    uri: self.imageUri,
                                    success: function(data) {
                                        self.imageGetInfo = data;
                                    },
                                    fail: function(erromsg, errocode) {
                                        console.info(`### image.getInfo ### ${errocode}: ${erromsg}`);
                                        _system3.default.showToast({
                                            message: `${errocode}: ${erromsg}`
                                        });
                                    },
                                    complete: function() {
                                        _system3.default.showToast({
                                            message: `complete`
                                        });
                                    }
                                });
                            },
                            compressImage() {
                                const self = this;
                                _system.default.compress({
                                    uri: self.imageUri,
                                    quality: 50,
                                    ratio: 5,
                                    format: "WEBP",
                                    success: function(data) {
                                        self.imageCompressInfo = data;
                                    },
                                    fail: function(erromsg, errocode) {
                                        console.info(`### image.compress ### ${errocode}: ${erromsg}`);
                                        _system3.default.showToast({
                                            message: `${errocode}: ${erromsg}`
                                        });
                                    },
                                    complete: function() {
                                        _system3.default.showToast({
                                            message: `complete`
                                        });
                                    }
                                });
                            },
                            operateImage() {
                                const self = this;
                                _system.default.applyOperations({
                                    uri: self.imageUri,
                                    operations: [ {
                                        action: "crop",
                                        x: 30,
                                        y: 50,
                                        width: 50,
                                        height: 50
                                    }, {
                                        action: "scale",
                                        scaleX: 2,
                                        scaleY: 2
                                    }, {
                                        action: "rotate",
                                        degree: 180
                                    } ],
                                    quality: 50,
                                    format: "WEBP",
                                    success: function(data) {
                                        self.imageOperateInfo = data;
                                    },
                                    fail: function(erromsg, errocode) {
                                        console.info(`### image.applyOperations ### ${errocode}: ${erromsg}`);
                                        _system3.default.showToast({
                                            message: `${errocode}: ${erromsg}`
                                        });
                                    },
                                    complete: function() {
                                        _system3.default.showToast({
                                            message: `complete`
                                        });
                                    }
                                });
                            },
                            editImage() {
                                const self = this;
                                _system.default.edit({
                                    uri: self.imageUri,
                                    success: function(data) {
                                        self.imageEditInfo = data;
                                    },
                                    fail: function(erromsg, errocode) {
                                        console.info(`### image.edit ### ${errocode}: ${erromsg}`);
                                        _system3.default.showToast({
                                            message: `${errocode}: ${erromsg}`
                                        });
                                    },
                                    complete: function() {
                                        _system3.default.showToast({
                                            message: `complete`
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/system/image/index.ux?uxType=page": module => {
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
                        ".main": {
                            flexDirection: "column"
                        },
                        ".mask": {
                            flex: 1,
                            flexDirection: "column",
                            alignContent: "center",
                            paddingTop: "400px",
                            backgroundColor: "rgba(0,0,0,0.5)"
                        },
                        ".color-white": {
                            color: "#FFFFFF"
                        },
                        ".font-m": {
                            marginBottom: "100px",
                            textAlign: "center",
                            fontSize: "40px"
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
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/system/image/index.ux?uxType=page&": module => {
                    module.exports = {
                        type: "stack",
                        attr: {},
                        classList: [ "doc-page" ],
                        children: [ {
                            type: "div",
                            attr: {},
                            classList: [ "main" ],
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
                                            value: "获取图片信息:"
                                        },
                                        classList: [ "txt" ]
                                    }, {
                                        type: "image",
                                        attr: {
                                            src: function() {
                                                return this.imageGetInfo.uri || "";
                                            }
                                        }
                                    }, {
                                        type: "text",
                                        attr: {
                                            value: function() {
                                                return "" + "uri: " + (this.imageGetInfo.uri || "");
                                            }
                                        },
                                        classList: [ "txt" ]
                                    }, {
                                        type: "text",
                                        attr: {
                                            value: function() {
                                                return "" + "width: " + (this.imageGetInfo.width || "");
                                            }
                                        },
                                        classList: [ "txt" ]
                                    }, {
                                        type: "text",
                                        attr: {
                                            value: function() {
                                                return "" + "height: " + (this.imageGetInfo.height || "");
                                            }
                                        },
                                        classList: [ "txt" ]
                                    }, {
                                        type: "text",
                                        attr: {
                                            value: function() {
                                                return "" + "size: " + (this.imageGetInfo.size || "");
                                            }
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "获取图片信息"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "getImageInfo"
                                    }
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
                                            value: "压缩图片:"
                                        },
                                        classList: [ "txt" ]
                                    }, {
                                        type: "image",
                                        attr: {
                                            src: function() {
                                                return this.imageCompressInfo.uri || "";
                                            }
                                        }
                                    }, {
                                        type: "text",
                                        attr: {
                                            value: function() {
                                                return "" + "uri: " + (this.imageCompressInfo.uri || "");
                                            }
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "压缩图片"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "compressImage"
                                    }
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
                                            value: "按操作顺序编辑图片:"
                                        },
                                        classList: [ "txt" ]
                                    }, {
                                        type: "image",
                                        attr: {
                                            src: function() {
                                                return this.imageOperateInfo.uri || "";
                                            }
                                        }
                                    }, {
                                        type: "text",
                                        attr: {
                                            value: function() {
                                                return "" + "uri: " + (this.imageOperateInfo.uri || "");
                                            }
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "按操作顺序编辑图片"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "operateImage"
                                    }
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
                                            value: "编辑图片:"
                                        },
                                        classList: [ "txt" ]
                                    }, {
                                        type: "image",
                                        attr: {
                                            src: function() {
                                                return this.imageEditInfo.uri || "";
                                            }
                                        }
                                    }, {
                                        type: "text",
                                        attr: {
                                            value: function() {
                                                return "" + "uri: " + (this.imageEditInfo.uri || "");
                                            }
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "编辑图片"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "editImage"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            shown: function() {
                                return this.showMask;
                            },
                            classList: [ "mask" ],
                            events: {
                                click: "showToast"
                            },
                            children: [ {
                                type: "text",
                                attr: {
                                    value: function() {
                                        return this.hint;
                                    }
                                },
                                classList: [ "font-m" ]
                            }, {
                                type: "text",
                                attr: {
                                    value: "点击刷新页面"
                                },
                                classList: [ "font-m", "color-white" ],
                                events: {
                                    click: "preTask"
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/system/image/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/system/image/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/system/image/index.ux?uxType=page");
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