/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/media/canvas/index.ux?uxType=page": (module, __unused_webpack_exports, __webpack_require__) => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _canvas = __webpack_require__("./src/component/media/canvas/canvas.js");
                        var _default = {
                            private: {
                                componentName: "canvas"
                            },
                            onInit() {
                                this.$page.setTitleBar({
                                    text: "Canvas"
                                });
                            },
                            onShow() {
                                this.drawCanvas1();
                                this.drawCanvas2();
                                this.drawCanvas3();
                                this.drawCanvas4();
                                this.drawCanvas5();
                            },
                            drawCanvas1() {
                                const conf = {
                                    indicate: true,
                                    indicateColor: "#222",
                                    dial1Color: "#666600",
                                    dial2Color: "#81812e",
                                    dial3Color: "#9d9d5c",
                                    timeAdd: 1,
                                    time24h: true,
                                    dateAdd: 3,
                                    dateAddColor: "#999"
                                };
                                const canvas = this.$element("canvas1");
                                const ctx = canvas.getContext("2d");
                                (0, _canvas.drawClock)(400, ctx, conf);
                            },
                            drawCanvas2() {
                                const canvas = this.$element("canvas2");
                                const ctx = canvas.getContext("2d");
                                (0, _canvas.drawLogo)(ctx);
                            },
                            drawCanvas3() {
                                const canvas = this.$element("canvas3");
                                const ctx = canvas.getContext("2d");
                                const img = new Image;
                                img.src = "https://www.quickapp.cn/assets/images/home/logo.png";
                                img.onload = function() {
                                    ctx.drawImage(img, 40, 40, 300, 100);
                                };
                            },
                            drawCanvas4() {
                                const canvas = this.$element("canvas4");
                                const ctx = canvas.getContext("2d");
                                ctx.drawImage(this.$element("image"), 0, 0, 300, 300);
                            },
                            drawCanvas5() {
                                const canvas = this.$element("canvas5");
                                const ctx = canvas.getContext("2d");
                                (0, _canvas.drawGradientLogo)(ctx);
                                (0, _canvas.grayFilter)(ctx);
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/media/canvas/index.ux?uxType=page": module => {
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
                        ".content": {
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                            backgroundColor: "#ffffff",
                            paddingTop: "30px",
                            paddingRight: "0px",
                            paddingBottom: "10px",
                            paddingLeft: "0px"
                        },
                        canvas: {
                            height: "400px",
                            width: "400px"
                        },
                        "#canvas2": {
                            height: "300px"
                        },
                        "#canvas3": {
                            height: "200px"
                        },
                        "#canvas4": {
                            width: "380px",
                            height: "380px"
                        },
                        ".content text": {
                            marginTop: "20px",
                            _meta: {
                                ruleDef: [ {
                                    t: "a",
                                    n: "class",
                                    i: false,
                                    a: "element",
                                    v: "content"
                                }, {
                                    t: "d"
                                }, {
                                    t: "t",
                                    n: "text"
                                } ]
                            }
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/media/canvas/index.ux?uxType=page&": module => {
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
                            classList: [ "content" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "canvas绘制时钟"
                                }
                            }, {
                                type: "canvas",
                                attr: {
                                    id: "canvas1"
                                },
                                id: "canvas1"
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "content" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "canvas绘制图形"
                                }
                            }, {
                                type: "canvas",
                                attr: {
                                    id: "canvas2"
                                },
                                id: "canvas2"
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "content" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "canvas绘制图片"
                                }
                            }, {
                                type: "canvas",
                                attr: {
                                    id: "canvas3"
                                },
                                id: "canvas3"
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "content" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "canvas绘制元素"
                                }
                            }, {
                                type: "image",
                                attr: {
                                    id: "image",
                                    src: "/common/logo.png"
                                },
                                id: "image"
                            }, {
                                type: "canvas",
                                attr: {
                                    id: "canvas4"
                                },
                                id: "canvas4"
                            } ]
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "content" ],
                            children: [ {
                                type: "text",
                                attr: {
                                    value: "canvas像素操作"
                                }
                            }, {
                                type: "canvas",
                                attr: {
                                    id: "canvas5"
                                },
                                id: "canvas5"
                            } ]
                        } ]
                    };
                },
                "./src/component/media/canvas/canvas.js": (__unused_webpack_module, exports) => {
                    "use strict";
                    Object.defineProperty(exports, "__esModule", {
                        value: true
                    });
                    exports.grayFilter = exports.drawLogo = exports.drawGradientLogo = exports.drawClock = void 0;
                    const dayArr = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
                    const monthArr = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
                    const drawClock = (size, cns, clockd) => {
                        cns.clearRect(0, 0, size, size);
                        cns.beginPath();
                        cns.fillStyle = "#ffffff";
                        cns.rect(0, 0, size, size);
                        cns.fill();
                        cns.closePath();
                        if (clockd.hasOwnProperty("indicate") && clockd.indicate == true || !clockd.hasOwnProperty("indicate")) {
                            indicator(size, cns, clockd);
                        }
                        if (clockd.hasOwnProperty("timeAdd") && clockd.timeAdd) {
                            timeAdd(size / 2, size / 5 * 3, size, cns, clockd);
                        }
                        if (clockd.hasOwnProperty("dateAdd") && clockd.dateAdd) {
                            dateAdd(size / 2, size / 5 * 3 + size / 10, size, cns, clockd);
                        }
                        const now = new Date;
                        const timeOff = clockd.hasOwnProperty("timeoffset") ? clockd["timeoffset"] : 0;
                        now.setTime(now.getTime() + timeOff * 1000);
                        const milisec = now.getMilliseconds();
                        const sec = now.getSeconds();
                        const min = now.getMinutes();
                        const hour = now.getHours() % 12;
                        cns.fillStyle = clockd.hasOwnProperty("dial1Color") ? clockd["dial1Color"] : "#333333";
                        cns.strokeStyle = clockd.hasOwnProperty("dial1Color") ? clockd["dial1Color"] : "#333333";
                        cns.lineCap = "round";
                        cns.beginPath();
                        cns.lineWidth = 1;
                        cns.moveTo(size / 2, size / 2);
                        cns.arc(size / 2, size / 2, size / 3, -1.57 + sec * 0.1046 + milisec / 1000 * 0.1046, -1.569 + sec * 0.1046 + milisec / 1000 * 0.1046, 0);
                        cns.stroke();
                        cns.closePath();
                        cns.beginPath();
                        cns.lineWidth = 1;
                        cns.moveTo(size / 2, size / 2);
                        cns.arc(size / 2, size / 2, size / 15, 1.57 + sec * 0.1046 + milisec / 1000 * 0.1046, 1.569 + sec * 0.1046 + milisec / 1000 * 0.1046, 1);
                        cns.stroke();
                        cns.closePath();
                        cns.fillStyle = clockd.hasOwnProperty("dial2Color") ? clockd["dial2Color"] : "#333333";
                        cns.strokeStyle = clockd.hasOwnProperty("dial2Color") ? clockd["dial2Color"] : "#333333";
                        cns.lineCap = "round";
                        cns.beginPath();
                        cns.lineWidth = 2;
                        cns.moveTo(size / 2, size / 2);
                        cns.arc(size / 2, size / 2, size / 3, -1.57 + min * 0.1046 + sec / 60 * 0.1046, -1.569 + min * 0.1046 + sec / 60 * 0.1046, 0);
                        cns.stroke();
                        cns.closePath();
                        cns.fillStyle = clockd.hasOwnProperty("dial3Color") ? clockd["dial3Color"] : "#333333";
                        cns.strokeStyle = clockd.hasOwnProperty("dial3Color") ? clockd["dial3Color"] : "#333333";
                        cns.lineCap = "round";
                        cns.beginPath();
                        cns.lineWidth = 3;
                        cns.moveTo(size / 2, size / 2);
                        cns.arc(size / 2, size / 2, size / 4, -1.57 + hour * 0.523 + min / 60 * 0.523, -1.569 + hour * 0.523 + min / 60 * 0.523, 0);
                        cns.stroke();
                        cns.closePath();
                        cns.fillStyle = clockd.hasOwnProperty("dial1Color") ? clockd["dial1Color"] : "#333333";
                        cns.strokeStyle = clockd.hasOwnProperty("dial1Color") ? clockd["dial1Color"] : "#333333";
                        cns.lineCap = "round";
                        cns.beginPath();
                        cns.lineWidth = 2;
                        cns.arc(size / 2, size / 2, size / 80, 0, 6.28, 0);
                        cns.fill();
                        cns.closePath();
                        clockd.timer = setTimeout((function() {
                            drawClock(size, cns, clockd);
                        }), 50);
                    };
                    exports.drawClock = drawClock;
                    const indicator = (size, cns, clockd) => {
                        if (clockd.hasOwnProperty("indicateColor")) {
                            cns.strokeStyle = clockd["indicateColor"];
                        } else {
                            cns.strokeStyle = "#333";
                        }
                        cns.lineWidth = 2;
                        let ekstra;
                        for (let a = 0; a < 12; a++) {
                            const r = parseInt(a) * 0.523;
                            const calc = Math.cos(r - 1.57);
                            const y = Math.sin(r - 1.57);
                            if (a % 3 == 0) {
                                ekstra = size / 50;
                            } else {
                                ekstra = 0;
                            }
                            cns.beginPath();
                            cns.moveTo(calc * (size / 3 + ekstra) + size / 2, y * (size / 3 + ekstra) + size / 2);
                            cns.lineTo(calc * size / 3.25 + size / 2, y * size / 3.25 + size / 2);
                            cns.stroke();
                            cns.fill();
                            cns.closePath();
                        }
                    };
                    const timeAdd = (x, y, size, cns, clockd) => {
                        if (!clockd.hasOwnProperty("timeAdd")) {
                            return;
                        }
                        const now = new Date;
                        const timeOff = clockd.hasOwnProperty("timeoffset") ? clockd["timeoffset"] : 0;
                        now.setTime(now.getTime() + timeOff * 1000);
                        let sec = now.getSeconds();
                        let min = now.getMinutes();
                        let hour = clockd.hasOwnProperty("time24h") && clockd["time24h"] ? now.getHours() : now.getHours() % 12;
                        if (hour == 0) {
                            hour = 12;
                        }
                        if (hour < 10) {
                            hour = "0" + hour;
                        }
                        if (min < 10) {
                            min = "0" + min;
                        }
                        if (sec < 10) {
                            sec = "0" + sec;
                        }
                        cns.lineWidth = 1;
                        cns.fillStyle = clockd.hasOwnProperty("timeAddColor") ? clockd["timeAddColor"] : "#333";
                        cns.textBaseline = "middle";
                        cns.textAlign = "center";
                        cns.font = size / 15 + "px Arial";
                        switch (parseInt(clockd["timeAdd"])) {
                          case 1:
                            cns.fillText(hour + ":" + min + ":" + sec, x, y);
                            break;

                          case 2:
                            cns.fillText(hour + ":" + min, x, y);
                            break;

                          case 3:
                            hour = now.getHours();
                            if (hour < 10) {
                                hour = "0" + hour;
                            }
                            cns.fillText(hour + ":" + min + ":" + sec, x, y);
                            break;

                          default:
                            hour = now.getHours();
                            if (hour < 10) {
                                hour = "0" + hour;
                            }
                            cns.fillText(hour + ":" + min, x, y);
                        }
                    };
                    const dateAdd = (x, y, size, cns, clockd) => {
                        if (!clockd.hasOwnProperty("dateAdd")) {
                            return;
                        }
                        const now = new Date;
                        const timeOff = clockd.hasOwnProperty("timeoffset") ? clockd["timeoffset"] : 0;
                        now.setTime(now.getTime() + timeOff * 1000);
                        let day = now.getDate();
                        let year = now.getFullYear();
                        let month = now.getMonth() + 1;
                        if (month < 10) {
                            month = "0" + month;
                        }
                        if (day < 10) {
                            day = "0" + day;
                        }
                        cns.lineWidth = 1;
                        cns.fillStyle = clockd["dateAddColor"];
                        cns.textBaseline = "middle";
                        cns.textAlign = "center";
                        cns.font = size / 20 + "px Arial";
                        switch (parseInt(clockd["dateAdd"])) {
                          case 1:
                            cns.fillText(day + "/" + month + "/" + year, x, y);
                            break;

                          case 2:
                            cns.fillText(month + "/" + day + "/" + year, x, y);
                            break;

                          case 3:
                            day = now.getDay();
                            cns.fillText(dayArr[day], x, y);
                            break;

                          case 4:
                            month = now.getMonth();
                            cns.fillText(monthArr[month] + " " + day, x, y);
                            break;

                          default:
                            month = now.getMonth();
                            cns.fillText(day + " " + monthArr[month], x, y);
                        }
                    };
                    const drawLogo = ctx => {
                        const r = 20;
                        const h = 300;
                        const p = Math.PI;
                        const s = 40;
                        ctx.beginPath();
                        ctx.moveTo(h / 2 + s, h / 2);
                        ctx.arc(h / 2, h / 2, s, 0, -p / 2 * 3, true);
                        ctx.arc(h / 2, h / 2 + s + s / 2, s / 2, -p / 2, p / 2, false);
                        ctx.arc(h / 2, h / 2, s * 2, -p / 2 * 3, 0, false);
                        ctx.arc(h / 2 + s + s / 2, h / 2, s / 2, 0, p, false);
                        ctx.fillStyle = "#4285f5";
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(h / 2 + s * 2, h / 2 + s + s / 2);
                        ctx.arc(h / 2 + s + s / 2, h / 2 + s + s / 2, s / 2, 0, p * 2, false);
                        ctx.fillStyle = "#e94335";
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(h / 2 + s / 4 * 3, h / 2 + s / 2);
                        ctx.arc(h / 2 + s / 2, h / 2 + s / 2, s / 4, 0, p * 2, false);
                        ctx.fillStyle = "#f9bc05";
                        ctx.fill();
                    };
                    exports.drawLogo = drawLogo;
                    const drawGradientLogo = ctx => {
                        const r = 20;
                        const h = 380;
                        const p = Math.PI;
                        const linGrad1 = ctx.createLinearGradient(h, h, 0, 0);
                        linGrad1.addColorStop(0, "#FFFAFA");
                        linGrad1.addColorStop(0.8, "#E4C700");
                        linGrad1.addColorStop(1, "rgba(228,199,0,0)");
                        ctx.fillStyle = linGrad1;
                        ctx.fillRect(0, 0, h, h);
                        const linGrad2 = ctx.createLinearGradient(0, 0, h, h);
                        linGrad2.addColorStop(0, "#C1FFC1");
                        linGrad2.addColorStop(0.5, "#ffffff");
                        linGrad2.addColorStop(1, "#00BFFF");
                        ctx.beginPath();
                        ctx.moveTo(r * 2, r);
                        ctx.arc(r * 2, r * 2, r, -p / 2, -p, true);
                        ctx.lineTo(r, h - r * 2);
                        ctx.arc(r * 2, h - r * 2, r, p, p / 2, true);
                        ctx.lineTo(h - r * 2, h - r);
                        ctx.arc(h - r * 2, h - r * 2, r, p / 2, 0, true);
                        ctx.lineTo(h - r, r * 2);
                        ctx.arc(h - r * 2, r * 2, r, 0, -p / 2, true);
                        ctx.closePath();
                        ctx.lineWidth = 10;
                        ctx.strokeStyle = linGrad2;
                        ctx.stroke();
                        const s = 60;
                        ctx.beginPath();
                        ctx.moveTo(h / 2 + s, h / 2);
                        ctx.arc(h / 2, h / 2, s, 0, -p / 2 * 3, true);
                        ctx.arc(h / 2, h / 2 + s + s / 2, s / 2, -p / 2, p / 2, false);
                        ctx.arc(h / 2, h / 2, s * 2, -p / 2 * 3, 0, false);
                        ctx.arc(h / 2 + s + s / 2, h / 2, s / 2, 0, p, false);
                        ctx.fillStyle = "#4286f5";
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(h / 2 + s * 2, h / 2 + s + s / 2);
                        ctx.arc(h / 2 + s + s / 2, h / 2 + s + s / 2, s / 2, 0, p * 2, false);
                        ctx.fillStyle = "rgb(234, 67, 53)";
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(h / 2 + s / 4 * 3, h / 2 + s / 2);
                        ctx.arc(h / 2 + s / 2, h / 2 + s / 2, s / 4, 0, p * 2, false);
                        ctx.fillStyle = "rgba(250, 188, 5, 1)";
                        ctx.fill();
                    };
                    exports.drawGradientLogo = drawGradientLogo;
                    const grayFilter = ctx => {
                        const canvasW = 380;
                        const canvasH = 380;
                        const imageData = ctx.getImageData(0, 0, canvasW, canvasH);
                        const data = imageData.data;
                        const grayscale = () => {
                            for (let i = 0; i < data.length; i += 4) {
                                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                                data[i] = avg;
                                data[i + 1] = avg;
                                data[i + 2] = avg;
                            }
                            ctx.putImageData(imageData, 0, 0);
                        };
                        grayscale();
                    };
                    exports.grayFilter = grayFilter;
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/media/canvas/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/media/canvas/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/media/canvas/index.ux?uxType=page");
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