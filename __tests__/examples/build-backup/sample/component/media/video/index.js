/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/media/video/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$("@app-module/system.prompt"));
                        var _system2 = _interopRequireDefault($app_require$("@app-module/system.network"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            private: {
                                componentName: "video",
                                showmask: true,
                                showicon: true,
                                ignorenet: false,
                                showControls: true,
                                muted: false
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Video"
                                });
                            },
                            startVideo(e) {
                                if (e.usenet) {
                                    this.ignorenet = true;
                                }
                                this.networkstatus("video");
                            },
                            networkstatus() {
                                _system2.default.subscribe({
                                    callback: function(data) {
                                        if (data.type === "wifi" || this.ignorenet) {
                                            this.$element("video").start();
                                            this.showmask = false;
                                        } else {
                                            this.showmask = true;
                                            this.$element("video").pause();
                                            this.showicon = false;
                                        }
                                    }.bind(this)
                                });
                            },
                            switchShowControls(e) {
                                this.showControls = e.checked;
                            },
                            onMutedSwitched(e) {
                                this.muted = e.checked;
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/media/video/index.ux?uxType=page": module => {
                    module.exports = {
                        ".doc-page": {
                            flex: 1,
                            flexDirection: "column",
                            backgroundColor: "#fbf9fe"
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
                        ".video": {
                            height: "400px"
                        },
                        ".mask": {
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.1)"
                        },
                        ".start-icon": {
                            height: "100px",
                            width: "100px",
                            resizeMode: "cover"
                        },
                        ".tip .continue": {
                            paddingTop: "15px",
                            paddingRight: "30px",
                            paddingBottom: "15px",
                            paddingLeft: "30px",
                            borderTopWidth: "1px",
                            borderRightWidth: "1px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "1px",
                            borderStyle: "solid",
                            borderTopColor: "#ffffff",
                            borderRightColor: "#ffffff",
                            borderBottomColor: "#ffffff",
                            borderLeftColor: "#ffffff",
                            marginTop: "30px",
                            marginBottom: "10px",
                            color: "#ffffff",
                            borderRadius: "30px",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "tip"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "continue"
                                } ]
                            }
                        },
                        ".item-container": {
                            marginTop: "20px"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/media/video/index.ux?uxType=page&": module => {
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
                            classList: [ "video", "justify-content-center" ],
                            children: [ {
                                type: "stack",
                                attr: {},
                                classList: [ "flex-column" ],
                                children: [ {
                                    type: "video",
                                    attr: {
                                        poster: "https://www.quickapp.cn/assets/images/home/video.png",
                                        autoplay: "false",
                                        id: "video",
                                        src: "https://statres.quickapp.cn/quickapp/course/1.mp4",
                                        controls: function() {
                                            return this.showControls;
                                        },
                                        muted: function() {
                                            return this.muted;
                                        }
                                    },
                                    classList: [ "flex-1" ],
                                    events: {
                                        prepared: "preparedfn",
                                        start: "startfn",
                                        pause: "pausefn",
                                        finish: "finishfn",
                                        error: "errorfn",
                                        seeking: "seekingfn",
                                        seeked: "seekedfn",
                                        timeupdate: "timeupdatefn"
                                    },
                                    id: "video"
                                }, {
                                    type: "image",
                                    attr: {
                                        show: function() {
                                            return this.showmask;
                                        },
                                        src: "https://www.quickapp.cn/assets/images/home/video.png"
                                    }
                                }, {
                                    type: "div",
                                    attr: {
                                        show: function() {
                                            return this.showmask;
                                        }
                                    },
                                    classList: [ "mask", "align-item-center", "justify-content-center", "flex-column" ],
                                    children: [ {
                                        type: "image",
                                        attr: {
                                            show: function() {
                                                return this.showicon;
                                            },
                                            src: "/component/media/video/start.png"
                                        },
                                        classList: [ "start-icon" ],
                                        events: {
                                            click: "startVideo"
                                        }
                                    }, {
                                        type: "div",
                                        attr: {
                                            show: function() {
                                                return !this.showicon;
                                            }
                                        },
                                        classList: [ "tip", "flex-column", "align-item-center" ],
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: "正在使用移动网络，可能产生额外的流量费用"
                                            },
                                            classList: [ "xui-color-1" ]
                                        }, {
                                            type: "text",
                                            attr: {
                                                value: "继续"
                                            },
                                            classList: [ "continue" ],
                                            events: {
                                                click: function(evt) {
                                                    return this.startVideo({
                                                        usenet: true
                                                    }, evt);
                                                }
                                            }
                                        } ]
                                    } ]
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            style: {
                                flexDirection: "column"
                            },
                            children: [ {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "是否显示播放控件"
                                    },
                                    classList: [ "item-content_title" ]
                                }, {
                                    type: "switch",
                                    attr: {
                                        checked: "true"
                                    },
                                    classList: [ "switch" ],
                                    events: {
                                        change: "switchShowControls"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "是否静音"
                                    },
                                    classList: [ "item-content_title" ]
                                }, {
                                    type: "switch",
                                    attr: {
                                        checked: "false"
                                    },
                                    classList: [ "switch" ],
                                    style: {
                                        marginLeft: "120px"
                                    },
                                    events: {
                                        change: "onMutedSwitched"
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/media/video/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/media/video/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/media/video/index.ux?uxType=page");
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