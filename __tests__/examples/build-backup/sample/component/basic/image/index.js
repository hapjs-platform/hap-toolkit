/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/basic/image/index.ux?uxType=page": module => {
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
                                componentName: "image",
                                remoteURL: "http://www.w3school.com.cn/svg/",
                                inputImageURL: "http://www.w3school.com.cn/svg/rect1.svg",
                                requestImageURL: ""
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Image"
                                });
                            },
                            onImageUrlChange(data) {
                                this.inputImageURL = data.value;
                            },
                            onImageGetClick() {
                                this.requestImageURL = this.inputImageURL;
                                _system.default.showToast({
                                    message: "加载" + this.requestImageURL + "图片"
                                });
                            },
                            onImageComplete(data) {
                                _system.default.showToast({
                                    message: "图片获取成功\n" + "高度：" + data.height + "px  " + "宽度：" + data.width + "px"
                                });
                            },
                            onImageError() {
                                _system.default.showToast({
                                    message: "图片获取失败"
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/basic/image/index.ux?uxType=page": module => {
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
                        ".img-layout-header": {
                            paddingTop: "20px",
                            paddingRight: "20px",
                            paddingBottom: "20px",
                            paddingLeft: "20px",
                            borderBottomWidth: "1px",
                            borderBottomColor: "#808080"
                        },
                        ".item-container": {
                            marginTop: "40px",
                            marginBottom: "40px",
                            flexDirection: "column"
                        },
                        ".item-title": {
                            paddingLeft: "30px",
                            paddingBottom: "20px",
                            color: "#aaaaaa"
                        },
                        ".item-content": {
                            height: "200px",
                            justifyContent: "center"
                        },
                        ".image": {
                            width: "240px",
                            height: "160px",
                            resizeMode: "contain"
                        },
                        ".item-content-with-height": {
                            height: "250px",
                            justifyContent: "center",
                            alignItems: "center"
                        },
                        ".item-content-without-height": {
                            justifyContent: "center",
                            alignItems: "center"
                        },
                        ".fixed-size-wh": {
                            width: "750px",
                            height: "250px"
                        },
                        ".fixed-size-wh2": {
                            width: "250px",
                            height: "750px"
                        },
                        ".fixed-size-h": {
                            height: "160px"
                        },
                        ".circle": {
                            borderRadius: "80px"
                        },
                        ".input-button": {
                            flex: 1,
                            paddingTop: "10px",
                            paddingRight: "30px",
                            paddingBottom: "10px",
                            paddingLeft: "30px",
                            marginTop: "0px",
                            marginRight: "30px",
                            marginBottom: "0px",
                            marginLeft: "30px",
                            fontSize: "30px",
                            color: "#ffffff",
                            backgroundColor: "#0faeff"
                        },
                        ".input-text": {
                            height: "80px",
                            lineHeight: "80px",
                            paddingTop: "0px",
                            paddingRight: "30px",
                            paddingBottom: "0px",
                            paddingLeft: "30px",
                            marginTop: "30px",
                            marginRight: "30px",
                            marginBottom: "30px",
                            marginLeft: "30px",
                            borderTopWidth: "1px",
                            borderBottomWidth: "1px",
                            borderTopColor: "#999999",
                            borderRightColor: "#999999",
                            borderBottomColor: "#999999",
                            borderLeftColor: "#999999",
                            fontSize: "30px",
                            backgroundColor: "#ffffff"
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/basic/image/index.ux?uxType=page&": module => {
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
                                type: "text",
                                attr: {
                                    value: "Local image:./img/pic-240x160.webp"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x160.webp"
                                    },
                                    classList: [ "image" ],
                                    style: {
                                        resizeMode: "cover"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "img-layout-header" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "细长型：指定图片的style宽度高度：750px,250px"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: cover(默认值)"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x160.webp"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "cover"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: contain"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x160.webp"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: stretch"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x160.webp"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "stretch"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: center"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x160.webp"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "center"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: center"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x160.webp"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        width: "50px",
                                        height: "50px",
                                        resizeMode: "center"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "img-layout-header" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "细长型：仅指定图片的style高度：250px"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: cover(默认值)"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x160.webp"
                                    },
                                    classList: [ "fixed-size-h" ],
                                    style: {
                                        resizeMode: "cover"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: contain"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x160.webp"
                                    },
                                    classList: [ "fixed-size-h" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: stretch"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x160.webp"
                                    },
                                    classList: [ "fixed-size-h" ],
                                    style: {
                                        resizeMode: "stretch"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: center"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x160.webp"
                                    },
                                    classList: [ "fixed-size-h" ],
                                    style: {
                                        resizeMode: "center"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "img-layout-header" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "胖矮型：指定图片的style宽度高度：750px,250px"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: cover(默认值)"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x40.jpg"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "cover"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: contain"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x40.jpg"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: stretch"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x40.jpg"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "stretch"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: 'style="resize-mode: center"'
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x40.jpg"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "center"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "img-layout-header" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "胖矮型：仅指定图片的style高度：250px"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: cover(默认值)"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x40.jpg"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "cover"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: contain>"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x40.jpg"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: stretch"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x40.jpg"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "stretch"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: center"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-240x40.jpg"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "center"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "img-layout-header" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "图片圆角样式： border-radius"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: cover(默认值)"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-160x160.jpg"
                                    },
                                    classList: [ "fixed-size-h", "circle" ],
                                    style: {
                                        resizeMode: "cover"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: contain"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-160x160.jpg"
                                    },
                                    classList: [ "fixed-size-h", "circle" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: stretch"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-160x160.jpg"
                                    },
                                    classList: [ "fixed-size-h", "circle" ],
                                    style: {
                                        resizeMode: "stretch"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "resize-mode: center"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-with-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/pic-160x160.jpg"
                                    },
                                    classList: [ "fixed-size-h", "circle" ],
                                    style: {
                                        resizeMode: "center"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "img-layout-header" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "支持svg图片格式："
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "矩形: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "rect1.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "带透明度的矩形: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "rect2.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "带透明度的矩形2: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "rect3.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "带圆角的矩形: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "rect4.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "圆形: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "circle1.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "椭圆: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "ellipse1.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "累叠的椭圆: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "ellipse2.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "两个椭圆: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "ellipse3.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "一条线: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "line1.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "三角形: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "polygon1.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "四边形: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "polygon2.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "折线: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "polyline1.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "路径: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "path1.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "螺旋: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/path2.svg"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "线形渐变 (水平渐变): "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "linear1.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "线形渐变 (垂直渐变): "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return "" + this.remoteURL + "linear3.svg";
                                        }
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "放射性渐变: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/radial1.svg"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "cover"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "放射性渐变 2: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/radial2.svg"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "cover"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "机器人: "
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: "/component/basic/image/img/robot.svg"
                                    },
                                    classList: [ "fixed-size-wh" ],
                                    style: {
                                        resizeMode: "contain"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "img-layout-header" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "网络图片获取状态回调："
                                }
                            } ]
                        }, {
                            type: "input",
                            attr: {
                                type: "text",
                                value: function() {
                                    return this.inputImageURL;
                                }
                            },
                            classList: [ "input-text" ],
                            events: {
                                change: "onImageUrlChange"
                            }
                        }, {
                            type: "input",
                            attr: {
                                type: "button",
                                value: "获取图片"
                            },
                            classList: [ "input-button" ],
                            events: {
                                click: "onImageGetClick"
                            }
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "item-container" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "网络图片"
                                },
                                classList: [ "item-title" ]
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "item-content-without-height" ],
                                children: [ {
                                    type: "image",
                                    attr: {
                                        src: function() {
                                            return this.requestImageURL;
                                        }
                                    },
                                    style: {
                                        resizeMode: "contain"
                                    },
                                    events: {
                                        complete: "onImageComplete",
                                        error: "onImageError"
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/basic/image/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/basic/image/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/basic/image/index.ux?uxType=page");
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