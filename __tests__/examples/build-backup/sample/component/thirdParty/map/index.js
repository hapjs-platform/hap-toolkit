/*! For license information please see index.js.LICENSE.txt */
(function() {
    var createPageHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/thirdParty/map/index.ux?uxType=page": module => {
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
                        const MARKER_PATH = "./img/marker.png";
                        const DEFAULT_SCALE = 17;
                        const TIAN_TAN_PARK_WGS = {
                            latitude: 39.8812273482,
                            longitude: 116.4105388182
                        };
                        const POINT1 = {
                            latitude: 39.9090371069,
                            longitude: 116.3953853161
                        };
                        const POINT2 = {
                            latitude: 39.9089550115,
                            longitude: 116.3992842749
                        };
                        const POINT3 = {
                            latitude: 39.9061293143,
                            longitude: 116.3995796987
                        };
                        const POINT4 = {
                            latitude: 39.9061694220,
                            longitude: 116.3953937341
                        };
                        const MARKER = {
                            iconPath: MARKER_PATH,
                            width: 100,
                            callout: {
                                content: "这里是\n天坛公园",
                                padding: 20,
                                borderRadius: 20
                            }
                        };
                        const POLYLINE = {
                            points: [ POINT1, POINT2, POINT3, POINT4, POINT1 ],
                            dotted: false,
                            width: 10
                        };
                        const CIRCLE = Object.assign({
                            fillColor: "#666666",
                            borderColor: "#ffffff",
                            borderWidth: 10,
                            radius: 100
                        }, TIAN_TAN_PARK_WGS);
                        let iconPathIndex = 0;
                        const iconPathList = [ MARKER_PATH, "https://doc.quickapp.cn/assets/images/logo.png" ];
                        let markTemp = {};
                        let locationTemp = {};
                        let carTarget = {
                            carA: 1,
                            carB: 1
                        };
                        let latitudeTemp = TIAN_TAN_PARK_WGS.latitude;
                        let longitudeTemp = TIAN_TAN_PARK_WGS.longitude;
                        var _default = {
                            private: {
                                showList: {
                                    mapShow: true,
                                    methodShow: false,
                                    viewportShow: false,
                                    operateSingleMarker: false,
                                    calloutShow: false,
                                    moveShow: false,
                                    polylineShow: false,
                                    circleShow: false,
                                    groundoverlayShow: false,
                                    controlShow: false,
                                    coordShow: false
                                },
                                width: "100%",
                                height: "100%",
                                rotate: 0,
                                currentCoordType: "",
                                showmylocation: false,
                                scale: DEFAULT_SCALE,
                                latitude: null,
                                longitude: null,
                                polylines: null,
                                circles: null,
                                markers: null,
                                groundoverlays: null,
                                controls: null,
                                includePoints: [],
                                latitudeConvert: null,
                                longitudeConvert: null,
                                fillColor: "",
                                strokeColor: ""
                            },
                            onReady() {
                                this.getCoord();
                            },
                            changeOption(e) {
                                const newValue = e.newValue;
                                for (let key in this.showList) {
                                    this.showList[key] = false;
                                }
                                this.showList[newValue] = true;
                                this.polylines = null;
                                this.markers = null;
                                this.circles = null;
                                this.includePoints = [];
                                this.controls = null;
                                this.groundoverlays = null;
                                this.scale = null;
                                this.scale = DEFAULT_SCALE;
                                this.rotate = 0;
                                markTemp = {
                                    markerAlpha: 1,
                                    markerX: 0.5,
                                    markerY: 1
                                };
                                switch (newValue) {
                                  case "viewportShow":
                                    const pointList = [ POINT1, POINT2, POINT3, POINT4 ];
                                    this.width = "100%";
                                    this.height = "100%";
                                    this.markers = pointList.map((item => Object.assign({}, item, {
                                        iconPath: MARKER_PATH,
                                        width: 20
                                    })));
                                    this.includePoints = pointList;
                                    break;

                                  case "operateSingleMarker":
                                  case "calloutShow":
                                    this.moveToCenter();
                                    this.markers = [ Object.assign({
                                        iconPath: MARKER_PATH,
                                        width: 100,
                                        id: 1,
                                        rotate: 0,
                                        callout: {
                                            content: "这里是\n天坛公园",
                                            padding: 0,
                                            borderRadius: 0
                                        }
                                    }, TIAN_TAN_PARK_WGS) ];
                                    break;

                                  case "moveShow":
                                    this.moveToCenter();
                                    this.markers = [ {
                                        id: 1,
                                        iconPath: "./img/carA.png"
                                    }, {
                                        id: 2,
                                        iconPath: "./img/carB.png"
                                    } ].map((item => Object.assign(item, POINT1, {
                                        width: 100,
                                        anchor: {
                                            x: 0.5,
                                            y: 0.5
                                        }
                                    })));

                                  case "polylineShow":
                                    this.moveToCenter();
                                    this.polylines = [ POLYLINE ];
                                    break;

                                  case "circleShow":
                                    this.moveToCenter();
                                    this.circles = [ CIRCLE ];
                                    break;

                                  case "groundoverlayShow":
                                    this.moveToCenter();
                                    this.groundoverlays = [ {
                                        northEast: POINT2,
                                        southWest: POINT4,
                                        iconPath: "./../../../common/logo.png",
                                        opacity: 1,
                                        visible: true
                                    } ];
                                    break;

                                  case "controlShow":
                                    this.controls = [ {
                                        id: 1,
                                        position: {
                                            left: "50px",
                                            bottom: "200px",
                                            width: "70px"
                                        },
                                        iconPath: "./img/location.png"
                                    }, {
                                        id: 2,
                                        position: {
                                            right: "50px",
                                            bottom: "200px",
                                            width: "70px"
                                        },
                                        iconPath: "./img/minus.png"
                                    }, {
                                        id: 3,
                                        position: {
                                            right: "50px",
                                            bottom: "300px",
                                            width: "70px"
                                        },
                                        iconPath: "./img/plus.png"
                                    } ];
                                    break;
                                }
                            },
                            moveToCenter() {
                                this.latitude = null;
                                this.longitude = null;
                                this.latitude = TIAN_TAN_PARK_WGS.latitude;
                                this.longitude = TIAN_TAN_PARK_WGS.longitude;
                            },
                            tap: function() {
                                _system.default.showToast({
                                    message: "地图被点击"
                                });
                            },
                            loaded: function() {
                                _system.default.showToast({
                                    message: "地图组件加载完毕"
                                });
                            },
                            getCenter: function() {
                                this.$element("map").getCenterLocation({
                                    success: function(res) {
                                        _system.default.showToast({
                                            message: "中心点纬度：" + res.latitude + "\n" + "中心点经度：" + res.longitude
                                        });
                                    },
                                    fail: function(reason) {
                                        _system.default.showToast({
                                            message: `获取失败，reason = ${reason}`
                                        });
                                    },
                                    complete: function() {
                                        console.log("complete");
                                    }
                                });
                            },
                            getScale: function() {
                                this.$element("map").getScale({
                                    success: function(res) {
                                        _system.default.showToast({
                                            message: "缩放级别：" + res.scale
                                        });
                                    },
                                    fail: function(reason) {
                                        _system.default.showToast({
                                            message: `获取失败，reason = ${reason}`
                                        });
                                    },
                                    complete: function() {
                                        console.log("complete");
                                    }
                                });
                            },
                            getRegion: function() {
                                this.$element("map").getRegion({
                                    success: function(res) {
                                        _system.default.showToast({
                                            message: "西南角：\n" + res.southwest + "\n" + "东北角：\n" + res.northeast
                                        });
                                    },
                                    fail: function(reason) {
                                        _system.default.showToast({
                                            message: `获取失败，reason = ${reason}`
                                        });
                                    },
                                    complete: function() {
                                        console.log("complete");
                                    }
                                });
                            },
                            regionchange: function() {
                                _system.default.showToast({
                                    message: "地图视野发生变化"
                                });
                            },
                            controlTap: function(res) {
                                const that = this;
                                switch (res.controlId) {
                                  case 1:
                                    this.showmylocation = true;
                                    this.$element("map").moveToMyLocation();
                                    _system.default.showToast({
                                        message: "控件：移动到当前位置并显示定位UI"
                                    });
                                    break;

                                  case 2:
                                    this.scale = this.scale - 1;
                                    this.$element("map").getScale({
                                        success: function(res) {
                                            that.scale = res.scale;
                                        },
                                        fail: function(reason) {
                                            _system.default.showToast({
                                                message: `获取失败，reason = ${reason}`
                                            });
                                        },
                                        complete: function() {
                                            console.log("complete");
                                        }
                                    });
                                    _system.default.showToast({
                                        message: "控件：缩小地图"
                                    });
                                    break;

                                  case 3:
                                    this.scale = this.scale + 1;
                                    this.$element("map").getScale({
                                        success: function(res) {
                                            that.scale = res.scale;
                                        },
                                        fail: function(reason) {
                                            _system.default.showToast({
                                                message: `获取失败，reason = ${reason}`
                                            });
                                        },
                                        complete: function() {
                                            console.log("complete");
                                        }
                                    });
                                    _system.default.showToast({
                                        message: "控件：放大地图"
                                    });
                                    break;

                                  default:
                                }
                            },
                            switchDotted: function() {
                                let polyline = this.polylines[0];
                                polyline.dotted = polyline.dotted ? false : true;
                                this.polylines = [ polyline ];
                            },
                            showMyLocation: function() {
                                this.showmylocation = this.showmylocation ? false : true;
                            },
                            moveToMyLocation: function() {
                                this.$element("map").moveToMyLocation();
                            },
                            getCoord: function() {
                                const self = this;
                                this.$element("map").getCoordType({
                                    success: function(res) {
                                        self.currentCoordType = res.coordType;
                                        _system.default.showToast({
                                            message: "当前坐标系：" + res.coordType
                                        });
                                    },
                                    fail: function(reason) {
                                        _system.default.showToast({
                                            message: `获取失败，reason = ${reason}`
                                        });
                                    },
                                    complete: function() {
                                        console.log("complete");
                                    }
                                });
                            },
                            getSupportedCoordTypes: function() {
                                this.$element("map").getSupportedCoordTypes({
                                    success: function(res) {
                                        let msg = JSON.stringify(res);
                                        _system.default.showToast({
                                            message: `当前支持的坐标系：${msg}`
                                        });
                                    },
                                    fail: function(reason) {
                                        _system.default.showToast({
                                            message: `获取失败，reason = ${reason}`
                                        });
                                    },
                                    complete: function() {
                                        console.log("complete");
                                    }
                                });
                            },
                            limitViewPort: function() {
                                this.$element("map").includePoints({
                                    points: [ POINT1, POINT2, POINT3, POINT4 ],
                                    padding: "0px 530px 200px 300px",
                                    success: function() {
                                        console.log("success");
                                    },
                                    fail: function(reason) {
                                        _system.default.showToast({
                                            message: `reason = ${reason}`
                                        });
                                    },
                                    complete: function() {
                                        console.log("complete");
                                    }
                                });
                            },
                            polylinePlus: function() {
                                let polyline = this.polylines[0];
                                polyline.width++;
                                this.polylines = [ polyline ];
                            },
                            polylineMinus: function() {
                                let polyline = this.polylines[0];
                                polyline.width--;
                                if (polyline.width <= 0) {
                                    polyline.width = 1;
                                }
                                this.polylines = [ polyline ];
                            },
                            circleLinePlus() {
                                let circle = this.circles[0];
                                circle.borderWidth++;
                                this.circles = [ circle ];
                            },
                            circleLineMinus() {
                                let circle = this.circles[0];
                                circle.borderWidth--;
                                if (circle.borderWidth <= 0) {
                                    circle.borderWidth = 1;
                                }
                                this.circles = [ circle ];
                            },
                            circleRadiusPlus() {
                                let circle = this.circles[0];
                                circle.radius += 10;
                                this.circles = [ circle ];
                            },
                            circleRadiusMinus() {
                                let circle = this.circles[0];
                                circle.radius -= 10;
                                if (circle.radius <= 0) {
                                    circle.radius = 10;
                                }
                                this.circles = [ circle ];
                            },
                            markerSizePlus() {
                                let mark = this.markers[0];
                                mark.width += 10;
                                this.markers = [ mark ];
                            },
                            markerSizeMinus() {
                                let mark = this.markers[0];
                                mark.width -= 10;
                                if (mark.width <= 0) {
                                    mark.width <= 10;
                                }
                                this.markers = [ mark ];
                            },
                            changeMarkerAlpha(value) {
                                markTemp.markerAlpha = value.text;
                            },
                            changeMarkerX(value) {
                                markTemp.markerX = value.text;
                            },
                            changeMarkerY(value) {
                                markTemp.markerY = value.text;
                            },
                            refreshMarker() {
                                let mark = this.markers[0];
                                mark.opacity = markTemp.markerAlpha;
                                mark.anchor = {
                                    x: markTemp.markerX,
                                    y: markTemp.markerY
                                };
                                this.markers = [ mark ];
                            },
                            rotateMarkerPlus() {
                                let mark = this.markers[0];
                                mark.rotate += 10;
                                this.markers = [ mark ];
                            },
                            rotateMarkerMinus() {
                                let mark = this.markers[0];
                                mark.rotate -= 10;
                                this.markers = [ mark ];
                            },
                            calloutRadiusPlus() {
                                let mark = this.markers[0];
                                mark.callout.borderRadius += 10;
                                this.markers = [ mark ];
                            },
                            calloutRadiusMinus() {
                                let mark = this.markers[0];
                                mark.callout.borderRadius -= 10;
                                if (mark.callout.borderRadius <= 0) {
                                    mark.callout.borderRadius = 0;
                                }
                                this.markers = [ mark ];
                            },
                            calloutPaddingPlus() {
                                let mark = this.markers[0];
                                mark.callout.padding += 10;
                                this.markers = [ mark ];
                            },
                            calloutPaddingMinus() {
                                let mark = this.markers[0];
                                mark.callout.padding -= 10;
                                if (mark.callout.padding <= 0) {
                                    mark.callout.padding = 0;
                                }
                                this.markers = [ mark ];
                            },
                            displayChange(e) {
                                let mark = this.markers[0];
                                mark.callout.display = e.value;
                                this.markers = [ mark ];
                            },
                            calloutContentChange(e) {
                                let mark = this.markers[0];
                                mark.callout.content = e.text === "" ? "这里是\n天坛公园" : e.text;
                                this.markers = [ mark ];
                            },
                            textAlignChange(e) {
                                let mark = this.markers[0];
                                mark.callout.textAlign = e.value;
                                this.markers = [ mark ];
                            },
                            moveA() {
                                let target;
                                switch (carTarget.carA) {
                                  case 1:
                                    carTarget.carA = 2;
                                    target = POINT2;
                                    break;

                                  case 2:
                                    carTarget.carA = 3;
                                    target = POINT3;
                                    break;

                                  case 3:
                                    carTarget.carA = 4;
                                    target = POINT4;
                                    break;

                                  case 4:
                                    carTarget.carA = 1;
                                    target = POINT1;
                                    break;
                                }
                                this.$element("map").translateMarker({
                                    markerId: 1,
                                    destination: target,
                                    autoRotate: true,
                                    duration: 3000,
                                    animationEnd: function() {
                                        _system.default.showToast({
                                            message: "小车A移动结束"
                                        });
                                    },
                                    success: function() {
                                        console.log("success");
                                    },
                                    fail: function(reason) {
                                        _system.default.showToast({
                                            message: `移动失败，reason = ${reason}`
                                        });
                                    },
                                    complete: function() {
                                        console.log("complete");
                                    }
                                });
                            },
                            moveB() {
                                let target;
                                switch (carTarget.carB) {
                                  case 1:
                                    carTarget.carB = 4;
                                    target = POINT4;
                                    break;

                                  case 2:
                                    carTarget.carB = 1;
                                    target = POINT1;
                                    break;

                                  case 3:
                                    carTarget.carB = 2;
                                    target = POINT2;
                                    break;

                                  case 4:
                                    carTarget.carB = 3;
                                    target = POINT3;
                                    break;
                                }
                                this.$element("map").translateMarker({
                                    markerId: 2,
                                    destination: target,
                                    autoRotate: true,
                                    duration: 3000,
                                    animationEnd: function() {
                                        _system.default.showToast({
                                            message: "小车B移动结束"
                                        });
                                    },
                                    success: function() {
                                        console.log("success");
                                    },
                                    fail: function(reason) {
                                        _system.default.showToast({
                                            message: `移动失败，reason = ${reason}`
                                        });
                                    },
                                    complete: function() {
                                        console.log("complete");
                                    }
                                });
                            },
                            resizeMap() {
                                this.width = this.width === "80%" ? "100%" : "80%";
                                this.height = this.height === "80%" ? "100%" : "80%";
                            },
                            rotateMapPlus() {
                                this.rotate += 10;
                            },
                            rotateMapMinus() {
                                this.rotate -= 10;
                            },
                            changeLatitude(e) {
                                const text = e.text;
                                if (text === "") {
                                    latitudeTemp = "";
                                } else {
                                    latitudeTemp = text;
                                }
                            },
                            changeLongitude(e) {
                                const text = e.text;
                                if (text === "") {
                                    longitudeTemp = "";
                                } else {
                                    longitudeTemp = text;
                                }
                            },
                            convertCoord() {
                                if (latitudeTemp && longitudeTemp) {
                                    const that = this;
                                    this.$element("map").convertCoord({
                                        latitude: latitudeTemp,
                                        longitude: longitudeTemp,
                                        success: function(res) {
                                            that.latitudeConvert = res.latitude;
                                            that.longitudeConvert = res.longitude;
                                        },
                                        fail: function(reason) {
                                            _system.default.showToast({
                                                message: `转换失败，reason = ${reason}`
                                            });
                                        },
                                        complete: function() {
                                            console.log("complete");
                                        }
                                    });
                                }
                            },
                            markerTap(res) {
                                _system.default.showToast({
                                    message: "Marker被点击, id：" + res.markerId
                                });
                            },
                            calloutTap(res) {
                                _system.default.showToast({
                                    message: "Callout被点击, marker id：" + res.markerId
                                });
                            },
                            goOpacityMinus() {
                                let groundoverlay = this.groundoverlays[0];
                                groundoverlay.opacity -= 0.1;
                                if (groundoverlay.opacity < 0) {
                                    groundoverlay.opacity = 0;
                                }
                                this.groundoverlays = [ groundoverlay ];
                            },
                            goOpacityPlus() {
                                let groundoverlay = this.groundoverlays[0];
                                groundoverlay.opacity += 0.1;
                                if (groundoverlay.opacity > 1) {
                                    groundoverlay.opacity = 1;
                                }
                                this.groundoverlays = [ groundoverlay ];
                            },
                            switchGoVisible() {
                                let groundoverlay = this.groundoverlays[0];
                                groundoverlay.visible = groundoverlay.visible ? false : true;
                                this.groundoverlays = [ groundoverlay ];
                            },
                            toggleIconPath() {
                                let mark = this.markers[0];
                                iconPathIndex++;
                                mark.iconPath = iconPathList[iconPathIndex % iconPathList.length];
                                this.markers = [ mark ];
                            },
                            changeOffset(type, e) {
                                markTemp[`offset${type}`] = Number(e.value);
                            },
                            refreshOffset() {
                                let mark = this.markers[0];
                                mark[`offsetX`] = markTemp[`offsetX`];
                                mark[`offsetY`] = markTemp[`offsetY`];
                                this.markers = [ mark ];
                            },
                            changeColor(type, e) {
                                locationTemp[`${type}Color`] = e.value;
                            },
                            refreshLocationStyle() {
                                this.fillColor = locationTemp.fillColor;
                                this.strokeColor = locationTemp.strokeColor;
                                this.showmylocation = true;
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
                "../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/thirdParty/map/index.ux?uxType=page": module => {
                    module.exports = {
                        ".card-container": {
                            width: "100%",
                            height: "100%",
                            flexDirection: "column",
                            opacity: 1
                        },
                        ".item-container": {
                            marginTop: "20px",
                            marginLeft: "20px",
                            flexDirection: "column"
                        },
                        ".select": {
                            height: "70px",
                            width: "320px",
                            fontSize: "30px",
                            marginTop: "20px",
                            borderTopWidth: "1px",
                            borderRightWidth: "1px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "1px",
                            borderStyle: "solid",
                            borderTopColor: "#333333",
                            borderRightColor: "#333333",
                            borderBottomColor: "#333333",
                            borderLeftColor: "#333333",
                            borderRadius: "5px"
                        },
                        ".option": {
                            height: "70px",
                            width: "320px",
                            fontSize: "30px",
                            marginTop: "20px",
                            paddingTop: "20px",
                            paddingBottom: "20px",
                            paddingLeft: "20px"
                        },
                        ".btn": {
                            height: "70px",
                            width: "320px",
                            fontSize: "30px",
                            marginTop: "20px",
                            opacity: 0.5,
                            color: "#000000"
                        },
                        ".input-hint": {
                            height: "70px",
                            width: "320px",
                            fontSize: "30px",
                            marginTop: "20px"
                        },
                        ".text-input": {
                            height: "70px",
                            width: "320px",
                            fontSize: "30px",
                            marginTop: "20px",
                            paddingBottom: "10px",
                            borderBottomWidth: "5px",
                            borderBottomColor: "#708090"
                        },
                        ".resize-btn": {
                            opacity: 0.5,
                            color: "#000000",
                            height: "100%",
                            width: "45%",
                            flexDirection: "row",
                            fontSize: "30px"
                        },
                        ".resize-btns": {
                            height: "70px",
                            width: "320px",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: "20px"
                        },
                        ".button-style": {
                            flex: 1,
                            marginLeft: "20px",
                            justifyContent: "flex-start",
                            flexDirection: "column",
                            alignItems: "flex-start"
                        },
                        ".viewport": {
                            flex: 1,
                            flexDirection: "column",
                            height: "100%",
                            width: "100%"
                        },
                        ".viewport-style1": {
                            backgroundColor: "rgba(0,0,0,0.2)",
                            opacity: 0.2,
                            marginTop: "20px",
                            width: "100%",
                            height: "400px"
                        },
                        ".viewport-style2": {
                            backgroundColor: "#000000",
                            opacity: 0.2,
                            width: "200px",
                            height: "100%",
                            alignSelf: "flex-end"
                        },
                        ".viewport-style3": {
                            backgroundColor: "#000000",
                            opacity: 0.2,
                            width: "100%",
                            height: "300px"
                        },
                        ".input-group": {
                            flexDirection: "column"
                        },
                        ".doc-row": {
                            justifyContent: "center",
                            marginLeft: "30px",
                            marginRight: "30px"
                        },
                        ".flex-grow": {
                            flexGrow: 1
                        }
                    };
                },
                "../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/thirdParty/map/index.ux?uxType=page&": module => {
                    module.exports = {
                        type: "stack",
                        attr: {},
                        children: [ {
                            type: "map",
                            attr: {
                                id: "map",
                                longitude: function() {
                                    return this.longitude;
                                },
                                latitude: function() {
                                    return this.latitude;
                                },
                                scale: function() {
                                    return this.scale;
                                },
                                markers: function() {
                                    return this.markers;
                                },
                                controls: function() {
                                    return this.controls;
                                },
                                circles: function() {
                                    return this.circles;
                                },
                                polylines: function() {
                                    return this.polylines;
                                },
                                groundoverlays: function() {
                                    return this.groundoverlays;
                                },
                                rotate: function() {
                                    return this.rotate;
                                },
                                showmylocation: function() {
                                    return this.showmylocation;
                                },
                                includepoints: function() {
                                    return this.includePoints;
                                }
                            },
                            id: "map",
                            style: {
                                width: function() {
                                    return this.width;
                                },
                                height: function() {
                                    return this.height;
                                },
                                mylocationFillColor: function() {
                                    return this.fillColor;
                                },
                                mylocationStrokeColor: function() {
                                    return this.strokeColor;
                                }
                            },
                            events: {
                                regionchange: "regionchange",
                                loaded: "loaded",
                                tap: "tap",
                                markertap: "markerTap",
                                callouttap: "calloutTap",
                                controltap: "controlTap"
                            }
                        }, {
                            type: "div",
                            attr: {},
                            classList: [ "card-container" ],
                            children: [ {
                                type: "div",
                                attr: {},
                                classList: [ "item-container" ],
                                children: [ {
                                    type: "select",
                                    attr: {},
                                    classList: [ "select" ],
                                    events: {
                                        change: "changeOption"
                                    },
                                    children: [ {
                                        type: "option",
                                        attr: {
                                            value: "mapShow",
                                            selected: "true",
                                            content: "地图展示"
                                        },
                                        classList: [ "option" ]
                                    }, {
                                        type: "option",
                                        attr: {
                                            value: "methodShow",
                                            content: "方法"
                                        },
                                        classList: [ "option" ]
                                    }, {
                                        type: "option",
                                        attr: {
                                            value: "viewportShow",
                                            content: "最佳视口"
                                        },
                                        classList: [ "option" ]
                                    }, {
                                        type: "option",
                                        attr: {
                                            value: "operateSingleMarker",
                                            content: "单一Marker操作"
                                        },
                                        classList: [ "option" ]
                                    }, {
                                        type: "option",
                                        attr: {
                                            value: "calloutShow",
                                            content: "Callout操作"
                                        },
                                        classList: [ "option" ]
                                    }, {
                                        type: "option",
                                        attr: {
                                            value: "moveShow",
                                            content: "Marker移动"
                                        },
                                        classList: [ "option" ]
                                    }, {
                                        type: "option",
                                        attr: {
                                            value: "polylineShow",
                                            content: "Polyline"
                                        },
                                        classList: [ "option" ]
                                    }, {
                                        type: "option",
                                        attr: {
                                            value: "circleShow",
                                            content: "Circle"
                                        },
                                        classList: [ "option" ]
                                    }, {
                                        type: "option",
                                        attr: {
                                            value: "groundoverlayShow",
                                            content: "Groundoverlay"
                                        },
                                        classList: [ "option" ]
                                    }, {
                                        type: "option",
                                        attr: {
                                            value: "controlShow",
                                            content: "Control"
                                        },
                                        classList: [ "option" ]
                                    }, {
                                        type: "option",
                                        attr: {
                                            value: "coordShow",
                                            content: "坐标转换"
                                        },
                                        classList: [ "option" ]
                                    } ]
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                shown: function() {
                                    return this.showList.mapShow;
                                },
                                classList: [ "button-style" ],
                                children: [ {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "显示/隐藏当前定位点"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "showMyLocation"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "移动到当前定位点"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "moveToMyLocation"
                                    }
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "resize-btns" ],
                                    children: [ {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "逆时针"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "rotateMapPlus"
                                        }
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "顺时针"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "rotateMapMinus"
                                        }
                                    } ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "改变地图组件尺寸"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "resizeMap"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        placeholder: "精度圈填充颜色",
                                        type: "text"
                                    },
                                    classList: [ "text-input" ],
                                    events: {
                                        change: function(evt) {
                                            return this.changeColor("fill", evt);
                                        }
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        placeholder: "精度圈描边颜色",
                                        type: "text"
                                    },
                                    classList: [ "text-input" ],
                                    events: {
                                        change: function(evt) {
                                            return this.changeColor("stroke", evt);
                                        }
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "修改精度圈颜色"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "refreshLocationStyle"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                shown: function() {
                                    return this.showList.methodShow;
                                },
                                classList: [ "button-style" ],
                                children: [ {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "获取中心点坐标"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "getCenter"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "获取当前视野范围"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "getRegion"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "获取当前放大级别"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "getScale"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "获取当前支持的坐标系"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "getSupportedCoordTypes"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "获取当前坐标系"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "getCoord"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                shown: function() {
                                    return this.showList.viewportShow;
                                },
                                classList: [ "viewport" ],
                                children: [ {
                                    type: "div",
                                    attr: {},
                                    classList: [ "viewport-style1" ],
                                    style: {
                                        opacity: 1
                                    },
                                    children: [ {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "区域限制"
                                        },
                                        style: {
                                            marginLeft: "20px"
                                        },
                                        classList: [ "btn" ],
                                        events: {
                                            click: "limitViewPort"
                                        }
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "viewport-style2" ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "viewport-style3" ]
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                shown: function() {
                                    return this.showList.operateSingleMarker;
                                },
                                classList: [ "button-style" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return this.markers && this.markers.length && this.markers[0].iconPath;
                                        }
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "切换图片来源"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "toggleIconPath"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        placeholder: "请输入 offsetX",
                                        type: "number"
                                    },
                                    classList: [ "text-input" ],
                                    events: {
                                        change: function(evt) {
                                            return this.changeOffset("X", evt);
                                        }
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        placeholder: "请输入 offsetY",
                                        type: "number"
                                    },
                                    classList: [ "text-input" ],
                                    events: {
                                        change: function(evt) {
                                            return this.changeOffset("Y", evt);
                                        }
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "修改坐标"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "refreshOffset"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        placeholder: "透明度（0-1）",
                                        type: "text"
                                    },
                                    classList: [ "text-input" ],
                                    events: {
                                        change: "changeMarkerAlpha"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        placeholder: "锚点X值（0-1）",
                                        type: "text"
                                    },
                                    classList: [ "text-input" ],
                                    events: {
                                        change: "changeMarkerX"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        placeholder: "锚点Y值（0-1）",
                                        type: "text"
                                    },
                                    classList: [ "text-input" ],
                                    events: {
                                        change: "changeMarkerY"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "生效"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "refreshMarker"
                                    }
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "resize-btns" ],
                                    children: [ {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "逆时针"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "rotateMarkerPlus"
                                        }
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "顺时针"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "rotateMarkerMinus"
                                        }
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "resize-btns" ],
                                    children: [ {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "尺寸+"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "markerSizePlus"
                                        }
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "尺寸-"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "markerSizeMinus"
                                        }
                                    } ]
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                shown: function() {
                                    return this.showList.calloutShow;
                                },
                                classList: [ "button-style" ],
                                children: [ {
                                    type: "input",
                                    attr: {
                                        placeholder: "callout文本",
                                        type: "text"
                                    },
                                    classList: [ "text-input" ],
                                    events: {
                                        change: "calloutContentChange"
                                    }
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "resize-btns" ],
                                    children: [ {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "圆角+"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "calloutRadiusPlus"
                                        }
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "圆角-"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "calloutRadiusMinus"
                                        }
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "resize-btns" ],
                                    children: [ {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "Padding+"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "calloutPaddingPlus"
                                        }
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "Padding-"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "calloutPaddingMinus"
                                        }
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "input-group" ],
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "display"
                                        },
                                        classList: [ "input-hint" ]
                                    }, {
                                        type: "div",
                                        attr: {},
                                        classList: [ "doc-row" ],
                                        children: [ {
                                            type: "input",
                                            attr: {
                                                id: "byclick1",
                                                type: "radio",
                                                name: "radio1",
                                                value: "byclick",
                                                checked: "true"
                                            },
                                            id: "byclick1",
                                            classList: [ "flex-grow" ],
                                            events: {
                                                change: "displayChange"
                                            }
                                        }, {
                                            type: "label",
                                            attr: {
                                                target: "byclick1",
                                                value: "byclick"
                                            }
                                        }, {
                                            type: "input",
                                            attr: {
                                                id: "byclick2",
                                                type: "radio",
                                                name: "radio1",
                                                value: "always"
                                            },
                                            id: "byclick2",
                                            classList: [ "flex-grow" ],
                                            events: {
                                                change: "displayChange"
                                            }
                                        }, {
                                            type: "label",
                                            attr: {
                                                target: "byclick2",
                                                value: "always"
                                            }
                                        } ]
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "input-group" ],
                                    children: [ {
                                        type: "text",
                                        attr: {
                                            value: "textAlign"
                                        },
                                        classList: [ "input-hint" ]
                                    }, {
                                        type: "div",
                                        attr: {},
                                        classList: [ "doc-row" ],
                                        children: [ {
                                            type: "input",
                                            attr: {
                                                id: "textAlign1",
                                                type: "radio",
                                                name: "radio2",
                                                value: "left"
                                            },
                                            id: "textAlign1",
                                            classList: [ "flex-grow" ],
                                            events: {
                                                change: "textAlignChange"
                                            }
                                        }, {
                                            type: "label",
                                            attr: {
                                                target: "textAlign1",
                                                value: "left"
                                            }
                                        }, {
                                            type: "input",
                                            attr: {
                                                id: "textAlign2",
                                                type: "radio",
                                                name: "radio2",
                                                value: "center",
                                                checked: "true"
                                            },
                                            id: "textAlign2",
                                            classList: [ "flex-grow" ],
                                            events: {
                                                change: "textAlignChange"
                                            }
                                        }, {
                                            type: "label",
                                            attr: {
                                                target: "textAlign2",
                                                value: "center"
                                            }
                                        }, {
                                            type: "input",
                                            attr: {
                                                id: "textAlign3",
                                                type: "radio",
                                                name: "radio2",
                                                value: "right"
                                            },
                                            id: "textAlign3",
                                            classList: [ "flex-grow" ],
                                            events: {
                                                change: "textAlignChange"
                                            }
                                        }, {
                                            type: "label",
                                            attr: {
                                                target: "textAlign3",
                                                value: "right"
                                            }
                                        } ]
                                    } ]
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                shown: function() {
                                    return this.showList.moveShow;
                                },
                                classList: [ "button-style" ],
                                children: [ {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "移动A车"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "moveA"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "移动B车"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "moveB"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                shown: function() {
                                    return this.showList.polylineShow;
                                },
                                classList: [ "button-style" ],
                                children: [ {
                                    type: "div",
                                    attr: {},
                                    classList: [ "resize-btns" ],
                                    children: [ {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "线宽+"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "polylinePlus"
                                        }
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "线宽-"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "polylineMinus"
                                        }
                                    } ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "虚实线切换"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "switchDotted"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                shown: function() {
                                    return this.showList.circleShow;
                                },
                                classList: [ "button-style" ],
                                children: [ {
                                    type: "div",
                                    attr: {},
                                    classList: [ "resize-btns" ],
                                    children: [ {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "线宽+"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "circleLinePlus"
                                        }
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "线宽-"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "circleLineMinus"
                                        }
                                    } ]
                                }, {
                                    type: "div",
                                    attr: {},
                                    classList: [ "resize-btns" ],
                                    children: [ {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "半径+"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "circleRadiusPlus"
                                        }
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "半径-"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "circleRadiusMinus"
                                        }
                                    } ]
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                shown: function() {
                                    return this.showList.groundoverlayShow;
                                },
                                classList: [ "button-style" ],
                                children: [ {
                                    type: "div",
                                    attr: {},
                                    classList: [ "resize-btns" ],
                                    children: [ {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "透明度+"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "goOpacityPlus"
                                        }
                                    }, {
                                        type: "input",
                                        attr: {
                                            type: "button",
                                            value: "透明度-"
                                        },
                                        classList: [ "resize-btn" ],
                                        events: {
                                            click: "goOpacityMinus"
                                        }
                                    } ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "可见性切换"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "switchGoVisible"
                                    }
                                } ]
                            }, {
                                type: "div",
                                attr: {},
                                shown: function() {
                                    return this.showList.controlShow;
                                },
                                classList: [ "button-style" ]
                            }, {
                                type: "div",
                                attr: {},
                                shown: function() {
                                    return this.showList.coordShow;
                                },
                                classList: [ "button-style" ],
                                children: [ {
                                    type: "text",
                                    attr: {
                                        value: "待转换的wgs84坐标:"
                                    },
                                    classList: [ "input-hint" ]
                                }, {
                                    type: "input",
                                    attr: {
                                        placeholder: "纬度",
                                        value: "39.9073728469",
                                        type: "text"
                                    },
                                    classList: [ "text-input" ],
                                    events: {
                                        change: "changeLatitude"
                                    }
                                }, {
                                    type: "input",
                                    attr: {
                                        placeholder: "经度",
                                        value: "116.3913445961",
                                        type: "text"
                                    },
                                    classList: [ "text-input" ],
                                    events: {
                                        change: "changeLongitude"
                                    }
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "转换为当前坐标系: " + this.currentCoordType;
                                        }
                                    },
                                    classList: [ "input-hint" ]
                                }, {
                                    type: "input",
                                    attr: {
                                        type: "button",
                                        value: "转换"
                                    },
                                    classList: [ "btn" ],
                                    events: {
                                        click: "convertCoord"
                                    }
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "转换坐标纬度：" + this.latitudeConvert;
                                        }
                                    },
                                    classList: [ "input-hint" ]
                                }, {
                                    type: "text",
                                    attr: {
                                        value: function() {
                                            return "" + "转换坐标经度：" + this.longitudeConvert;
                                        }
                                    },
                                    classList: [ "input-hint" ]
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
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&plugins[]=<CWD>/packages/hap-dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/access-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/component/thirdParty/map/index.ux?uxType=page");
                $app_define$("@app-component/index", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.template = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/template-loader.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/component/thirdParty/map/index.ux?uxType=page&");
                    $app_module$.exports.style = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/component/thirdParty/map/index.ux?uxType=page");
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