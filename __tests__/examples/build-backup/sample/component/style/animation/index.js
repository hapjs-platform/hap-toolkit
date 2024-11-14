/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/style/animation/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _default = {
                            private: {
                                componentName: "animation",
                                color: "",
                                opacity: "",
                                height: "",
                                width: "",
                                delay: "",
                                oneSec: "",
                                fiveSec: "",
                                tenSec: "",
                                oneCount: "",
                                twoCount: "",
                                threeCount: "",
                                linear: "",
                                ease: "",
                                easeIn: "",
                                easeOut: "",
                                easeInOut: "",
                                forwards: "",
                                none: "",
                                translateX: "",
                                translateY: "",
                                scaleX: "",
                                scaleY: "",
                                rotate: "",
                                rotateX: "",
                                rotateY: ""
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Animation"
                                });
                            },
                            show01() {
                                this.color = "";
                                this.opacity = "";
                                this.height = "";
                                this.width = "";
                                this.color = "color";
                                this.opacity = "opacity";
                                this.height = "height";
                                this.width = "width";
                            },
                            show02() {
                                this.delay = "";
                                this.delay = "delay";
                            },
                            show03() {
                                this.oneSec = "";
                                this.fiveSec = "";
                                this.tenSec = "";
                                this.oneSec = "oneSec";
                                this.fiveSec = "fiveSec";
                                this.tenSec = "tenSec";
                            },
                            show04() {
                                this.oneCount = "";
                                this.twoCount = "";
                                this.threeCount = "";
                                this.oneCount = "oneCount";
                                this.twoCount = "twoCount";
                                this.threeCount = "threeCount";
                            },
                            show05() {
                                this.linear = "";
                                this.ease = "";
                                this.easeIn = "";
                                this.easeOut = "";
                                this.easeInOut = "";
                                this.linear = "linear";
                                this.ease = "ease";
                                this.easeIn = "easeIn";
                                this.easeOut = "easeOut";
                                this.easeInOut = "easeInOut";
                            },
                            show06() {
                                this.forwards = "";
                                this.none = "";
                                this.forwards = "forwards";
                                this.none = "none";
                            },
                            show07() {
                                this.translateX = "";
                                this.translateY = "";
                                this.scaleX = "";
                                this.scaleY = "";
                                this.rotate = "";
                                this.rotateX = "";
                                this.rotateY = "";
                                this.translateX = "translateX";
                                this.translateY = "translateY";
                                this.scaleX = "scaleX";
                                this.scaleY = "scaleY";
                                this.rotate = "rotate";
                                this.rotateX = "rotateX";
                                this.rotateY = "rotateY";
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/style/animation/index.ux?uxType=page": module => {
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
                            alignItems: "flex-start"
                        },
                        ".group": {
                            marginBottom: "150px",
                            flexDirection: "column",
                            alignItems: "flex-start"
                        },
                        ".header": {
                            marginBottom: "20px"
                        },
                        ".item": {
                            backgroundColor: "#f76160"
                        },
                        ".txt": {
                            textAlign: "center",
                            width: "200px",
                            height: "100px"
                        },
                        ".button": {
                            width: "200px",
                            fontSize: "30px",
                            color: "#ffffff",
                            backgroundColor: "#09ba07"
                        },
                        ".color": {
                            animationName: "Color",
                            animationDuration: "8000ms"
                        },
                        ".opacity": {
                            animationName: "Opacity",
                            animationDuration: "8000ms"
                        },
                        ".height": {
                            animationName: "Height",
                            animationDuration: "8000ms"
                        },
                        ".width": {
                            animationName: "Width",
                            animationDuration: "1000ms"
                        },
                        ".delay": {
                            animationName: "Go",
                            animationDuration: "5000ms",
                            animationDelay: "3000ms"
                        },
                        ".oneSec": {
                            animationName: "Go",
                            animationDuration: "1000ms"
                        },
                        ".fiveSec": {
                            animationName: "Go",
                            animationDuration: "5000ms"
                        },
                        ".tenSec": {
                            animationName: "Go",
                            animationDuration: "10000ms"
                        },
                        ".oneCount": {
                            animationName: "Go",
                            animationDuration: "3000ms",
                            animationIterationCount: 1
                        },
                        ".twoCount": {
                            animationName: "Go",
                            animationDuration: "3000ms",
                            animationIterationCount: 2
                        },
                        ".threeCount": {
                            animationName: "Go",
                            animationDuration: "3000ms",
                            animationIterationCount: 3
                        },
                        ".linear": {
                            animationName: "Go",
                            animationDuration: "3000ms",
                            animationTimingFunction: "linear"
                        },
                        ".ease": {
                            animationName: "Go",
                            animationDuration: "3000ms",
                            animationTimingFunction: "ease"
                        },
                        ".easeIn": {
                            animationName: "Go",
                            animationDuration: "3000ms",
                            animationTimingFunction: "ease-in"
                        },
                        ".easeOut": {
                            animationName: "Go",
                            animationDuration: "3000ms",
                            animationTimingFunction: "ease-out"
                        },
                        ".easeInOut": {
                            animationName: "Go",
                            animationDuration: "3000ms",
                            animationTimingFunction: "ease-in-out"
                        },
                        ".forwards": {
                            animationName: "Go",
                            animationDuration: "3000ms",
                            animationFillMode: "forwards"
                        },
                        ".none": {
                            animationName: "Go",
                            animationDuration: "3000ms",
                            animationFillMode: "none"
                        },
                        ".translateX": {
                            animationName: "translateX",
                            animationDuration: "8000ms"
                        },
                        ".translateY": {
                            animationName: "translateY",
                            animationDuration: "8000ms"
                        },
                        ".scaleX": {
                            animationName: "scaleX",
                            animationDuration: "8000ms"
                        },
                        ".scaleY": {
                            animationName: "scaleY",
                            animationDuration: "8000ms"
                        },
                        ".rotate": {
                            transformOrigin: "0px 100px",
                            animationName: "rotate",
                            animationDuration: "8000ms"
                        },
                        ".rotateX": {
                            animationName: "rotateX",
                            animationDuration: "8000ms"
                        },
                        ".rotateY": {
                            animationName: "rotateY",
                            animationDuration: "8000ms"
                        },
                        "@KEYFRAMES": {
                            Go: [ {
                                backgroundColor: "#f76160",
                                time: 0
                            }, {
                                backgroundColor: "#09ba07",
                                time: 100
                            } ],
                            Color: [ {
                                backgroundColor: "#f76160",
                                time: 0
                            }, {
                                backgroundColor: "#09ba07",
                                time: 100
                            } ],
                            Opacity: [ {
                                opacity: 0.9,
                                time: 0
                            }, {
                                opacity: 0.1,
                                time: 100
                            } ],
                            Width: [ {
                                width: "100px",
                                time: 0
                            }, {
                                width: "300px",
                                time: 100
                            } ],
                            Height: [ {
                                height: "100px",
                                time: 0
                            }, {
                                height: "220px",
                                time: 100
                            } ],
                            translateX: [ {
                                transform: '{"translateX":"20px"}',
                                time: 0
                            }, {
                                transform: '{"translateX":"50px"}',
                                time: 100
                            } ],
                            translateY: [ {
                                transform: '{"translateY":"20px"}',
                                time: 0
                            }, {
                                transform: '{"translateY":"50px"}',
                                time: 100
                            } ],
                            scaleX: [ {
                                transform: '{"scaleX":0.5}',
                                time: 0
                            }, {
                                transform: '{"scaleX":2}',
                                time: 100
                            } ],
                            scaleY: [ {
                                transform: '{"scaleY":0.5}',
                                time: 0
                            }, {
                                transform: '{"scaleY":2}',
                                time: 100
                            } ],
                            rotate: [ {
                                transform: '{"rotate":"10deg"}',
                                time: 0
                            }, {
                                transform: '{"rotate":"360deg"}',
                                time: 100
                            } ],
                            rotateX: [ {
                                transform: '{"rotateX":"10deg"}',
                                time: 0
                            }, {
                                transform: '{"rotateX":"360deg"}',
                                time: 100
                            } ],
                            rotateY: [ {
                                transform: '{"rotateY":"10deg"}',
                                time: 0
                            }, {
                                transform: '{"rotateY":"360deg"}',
                                time: 100
                            } ]
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/style/animation/index.ux?uxType=page&": module => {
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
                                        value: "animation-name"
                                    },
                                    classList: [ "header" ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.color ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "color"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.opacity ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "opacity"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.height ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "height"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.width ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "width"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        name: "",
                                        value: "show"
                                    },
                                    classList: [ "button" ],
                                    events: {
                                        click: "show01"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "group" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "animation-delay"
                                    },
                                    classList: [ "header" ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.delay ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "3s"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        name: "",
                                        value: "show"
                                    },
                                    classList: [ "button" ],
                                    events: {
                                        click: "show02"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "group" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "animation-duration"
                                    },
                                    classList: [ "header" ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.oneSec ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "1s"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.fiveSec ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "5s"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.tenSec ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "10s"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        name: "",
                                        value: "show"
                                    },
                                    classList: [ "button" ],
                                    events: {
                                        click: "show03"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "group" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "animation-iteration-count"
                                    },
                                    classList: [ "header" ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.oneCount ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "1"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.twoCount ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "2"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.threeCount ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "3"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        name: "",
                                        value: "show"
                                    },
                                    classList: [ "button" ],
                                    events: {
                                        click: "show04"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "group" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "animation-timing-function"
                                    },
                                    classList: [ "header" ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.linear ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "linear"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.ease ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "ease"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.easeIn ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "ease-in"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.easeOut ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "ease-out"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.easeInOut ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "ease-in-out"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        name: "",
                                        value: "show"
                                    },
                                    classList: [ "button" ],
                                    events: {
                                        click: "show05"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "group" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "animation-fill-mode"
                                    },
                                    classList: [ "header" ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.forwards ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "forwards"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.none ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "none"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        name: "",
                                        value: "show"
                                    },
                                    classList: [ "button" ],
                                    events: {
                                        click: "show06"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "group" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "transform in animation"
                                    },
                                    classList: [ "header" ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.translateX ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "translateX"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.translateY ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "translateY"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.scaleX ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "scaleX"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.scaleY ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "scaleY"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.rotate ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "rotate"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.rotateX ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "rotateX"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: function() {
                                        return [ "item", this.rotateY ];
                                    },
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "rotateY"
                                        },
                                        classList: [ "txt" ]
                                    } ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        name: "",
                                        value: "show"
                                    },
                                    classList: [ "button" ],
                                    events: {
                                        click: "show07"
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/style/animation/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/style/animation/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/style/animation/index.ux?uxType=page");
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