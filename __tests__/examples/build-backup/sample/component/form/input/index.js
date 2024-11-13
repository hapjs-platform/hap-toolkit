/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/form/input/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$("@app-module/system.prompt"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            private: {
                                componentName: "input",
                                inputValue: "",
                                inputType: "text"
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Input"
                                });
                            },
                            changeInputType() {
                                if (this.inputType === "text") {
                                    this.inputType = "password";
                                } else {
                                    this.inputType = "text";
                                }
                            },
                            updateValue(e) {
                                this.inputValue = e.text;
                            },
                            setValue() {
                                this.inputValue = "Hello, world!";
                            },
                            resetValue() {
                                this.inputValue = "";
                            },
                            showChangePrompt(e) {
                                _system.default.showToast({
                                    message: (e.name === undefined ? "" : "---name: " + e.name) + (e.value === undefined ? "" : "---value: " + e.value) + (e.checked === undefined ? "" : "---checked: " + e.checked) + (e.text === undefined ? "" : "---text: " + e.text)
                                });
                            },
                            showClickPrompt(msg) {
                                _system.default.showToast({
                                    message: msg
                                });
                            },
                            selectAll() {
                                this.$element("input").select();
                            },
                            selectPart() {
                                this.$element("input").setSelectionRange({
                                    start: 0,
                                    end: 3
                                });
                            },
                            getSelect() {
                                this.$element("input").getSelectionRange({
                                    callback: function(start, end) {
                                        _system.default.showToast({
                                            message: "当前选中区域为：" + start + "~" + end
                                        });
                                    }
                                });
                            },
                            onSelectionChange() {
                                this.$element("input").getSelectionRange({
                                    callback: function(start, end) {
                                        if (end - start > 3) {
                                            _system.default.showToast({
                                                message: "当前选中文本字符数大于3个"
                                            });
                                        }
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/form/input/index.ux?uxType=page": module => {
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
                        ".input-item": {
                            marginBottom: "80px",
                            flexDirection: "column"
                        },
                        ".input-hint": {
                            marginLeft: "30px",
                            marginBottom: "30px",
                            marginRight: "30px"
                        },
                        ".doc-row": {
                            justifyContent: "center",
                            marginLeft: "30px",
                            marginRight: "30px"
                        },
                        ".flex-grow": {
                            flexGrow: 1
                        },
                        ".input-text": {
                            height: "80px",
                            lineHeight: "80px",
                            paddingLeft: "30px",
                            paddingRight: "30px",
                            marginLeft: "30px",
                            marginRight: "30px",
                            borderTopWidth: "1px",
                            borderBottomWidth: "1px",
                            borderTopColor: "#999999",
                            borderRightColor: "#999999",
                            borderBottomColor: "#999999",
                            borderLeftColor: "#999999",
                            fontSize: "30px",
                            backgroundColor: "#ffffff",
                            "borderTopColor:focus": "#f76160",
                            "borderRightColor:focus": "#f76160",
                            "borderBottomColor:focus": "#f76160",
                            "borderLeftColor:focus": "#f76160"
                        },
                        ".input-button": {
                            flex: 1,
                            paddingTop: "10px",
                            paddingRight: "30px",
                            paddingBottom: "10px",
                            paddingLeft: "30px",
                            marginLeft: "30px",
                            fontSize: "30px",
                            color: "#ffffff"
                        },
                        ".input-button-first": {
                            marginLeft: "0px"
                        },
                        ".color-1": {
                            backgroundColor: "#09ba07",
                            "backgroundColor:active": "#098807"
                        },
                        ".color-2": {
                            backgroundColor: "#f76160",
                            "backgroundColor:active": "#c55756"
                        },
                        ".color-3": {
                            backgroundColor: "#0faeff",
                            "backgroundColor:active": "#0f7dcd"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/form/input/index.ux?uxType=page&": module => {
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
                            classList: [ "input-item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: 'input type="text"'
                                },
                                classList: [ "input-hint" ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "text",
                                    placeholder: "请输入text"
                                },
                                classList: [ "input-text" ],
                                events: {
                                    change: "showChangePrompt"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "input-item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: 'input type="email"'
                                },
                                classList: [ "input-hint" ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "email",
                                    placeholder: "请输入email"
                                },
                                classList: [ "input-text" ],
                                events: {
                                    change: "showChangePrompt"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "input-item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: 'input type="date"'
                                },
                                classList: [ "input-hint" ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "date",
                                    placeholder: "请输入date"
                                },
                                classList: [ "input-text" ],
                                events: {
                                    change: "showChangePrompt"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "input-item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: 'input type="time"'
                                },
                                classList: [ "input-hint" ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "time",
                                    placeholder: "请输入time"
                                },
                                classList: [ "input-text" ],
                                events: {
                                    change: "showChangePrompt"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "input-item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: 'input type="number"'
                                },
                                classList: [ "input-hint" ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "number",
                                    placeholder: "请输入number"
                                },
                                classList: [ "input-text" ],
                                events: {
                                    change: "showChangePrompt"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "input-item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: 'input type="password"'
                                },
                                classList: [ "input-hint" ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "password",
                                    placeholder: "请输入password"
                                },
                                classList: [ "input-text" ],
                                events: {
                                    change: "showChangePrompt"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "input-item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "设置 maxlength 为5"
                                },
                                classList: [ "input-hint" ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "text",
                                    placeholder: "只能输入5个字符",
                                    maxlength: "5"
                                },
                                classList: [ "input-text" ],
                                events: {
                                    change: "showChangePrompt"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "input-item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "示范input的相关select方法 (textarea也有同类方法)"
                                },
                                classList: [ "input-hint" ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "text",
                                    value: "这里有一段文字",
                                    id: "input"
                                },
                                classList: [ "input-text" ],
                                id: "input",
                                style: {
                                    marginBottom: "20px"
                                },
                                events: {
                                    selectionchange: "onSelectionChange"
                                }
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "doc-row" ],
                                children: [ {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "选中全部"
                                    },
                                    classList: [ "input-button", "input-button-first", "color-1" ],
                                    events: {
                                        click: "selectAll"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "选中部分"
                                    },
                                    classList: [ "input-button", "color-2" ],
                                    events: {
                                        click: "selectPart"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "获取选中区域"
                                    },
                                    classList: [ "input-button", "color-3" ],
                                    events: {
                                        click: "getSelect"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "input-item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: 'input type="radio":'
                                },
                                classList: [ "input-hint" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "doc-row" ],
                                children: [ {
                                    type: "label",
                                    attr: {
                                        target: "radio1",
                                        value: "label1:"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        id: "radio1",
                                        type: "radio",
                                        name: "radio",
                                        value: "radio1"
                                    },
                                    id: "radio1",
                                    classList: [ "flex-grow" ],
                                    events: {
                                        change: "showChangePrompt"
                                    }
                                }, {
                                    type: "label",
                                    attr: {
                                        target: "radio2",
                                        value: "label2:"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        id: "radio2",
                                        type: "radio",
                                        name: "radio",
                                        value: "radio2",
                                        checked: "true"
                                    },
                                    id: "radio2",
                                    classList: [ "flex-grow" ],
                                    events: {
                                        change: "showChangePrompt"
                                    }
                                }, {
                                    type: "label",
                                    attr: {
                                        target: "radio3",
                                        value: "label3:"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        id: "radio3",
                                        type: "radio",
                                        name: "radio",
                                        value: "radio3"
                                    },
                                    id: "radio3",
                                    classList: [ "flex-grow" ],
                                    events: {
                                        change: "showChangePrompt"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "input-item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: 'input type="checkbox":'
                                },
                                classList: [ "input-hint" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "doc-row" ],
                                children: [ {
                                    type: "label",
                                    attr: {
                                        target: "checkbox1",
                                        value: "label1:"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        id: "checkbox1",
                                        type: "checkbox",
                                        name: "checkbox",
                                        value: "checkbox1"
                                    },
                                    id: "checkbox1",
                                    classList: [ "flex-grow" ],
                                    events: {
                                        change: "showChangePrompt"
                                    }
                                }, {
                                    type: "label",
                                    attr: {
                                        target: "checkbox2",
                                        value: "label2:"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        id: "checkbox2",
                                        type: "checkbox",
                                        name: "checkbox",
                                        value: "checkbox2",
                                        checked: "true"
                                    },
                                    id: "checkbox2",
                                    classList: [ "flex-grow" ],
                                    events: {
                                        change: "showChangePrompt"
                                    }
                                }, {
                                    type: "label",
                                    attr: {
                                        target: "checkbox3",
                                        value: "label3:"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        id: "checkbox3",
                                        type: "checkbox",
                                        name: "checkbox",
                                        value: "checkbox3"
                                    },
                                    id: "checkbox3",
                                    classList: [ "flex-grow" ],
                                    events: {
                                        change: "showChangePrompt"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "input-item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: 'input type="button"'
                                },
                                classList: [ "input-hint" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "doc-row" ],
                                children: [ {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "确认"
                                    },
                                    classList: [ "input-button", "input-button-first", "color-1" ],
                                    events: {
                                        click: function(evt) {
                                            return this.showClickPrompt("确认", evt);
                                        }
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "取消"
                                    },
                                    classList: [ "input-button", "color-2" ],
                                    events: {
                                        click: function(evt) {
                                            return this.showClickPrompt("取消", evt);
                                        }
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "提交"
                                    },
                                    classList: [ "input-button", "color-3" ],
                                    events: {
                                        click: function(evt) {
                                            return this.showClickPrompt("提交", evt);
                                        }
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "input-item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "设置或清空输入框的值："
                                },
                                classList: [ "input-hint" ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "text",
                                    placeholder: "必须在change事件中同步value才能改变value",
                                    value: function() {
                                        return this.inputValue;
                                    }
                                },
                                classList: [ "input-text" ],
                                events: {
                                    change: "updateValue"
                                }
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "doc-row" ],
                                style: {
                                    marginTop: "30px"
                                },
                                children: [ {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "设置value值"
                                    },
                                    classList: [ "input-button", "input-button-first", "color-3" ],
                                    events: {
                                        click: "setValue"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "清空value值"
                                    },
                                    classList: [ "input-button", "color-3" ],
                                    events: {
                                        click: "resetValue"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "input-item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "控制占位符颜色的input:"
                                },
                                classList: [ "input-hint" ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "text",
                                    placeholder: "占位符字体是红色的"
                                },
                                classList: [ "input-text" ],
                                style: {
                                    placeholderColor: "#FF0000"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "input-item" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "点击改变InputType按钮，可将下面输入框的InputType切换为password形式"
                                },
                                classList: [ "input-hint" ]
                            }, {
                                type: "input",
                                attr: {
                                    type: function() {
                                        return this.inputType;
                                    },
                                    value: "123456"
                                },
                                classList: [ "input-text" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "doc-row" ],
                                style: {
                                    marginTop: "30px"
                                },
                                children: [ {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "改变InputType"
                                    },
                                    classList: [ "input-button", "color-1" ],
                                    events: {
                                        click: "changeInputType"
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/form/input/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/form/input/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/form/input/index.ux?uxType=page");
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