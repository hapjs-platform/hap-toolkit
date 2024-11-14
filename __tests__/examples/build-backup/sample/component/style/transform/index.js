/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/style/transform/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _default = {
                            private: {
                                componentName: "transform",
                                r: "",
                                rx: "",
                                ry: "",
                                tx: "",
                                ty: "",
                                sx: "",
                                sy: ""
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Transform"
                                });
                            },
                            rotate() {
                                this.setClass("r", "rotate");
                            },
                            rotateX() {
                                this.setClass("rx", "rotateX");
                                setTimeout((() => {
                                    this.setClass("rx", "");
                                }), 3000);
                            },
                            rotateY() {
                                this.setClass("ry", "rotateY");
                            },
                            translateX() {
                                this.setClass("tx", "translateX");
                            },
                            translateY() {
                                this.setClass("ty", "translateY");
                            },
                            scaleX() {
                                this.setClass("sx", "scaleX");
                            },
                            scaleY() {
                                this.setClass("sy", "scaleY");
                            },
                            setClass(key, className) {
                                const self = this;
                                if (self[key] == className) {
                                    self[key] += "Recovery";
                                } else {
                                    self[key] = className;
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/style/transform/index.ux?uxType=page": module => {
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
                            flexDirection: "column",
                            alignItems: "center"
                        },
                        ".group": {
                            marginBottom: "100px",
                            flexDirection: "column",
                            alignItems: "center"
                        },
                        ".header": {
                            marginBottom: "20px"
                        },
                        ".txt": {
                            textAlign: "center",
                            width: "200px",
                            height: "100px"
                        },
                        ".item": {
                            alignItems: "center",
                            marginBottom: "100px"
                        },
                        ".button": {
                            flex: 1,
                            marginLeft: "30px",
                            borderRadius: "10px",
                            fontSize: "30px",
                            color: "#ffffff",
                            textAlign: "center",
                            backgroundColor: "#0faeff"
                        },
                        ".button-first": {
                            marginLeft: "0px"
                        },
                        ".green-box": {
                            marginBottom: "50px",
                            borderStyle: "dotted",
                            borderTopWidth: "2px",
                            borderRightWidth: "2px",
                            borderBottomWidth: "2px",
                            borderLeftWidth: "2px",
                            borderTopColor: "#09ba07",
                            borderRightColor: "#09ba07",
                            borderBottomColor: "#09ba07",
                            borderLeftColor: "#09ba07"
                        },
                        ".blue-box": {
                            marginBottom: "50px",
                            borderStyle: "dotted",
                            borderTopWidth: "2px",
                            borderRightWidth: "2px",
                            borderBottomWidth: "2px",
                            borderLeftWidth: "2px",
                            borderTopColor: "#0faeff",
                            borderRightColor: "#0faeff",
                            borderBottomColor: "#0faeff",
                            borderLeftColor: "#0faeff",
                            color: "#0faeff"
                        },
                        ".red-box": {
                            marginBottom: "50px",
                            borderStyle: "dotted",
                            borderTopWidth: "2px",
                            borderRightWidth: "2px",
                            borderBottomWidth: "2px",
                            borderLeftWidth: "2px",
                            borderTopColor: "#f76160",
                            borderRightColor: "#f76160",
                            borderBottomColor: "#f76160",
                            borderLeftColor: "#f76160",
                            color: "#f76160"
                        },
                        ".green-txt": {
                            color: "#09ba07"
                        },
                        ".blue-text": {
                            color: "#0faeff"
                        },
                        ".red-text": {
                            color: "#f76160"
                        },
                        ".rotate": {
                            transform: '{"rotate":"50deg"}'
                        },
                        ".rotateX": {
                            transform: '{"rotateX":"50deg"}'
                        },
                        ".rotateY": {
                            transform: '{"rotateY":"50deg"}'
                        },
                        ".rotateRecovery": {
                            transform: '{"rotate":"0deg"}'
                        },
                        ".rotateXRecovery": {
                            transform: '{"rotateX":"0deg"}'
                        },
                        ".rotateYRecovery": {
                            transform: '{"rotateY":"0deg"}'
                        },
                        ".translateX": {
                            transform: '{"translateX":"50px"}'
                        },
                        ".translateY": {
                            transform: '{"translateY":"50px"}'
                        },
                        ".translateXRecovery": {
                            transform: '{"translateX":"0px"}'
                        },
                        ".translateYRecovery": {
                            transform: '{"translateY":"0px"}'
                        },
                        ".scaleX": {
                            transform: '{"scaleX":1.5}'
                        },
                        ".scaleY": {
                            transform: '{"scaleY":1.5}'
                        },
                        ".scaleXRecovery": {
                            transform: '{"scaleX":1}'
                        },
                        ".scaleYRecovery": {
                            transform: '{"scaleY":1}'
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/style/transform/index.ux?uxType=page&": module => {
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
                                classList: [ "group" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "rotate"
                                    },
                                    classList: [ "header" ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "item" ],
                                    children: [ {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            name: "",
                                            value: "rotate"
                                        },
                                        classList: [ "button", "button-first" ],
                                        events: {
                                            click: "rotate"
                                        }
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            name: "",
                                            value: "rotateX"
                                        },
                                        classList: [ "button" ],
                                        events: {
                                            click: "rotateX"
                                        }
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            name: "",
                                            value: "rotateY"
                                        },
                                        classList: [ "button" ],
                                        events: {
                                            click: "rotateY"
                                        }
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "green-box", this.r ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "rotate"
                                        },
                                        classList: [ "green-txt", "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "blue-box", this.rx ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "rotateX"
                                        },
                                        classList: [ "blue-text", "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "red-box", this.ry ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "rotateY"
                                        },
                                        classList: [ "red-text", "txt" ]
                                    } ]
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "group" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "translate"
                                    },
                                    classList: [ "header" ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "item" ],
                                    children: [ {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            name: "",
                                            value: "translateX"
                                        },
                                        classList: [ "button", "button-first" ],
                                        events: {
                                            click: "translateX"
                                        }
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            name: "",
                                            value: "translateY"
                                        },
                                        classList: [ "button" ],
                                        events: {
                                            click: "translateY"
                                        }
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "green-box", this.tx ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "translateX"
                                        },
                                        classList: [ "green-txt", "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "red-box", this.ty ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "translateY"
                                        },
                                        classList: [ "red-text", "txt" ]
                                    } ]
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "group" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "scale"
                                    },
                                    classList: [ "header" ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "item" ],
                                    children: [ {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            name: "",
                                            value: "scaleX"
                                        },
                                        classList: [ "button", "button-first" ],
                                        events: {
                                            click: "scaleX"
                                        }
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            name: "",
                                            value: "scaleY"
                                        },
                                        classList: [ "button" ],
                                        events: {
                                            click: "scaleY"
                                        }
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "green-box", this.sx ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "scaleX"
                                        },
                                        classList: [ "green-txt", "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "red-box", this.sy ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "scaleY"
                                        },
                                        classList: [ "red-text", "txt" ]
                                    } ]
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/style/transform/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/style/transform/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/style/transform/index.ux?uxType=page");
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