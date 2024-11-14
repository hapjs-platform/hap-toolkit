/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/system/media/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$("@app-module/system.prompt"));
                        var _system2 = _interopRequireDefault($app_require$("@app-module/system.media"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            private: {
                                componentName: "media",
                                pathPhotoSave: "",
                                pathPhotoPick: "",
                                pathVideoSave: "",
                                pathVideoPick: "",
                                pathRecordStart: "",
                                pathRecordStop: "",
                                photoUri: "",
                                videoUri: "",
                                pathFilePick: ""
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Media"
                                });
                            },
                            takePhoto() {
                                const self = this;
                                _system2.default.takePhoto({
                                    success: function(ret) {
                                        self.pathPhotoSave = ret.uri;
                                        self.photoUri = ret.uri;
                                    },
                                    fail: function(erromsg, errocode) {
                                        console.info(`### media.takePhoto ### ${errocode}: ${erromsg}`);
                                        _system.default.showToast({
                                            message: `${errocode}: ${erromsg}`
                                        });
                                    }
                                });
                            },
                            pickPhoto() {
                                const self = this;
                                _system2.default.pickImage({
                                    success: function(ret) {
                                        self.pathPhotoPick = ret.uri;
                                        self.photoUri = ret.uri;
                                    },
                                    fail: function(erromsg, errocode) {
                                        console.info(`### media.pickImage ### ${errocode}: ${erromsg}`);
                                        _system.default.showToast({
                                            message: `${errocode}: ${erromsg}`
                                        });
                                    }
                                });
                            },
                            takeVideo() {
                                const self = this;
                                _system2.default.takeVideo({
                                    success: function(ret) {
                                        self.pathVideoSave = ret.uri;
                                        self.videoUri = ret.uri;
                                    },
                                    fail: function(erromsg, errocode) {
                                        console.info(`### media.takeVideo ### ${errocode}: ${erromsg}`);
                                        _system.default.showToast({
                                            message: `${errocode}: ${erromsg}`
                                        });
                                    }
                                });
                            },
                            pickVideo() {
                                const self = this;
                                _system2.default.pickVideo({
                                    success: function(ret) {
                                        self.pathVideoPick = ret.uri;
                                        self.videoUri = ret.uri;
                                    },
                                    fail: function(erromsg, errocode) {
                                        console.info(`### media.pickVideo ### ${errocode}: ${erromsg}`);
                                        _system.default.showToast({
                                            message: `${errocode}: ${erromsg}`
                                        });
                                    }
                                });
                            },
                            pickFile() {
                                const self = this;
                                _system2.default.pickFile({
                                    success: function(ret) {
                                        self.pathFilePick = ret.uri;
                                    },
                                    fail: function(erromsg, errocode) {
                                        console.info(`### media.pickFile ### ${errocode}: ${erromsg}`);
                                        _system.default.showToast({
                                            message: `${errocode}: ${erromsg}`
                                        });
                                    }
                                });
                            },
                            saveImageToAlbum() {
                                if (!this.pathPhotoSave) {
                                    _system.default.showToast({
                                        message: `please take a photo firstly`
                                    });
                                    return;
                                }
                                _system2.default.saveToPhotosAlbum({
                                    uri: this.pathPhotoSave,
                                    success: function() {
                                        _system.default.showToast({
                                            message: `save success`
                                        });
                                    },
                                    fail: function(erromsg, errocode) {
                                        _system.default.showToast({
                                            message: `${errocode}: ${erromsg}`
                                        });
                                    }
                                });
                            },
                            saveVideoToAlbum() {
                                if (!this.pathVideoSave) {
                                    _system.default.showToast({
                                        message: `please record a video firstly`
                                    });
                                    return;
                                }
                                _system2.default.saveToPhotosAlbum({
                                    uri: this.pathVideoSave,
                                    success: function() {
                                        _system.default.showToast({
                                            message: `save success`
                                        });
                                    },
                                    fail: function(erromsg, errocode) {
                                        _system.default.showToast({
                                            message: `${errocode}: ${erromsg}`
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/system/media/index.ux?uxType=page": module => {
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
                        ".item-content": {
                            flexDirection: "column",
                            backgroundColor: "#ffffff",
                            paddingTop: "30px",
                            paddingRight: "30px",
                            paddingBottom: "30px",
                            paddingLeft: "30px",
                            marginBottom: "20px"
                        },
                        ".image": {
                            marginTop: "50px",
                            marginRight: "0px",
                            marginBottom: "50px",
                            marginLeft: "0px",
                            width: "630px",
                            height: "300px"
                        },
                        ".video": {
                            marginTop: "50px",
                            marginRight: "0px",
                            marginBottom: "50px",
                            marginLeft: "0px",
                            width: "630px",
                            height: "300px"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/system/media/index.ux?uxType=page&": module => {
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
                                            return "" + "拍摄图片的路径: " + this.pathPhotoSave;
                                        }
                                    },
                                    classList: [ "txt" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "选取图片的路径：" + this.pathPhotoPick;
                                        }
                                    },
                                    classList: [ "txt" ]
                                }, {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return this.photoUri;
                                        }
                                    },
                                    classList: [ "image" ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "拍摄照片"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "takePhoto"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "将拍摄的照片保存到本地"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "saveImageToAlbum"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "选取图片"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "pickPhoto"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "拍摄视频的路径：" + this.pathVideoSave;
                                        }
                                    },
                                    classList: [ "txt" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "选取视频的路径：" + this.pathVideoPick;
                                        }
                                    },
                                    classList: [ "txt" ]
                                }, {
                                    type: "video",
                                    attr: {
                                        src: function() {
                                            return this.videoUri;
                                        },
                                        autoplay: "true"
                                    },
                                    classList: [ "video" ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "拍摄视频"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "takeVideo"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "将拍摄的视频保存到本地"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "saveVideoToAlbum"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "选择视频"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "pickVideo"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "选取文件的路径：" + this.pathFilePick;
                                        }
                                    },
                                    classList: [ "txt" ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "选取文件"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "pickFile"
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/interface/system/media/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/interface/system/media/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/interface/system/media/index.ux?uxType=page");
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