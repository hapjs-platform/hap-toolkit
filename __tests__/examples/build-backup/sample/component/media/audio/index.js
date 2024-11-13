/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/media/audio/index.ux?uxType=page": module => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$("@app-module/system.audio"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            private: {
                                componentName: "Audio",
                                audioSrc: "http://www.w3school.com.cn/i/song.mp3",
                                duration: 100,
                                spendTime: "00:00",
                                totalTime: "00:00",
                                currentTime: 0,
                                volume: 0,
                                valumeStatus: 0,
                                status: "stop",
                                playerStatus: true
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Audio"
                                });
                                _system.default.src = this.audioSrc;
                                _system.default.autoplay = false;
                                this.volume = parseInt(_system.default.volume * 10);
                                this.valumeStatus = _system.default.volume;
                                this.audioInit();
                            },
                            audioInit() {
                                const self = this;
                                _system.default.onloadeddata = function() {
                                    _system.default.loop = false;
                                    self.duration = _system.default.duration;
                                    self.totalTime = self.formatTime(_system.default.duration);
                                };
                                _system.default.ontimeupdate = function() {
                                    self.updateAudio();
                                };
                                _system.default.onpause = function() {
                                    self.status = "audio pause";
                                    console.info("pause");
                                };
                                _system.default.onended = function() {
                                    self.status = "audio end";
                                    self.playerStatus = true;
                                };
                                _system.default.onerror = function() {
                                    self.status = "audio error";
                                    console.info("error");
                                };
                                _system.default.ondurationchange = function() {
                                    console.info("change");
                                };
                                _system.default.onplay = function() {
                                    self.status = "audio play";
                                    self.playerStatus = false;
                                };
                                _system.default.onstop = function() {
                                    self.currentTime = 0;
                                    self.spendTime = "00:00";
                                    self.status = "audio stop";
                                    self.playerStatus = true;
                                };
                            },
                            playerStart() {
                                if (this.playerStatus) {
                                    _system.default.play();
                                } else {
                                    _system.default.pause();
                                }
                                this.playerStatus = !this.playerStatus;
                            },
                            stopAudio() {
                                if (!this.playerStatus) {
                                    _system.default.stop();
                                }
                            },
                            updateAudio() {
                                const time = _system.default.currentTime;
                                this.currentTime = time;
                                this.spendTime = this.formatTime(time);
                            },
                            sliderChange(e) {
                                const value = e.progress - _system.default.currentTime;
                                if (value > 1 || value < -1) {
                                    _system.default.currentTime = e.progress;
                                    this.playerStatus = false;
                                }
                            },
                            adjustVolume(e) {
                                _system.default.volume = e.progress / 10;
                                this.valumeStatus = e.progress / 10;
                            },
                            changeAudioNotificationVisibility(e) {
                                _system.default.notificationVisible = e.checked;
                            },
                            formatTime(time) {
                                const s = parseInt(time);
                                if (!s) {
                                    return "00:00";
                                }
                                const m = parseInt(s / 60);
                                const se = s % 60;
                                const min = m >= 10 ? m : "0" + m;
                                const sec = se >= 10 ? se : "0" + se;
                                return min + ":" + sec;
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../node_modules/sass-loader/dist/cjs.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/media/audio/index.ux?uxType=page": module => {
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
                        ".audio-content": {
                            flexDirection: "column",
                            paddingTop: "20px",
                            paddingRight: "20px",
                            paddingBottom: "20px",
                            paddingLeft: "20px",
                            marginBottom: "50px"
                        },
                        ".audio-content .audio": {
                            height: "120px",
                            flex: 1,
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "audio-content"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "audio"
                                } ]
                            }
                        },
                        ".btn-container": {
                            marginBottom: "50px",
                            marginRight: "60px",
                            marginLeft: "60px",
                            flexDirection: "column"
                        },
                        ".btn-content": {
                            flexDirection: "column",
                            backgroundColor: "#ffffff",
                            paddingTop: "30px",
                            paddingRight: "30px",
                            paddingBottom: "30px",
                            paddingLeft: "30px",
                            marginBottom: "100px",
                            alignItems: "center"
                        },
                        ".custom-audio": {
                            flexDirection: "row",
                            backgroundColor: "#dddddd"
                        },
                        ".custom-audio .player-content": {
                            height: "120px",
                            width: "100px",
                            justifyContent: "center",
                            alignItems: "center",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "custom-audio"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "player-content"
                                } ]
                            }
                        },
                        ".custom-audio .player-content image": {
                            height: "40px",
                            width: "40px",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "custom-audio"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "player-content"
                                }, {
                                    t: "d"
                                }, {
                                    t: "t",
                                    n: "image"
                                } ]
                            }
                        },
                        ".custom-audio .duration-content": {
                            height: "120px",
                            textAlign: "center",
                            fontSize: "25px",
                            width: "200px",
                            color: "#000000",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "custom-audio"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "duration-content"
                                } ]
                            }
                        },
                        ".custom-audio .audio-slider": {
                            color: "#FFFFFF",
                            paddingLeft: "20px",
                            width: "100%",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "custom-audio"
                                }, {
                                    t: "d"
                                }, {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "audio-slider"
                                } ]
                            }
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/media/audio/index.ux?uxType=page&": module => {
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
                            classList: [ "audio-content" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: function() {
                                        return "" + "调节音量大小：" + this.valumeStatus;
                                    }
                                }
                            } ]
                        }, {
                            type: "slider",
                            attr: {
                                min: "0",
                                max: "10",
                                step: "1",
                                value: function() {
                                    return this.volume;
                                }
                            },
                            events: {
                                change: "adjustVolume"
                            }
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "audio-content" ],
                            style: {
                                flexDirection: "row"
                            },
                            children: [ {
                                type: "label",
                                attr: {
                                    target: "checkbox1",
                                    value: "显示/隐藏音频播放通知："
                                }
                            }, {
                                type: "input",
                                attr: {
                                    id: "checkbox1",
                                    type: "checkbox",
                                    checked: "true"
                                },
                                id: "checkbox1",
                                events: {
                                    change: "changeAudioNotificationVisibility"
                                }
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "audio-content" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "自定义组件："
                                }
                            }, {
                                type: "div",
                                attr: {},
                                classList: [ "custom-audio" ],
                                children: [ {
                                    type: "div",
                                    attr: {},
                                    classList: [ "player-content" ],
                                    events: {
                                        click: "playerStart"
                                    },
                                    children: [ {
                                        type: "image",
                                        attr: {
                                            show: function() {
                                                return this.playerStatus;
                                            },
                                            src: "/component/media/audio/start.png"
                                        }
                                    }, {
                                        type: "image",
                                        attr: {
                                            show: function() {
                                                return !this.playerStatus;
                                            },
                                            src: "/component/media/audio/pause.png"
                                        }
                                    } ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + this.totalTime + "/" + this.spendTime;
                                        }
                                    },
                                    classList: [ "duration-content" ]
                                }, {
                                    type: "slider",
                                    attr: {
                                        min: "0",
                                        max: function() {
                                            return this.duration;
                                        },
                                        step: "1",
                                        value: function() {
                                            return this.currentTime;
                                        }
                                    },
                                    classList: [ "audio-slider" ],
                                    events: {
                                        change: "sliderChange"
                                    }
                                } ]
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "btn-container" ],
                            children: [ {
                                type: "div",
                                attr: {},
                                classList: [ "btn-content" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "当前状态：" + this.status;
                                        }
                                    },
                                    classList: [ "txt" ]
                                } ]
                            }, {
                                type: "input",
                                attr: {
                                    type: "button",
                                    value: "停止"
                                },
                                classList: [ "btn" ],
                                events: {
                                    click: "stopAudio"
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/media/audio/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/media/audio/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../node_modules/sass-loader/dist/cjs.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/media/audio/index.ux?uxType=page");
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