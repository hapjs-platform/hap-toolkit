/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/home/index.ux?uxType=page": (module, __unused_webpack_exports, __webpack_require__) => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$("@app-module/system.router"));
                        var _data = __webpack_require__("./src/home/data.js");
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            private: {
                                dataMap: _data.tabsData,
                                tabItemList: [],
                                selectedIdxMap: {}
                            },
                            onInit() {
                                this.tabItemList = [].concat(Object.keys(this.dataMap));
                                this.tabItemList.forEach((tabItem => {
                                    this.$set(`selectedIdxMap.${tabItem}`, -1);
                                }));
                            },
                            selectConFn(tabItem, index) {
                                this.selectedIdxMap[tabItem] = this.selectedIdxMap[tabItem] === index ? -1 : index;
                            },
                            routePath(path, params) {
                                _system.default.push({
                                    uri: path,
                                    params
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/home/index.ux?uxType=page": module => {
                    module.exports = {
                        ".doc-page": {
                            backgroundColor: "#fbf9fe",
                            flex: 1,
                            flexDirection: "column"
                        },
                        ".footer-container": {
                            height: "120px",
                            borderTopWidth: "1px",
                            borderTopColor: "#bbbbbb",
                            borderRightColor: "#bbbbbb",
                            borderBottomColor: "#bbbbbb",
                            borderLeftColor: "#bbbbbb",
                            backgroundColor: "#ffffff"
                        },
                        ".group-container": {
                            flex: 1,
                            flexDirection: "column"
                        },
                        ".group-content": {
                            flexDirection: "column",
                            flex: 1
                        },
                        ".introduce": {
                            paddingLeft: "80px",
                            paddingRight: "80px",
                            marginBottom: "80px",
                            marginTop: "60px"
                        },
                        ".introduce-detail": {
                            textAlign: "center",
                            flex: 1,
                            lines: 3,
                            lineHeight: "50px",
                            color: "#888888"
                        },
                        ".item-container": {
                            marginLeft: "30px",
                            marginRight: "30px",
                            backgroundColor: "#ffffff",
                            flexDirection: "column",
                            marginBottom: "30px"
                        },
                        ".item-title-detail": {
                            paddingTop: "40px",
                            paddingRight: "40px",
                            paddingBottom: "40px",
                            paddingLeft: "40px",
                            flex: 1,
                            color: "#000000",
                            "backgroundColor:active": "#dfdfdf"
                        },
                        ".item-content": {
                            flexDirection: "column",
                            paddingTop: "30px",
                            paddingRight: "30px",
                            paddingBottom: "30px",
                            paddingLeft: "30px",
                            display: "none"
                        },
                        ".item-li": {
                            borderTopColor: "#bbbbbb",
                            borderRightColor: "#bbbbbb",
                            borderBottomColor: "#bbbbbb",
                            borderLeftColor: "#bbbbbb",
                            borderBottomWidth: "1px",
                            alignItems: "center",
                            "backgroundColor:active": "#dfdfdf"
                        },
                        ".item_arrow_img": {
                            height: "40px",
                            width: "20px",
                            marginRight: "30px",
                            resizeMode: "contain"
                        },
                        ".item-li-detail": {
                            paddingTop: "25px",
                            paddingBottom: "25px",
                            color: "#000000",
                            flex: 1
                        },
                        ".tab-text": {
                            textAlign: "center",
                            "color:active": "#0faeff"
                        },
                        ".selected-group": {
                            display: "flex"
                        },
                        ".selected-text": {
                            color: "#cccccc"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/home/index.ux?uxType=page&": module => {
                    module.exports = {
                        type: "div",
                        attr: {},
                        classList: [ "doc-page" ],
                        children: [ {
                            type: "tabs",
                            attr: {},
                            children: [ {
                                type: "tab-content",
                                attr: {},
                                classList: [ "group-container" ],
                                children: [ {
                                    type: "div",
                                    attr: {},
                                    classList: [ "group-content" ],
                                    repeat: {
                                        exp: function() {
                                            return this.tabItemList;
                                        },
                                        value: "tabItem"
                                    },
                                    children: [ {
                                        type: "div",
                                        attr: {},
                                        classList: [ "introduce" ],
                                        children: [ {
                                            type: "text",
                                            attr: {
                                                value: function() {
                                                    return this.dataMap[this.tabItem].desc;
                                                }
                                            },
                                            classList: [ "introduce-detail" ]
                                        } ]
                                    }, {
                                        type: "div",
                                        attr: {},
                                        classList: [ "item-container" ],
                                        repeat: {
                                            exp: function() {
                                                return this.dataMap[this.tabItem].groupList;
                                            },
                                            key: "index",
                                            value: "group"
                                        },
                                        children: [ {
                                            type: "div",
                                            attr: {},
                                            classList: [ "item-title" ],
                                            children: [ {
                                                type: "text",
                                                attr: {
                                                    value: function() {
                                                        return this.group.name;
                                                    }
                                                },
                                                classList: function() {
                                                    return [ "item-title-detail", this.selectedIdxMap[this.tabItem] === this.index ? "selected-text" : "" ];
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return this.selectConFn(this.tabItem, this.index, evt);
                                                    }
                                                }
                                            } ]
                                        }, {
                                            type: "div",
                                            attr: {},
                                            classList: function() {
                                                return [ "item-content", this.selectedIdxMap[this.tabItem] === this.index ? "selected-group" : "" ];
                                            },
                                            children: [ {
                                                type: "block",
                                                attr: {},
                                                repeat: {
                                                    exp: function() {
                                                        return this.group.caseList;
                                                    },
                                                    value: "case"
                                                },
                                                children: [ {
                                                    type: "div",
                                                    attr: {},
                                                    classList: [ "item-li" ],
                                                    events: {
                                                        click: function(evt) {
                                                            return this.routePath(this.case.path, {}, evt);
                                                        }
                                                    },
                                                    children: [ {
                                                        type: "text",
                                                        attr: {
                                                            value: function() {
                                                                return this.case.name;
                                                            }
                                                        },
                                                        classList: [ "item-li-detail" ]
                                                    }, {
                                                        type: "image",
                                                        attr: {
                                                            src: "/home/arrow-right.png"
                                                        },
                                                        classList: [ "item_arrow_img" ]
                                                    } ]
                                                } ]
                                            } ]
                                        } ]
                                    } ]
                                } ]
                            }, {
                                type: "tab-bar",
                                attr: {},
                                classList: [ "footer-container" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return this.dataMap[this.$item].name;
                                        }
                                    },
                                    classList: [ "tab-text" ],
                                    repeat: function() {
                                        return this.tabItemList;
                                    }
                                } ]
                            } ]
                        } ]
                    };
                },
                "./src/home/data.js": (__unused_webpack_module, exports) => {
                    "use strict";
                    Object.defineProperty(exports, "__esModule", {
                        value: true
                    });
                    exports.tabsData = void 0;
                    const tabsData = {
                        framework: {
                            name: "框架",
                            desc: "以下将展示快应用框架能力，具体属性参数详见快应用开发文档",
                            groupList: [ {
                                name: "基础",
                                caseList: [ {
                                    name: "页面生命周期",
                                    path: "framework/lifecycle"
                                }, {
                                    name: "唤起应用(deepLink)",
                                    path: "framework/deeplink"
                                }, {
                                    name: "退出应用/页面",
                                    path: "framework/exit"
                                } ]
                            } ]
                        },
                        component: {
                            name: "组件",
                            desc: "以下将展示快应用组件能力，组件样式仅供参考，开发者可根据自身需求自定义组件样式，具体属性参数详见快应用开发文档",
                            groupList: [ {
                                name: "容器组件",
                                caseList: [ {
                                    name: "div",
                                    path: "component/container/div"
                                }, {
                                    name: "list",
                                    path: "component/container/list"
                                }, {
                                    name: "popup",
                                    path: "component/container/popup"
                                }, {
                                    name: "refresh",
                                    path: "component/container/refresh"
                                }, {
                                    name: "richtext",
                                    path: "component/container/richtext"
                                }, {
                                    name: "stack",
                                    path: "component/container/stack"
                                }, {
                                    name: "swiper",
                                    path: "component/container/swiper"
                                }, {
                                    name: "tabs",
                                    path: "component/container/tabs"
                                } ]
                            }, {
                                name: "基础组件",
                                caseList: [ {
                                    name: "a",
                                    path: "component/basic/a"
                                }, {
                                    name: "image",
                                    path: "component/basic/image"
                                }, {
                                    name: "progress",
                                    path: "component/basic/progress"
                                }, {
                                    name: "rating",
                                    path: "component/basic/rating"
                                }, {
                                    name: "span",
                                    path: "component/basic/span"
                                }, {
                                    name: "text",
                                    path: "component/basic/text"
                                } ]
                            }, {
                                name: "表单组件",
                                caseList: [ {
                                    name: "input",
                                    path: "component/form/input"
                                }, {
                                    name: "label",
                                    path: "component/form/label"
                                }, {
                                    name: "picker",
                                    path: "component/form/picker"
                                }, {
                                    name: "multi picker",
                                    path: "component/form/multi-picker"
                                }, {
                                    name: "slider",
                                    path: "component/form/slider"
                                }, {
                                    name: "switch",
                                    path: "component/form/switch"
                                }, {
                                    name: "textarea",
                                    path: "component/form/textarea"
                                } ]
                            }, {
                                name: "媒体组件",
                                caseList: [ {
                                    name: "canvas",
                                    path: "component/media/canvas"
                                }, {
                                    name: "video",
                                    path: "component/media/video"
                                }, {
                                    name: "audio",
                                    path: "component/media/audio"
                                }, {
                                    name: "web",
                                    path: "component/media/web"
                                } ]
                            }, {
                                name: "第三方组件",
                                caseList: [ {
                                    name: "map",
                                    path: "component/thirdParty/map"
                                } ]
                            }, {
                                name: "样式动画",
                                caseList: [ {
                                    name: "animation",
                                    path: "component/style/animation"
                                }, {
                                    name: "transform",
                                    path: "component/style/transform"
                                }, {
                                    name: "translate 百分比的动画",
                                    path: "component/style/translatepercent"
                                }, {
                                    name: "background-position 单独测试",
                                    path: "component/style/backgroundposition"
                                }, {
                                    name: "background-image 支持.9.png",
                                    path: "component/style/background9image"
                                }, {
                                    name: "font字体设置",
                                    path: "component/style/font-family"
                                } ]
                            }, {
                                name: "功能示例",
                                caseList: [ {
                                    name: "style数据绑定",
                                    path: "functionality/changestyle"
                                }, {
                                    name: "动画animation api",
                                    path: "functionality/animationapi"
                                }, {
                                    name: "表单",
                                    path: "functionality/form"
                                }, {
                                    name: "手机验证码",
                                    path: "functionality/verification"
                                }, {
                                    name: "顶部菜单",
                                    path: "functionality/menutop"
                                }, {
                                    name: "图片展示",
                                    path: "functionality/photo"
                                }, {
                                    name: "支持h5页面下载网络资源",
                                    path: "functionality/h5download"
                                }, {
                                    name: "web页面通信",
                                    path: "functionality/postMessage"
                                }, {
                                    name: "生成二维码",
                                    path: "functionality/qrcode"
                                }, {
                                    name: "自定义titlebar",
                                    path: "functionality/titlebar"
                                }, {
                                    name: "list联动",
                                    path: "functionality/listcombination"
                                }, {
                                    name: "监听手势方向",
                                    path: "functionality/simulate-swipe"
                                }, {
                                    name: "吸顶效果",
                                    path: "functionality/ceiling"
                                }, {
                                    name: "电商模板",
                                    path: "functionality/template/elec-business"
                                }, {
                                    name: "自定义web页面",
                                    path: "functionality/customWeb"
                                } ]
                            } ]
                        },
                        interface: {
                            name: "接口",
                            desc: "以下将展示快应用接口能力，具体属性参数详见快应用开发文档",
                            groupList: [ {
                                name: "基本功能",
                                caseList: [ {
                                    name: "页面路由",
                                    path: "interface/system/router"
                                }, {
                                    name: "应用上下文",
                                    path: "interface/system/app"
                                }, {
                                    name: "应用管理",
                                    path: "interface/system/package"
                                }, {
                                    name: "禁止修改接口",
                                    path: "interface/system/forbid"
                                } ]
                            }, {
                                name: "界面交互",
                                caseList: [ {
                                    name: "分享",
                                    path: "interface/system/share"
                                }, {
                                    name: "弹窗",
                                    path: "interface/system/prompt"
                                }, {
                                    name: "打开网页",
                                    path: "interface/system/webview"
                                }, {
                                    name: "通知消息",
                                    path: "interface/system/notification"
                                }, {
                                    name: "震动",
                                    path: "interface/system/vibrator"
                                } ]
                            }, {
                                name: "网络访问",
                                caseList: [ {
                                    name: "上传下载",
                                    path: "interface/system/request"
                                }, {
                                    name: "数据请求",
                                    path: "interface/system/fetch"
                                }, {
                                    name: "websocket",
                                    path: "interface/system/websocket"
                                } ]
                            }, {
                                name: "文件数据",
                                caseList: [ {
                                    name: "数据存储",
                                    path: "interface/system/storage"
                                }, {
                                    name: "文件存储",
                                    path: "interface/system/file"
                                }, {
                                    name: "文件读写",
                                    path: "interface/system/filerw"
                                } ]
                            }, {
                                name: "系统能力",
                                caseList: [ {
                                    name: "二维码",
                                    path: "interface/system/qrcode"
                                }, {
                                    name: "传感器",
                                    path: "interface/system/sensor"
                                }, {
                                    name: "剪贴板",
                                    path: "interface/system/clipboard"
                                }, {
                                    name: "地理位置",
                                    path: "interface/system/geolocation"
                                }, {
                                    name: "桌面图标",
                                    path: "interface/system/shortcut"
                                }, {
                                    name: "日历事件",
                                    path: "interface/system/calendar"
                                }, {
                                    name: "网络状态",
                                    path: "interface/system/network"
                                }, {
                                    name: "设备信息",
                                    path: "interface/system/device"
                                }, {
                                    name: "屏幕亮度",
                                    path: "interface/system/brightness"
                                }, {
                                    name: "电量信息",
                                    path: "interface/system/battery"
                                }, {
                                    name: "录音",
                                    path: "interface/system/record"
                                }, {
                                    name: "系统音量",
                                    path: "interface/system/volume"
                                }, {
                                    name: "发送短信",
                                    path: "interface/system/sms"
                                }, {
                                    name: "联系人",
                                    path: "interface/system/contact"
                                }, {
                                    name: "Wi-Fi",
                                    path: "interface/system/wifi"
                                } ]
                            }, {
                                name: "图形图像",
                                caseList: [ {
                                    name: "图片编辑",
                                    path: "interface/system/image"
                                }, {
                                    name: "多媒体",
                                    path: "interface/system/media"
                                } ]
                            }, {
                                name: "第三方服务",
                                caseList: [ {
                                    name: "微信支付",
                                    path: "interface/thirdparty/wxpay"
                                }, {
                                    name: "支付宝支付",
                                    path: "interface/thirdparty/alipay"
                                }, {
                                    name: "第三方分享",
                                    path: "interface/thirdparty/serviceshare"
                                }, {
                                    name: "微信账号",
                                    path: "interface/thirdparty/wxaccount"
                                }, {
                                    name: "QQ账号",
                                    path: "interface/thirdparty/qqaccount"
                                }, {
                                    name: "微博账号",
                                    path: "interface/thirdparty/wbaccount"
                                } ]
                            } ]
                        }
                    };
                    exports.tabsData = tabsData;
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/home/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/home/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/home/index.ux?uxType=page");
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