/*! For license information please see app.js.LICENSE.txt */
(function() {
    var $app_define_wrap$ = $app_define_wrap$ || function() {};
    var manifestJson = {
        package: "org.hapjs.demo.sample",
        name: "快应用组件展示",
        versionName: "1.0.3",
        versionCode: 103,
        icon: "/common/logo.png",
        features: [ {
            name: "system.webview"
        }, {
            name: "system.prompt"
        }, {
            name: "system.clipboard"
        }, {
            name: "system.calendar"
        }, {
            name: "system.device"
        }, {
            name: "system.fetch"
        }, {
            name: "system.file"
        }, {
            name: "system.geolocation"
        }, {
            name: "system.image"
        }, {
            name: "system.media"
        }, {
            name: "system.notification"
        }, {
            name: "system.barcode"
        }, {
            name: "system.sensor"
        }, {
            name: "system.share"
        }, {
            name: "system.shortcut"
        }, {
            name: "system.storage"
        }, {
            name: "system.vibrator"
        }, {
            name: "system.network"
        }, {
            name: "system.request"
        }, {
            name: "system.audio"
        }, {
            name: "system.volume"
        }, {
            name: "system.battery"
        }, {
            name: "system.brightness"
        }, {
            name: "system.package"
        }, {
            name: "system.record"
        }, {
            name: "system.sms"
        }, {
            name: "system.websocketfactory"
        }, {
            name: "system.wifi"
        }, {
            name: "system.animation"
        }, {
            name: "service.stats"
        }, {
            name: "service.account"
        }, {
            name: "system.contact"
        }, {
            name: "service.app"
        }, {
            name: "service.share",
            params: {
                appSign: "",
                wxKey: ""
            }
        }, {
            name: "service.pay"
        }, {
            name: "service.alipay"
        }, {
            name: "service.wxpay",
            params: {
                url: "",
                package: "",
                sign: ""
            }
        }, {
            name: "service.push",
            params: {
                appId: "",
                appKey: ""
            }
        }, {
            name: "service.wxaccount",
            params: {
                appId: "xxx",
                package: "xxx",
                sign: "xxx"
            }
        }, {
            name: "service.qqaccount",
            params: {
                package: "xxx",
                appId: "xxx",
                sign: "xxx",
                clientId: "xxx"
            }
        }, {
            name: "service.wbaccount",
            params: {
                sign: "",
                appKey: ""
            }
        } ],
        permissions: [ {
            origin: "*"
        } ],
        config: {
            logLevel: "debug",
            data: {
                back: "false"
            }
        },
        router: {
            entry: "home",
            pages: {
                home: {
                    component: "index"
                },
                "component/basic/a": {
                    component: "index"
                },
                "component/media/web/detail": {
                    component: "index"
                },
                "component/media/web": {
                    component: "index"
                },
                "component/container/div": {
                    component: "index"
                },
                "component/basic/image": {
                    component: "index"
                },
                "component/form/input": {
                    component: "index"
                },
                "component/form/label": {
                    component: "index"
                },
                "component/container/list": {
                    component: "index"
                },
                "component/form/picker": {
                    component: "index"
                },
                "component/form/multi-picker": {
                    component: "index"
                },
                "component/basic/progress": {
                    component: "index"
                },
                "component/container/popup": {
                    component: "index"
                },
                "component/container/refresh": {
                    component: "index"
                },
                "component/container/richtext": {
                    component: "index"
                },
                "component/form/slider": {
                    component: "index"
                },
                "component/basic/span": {
                    component: "index"
                },
                "component/container/stack": {
                    component: "index"
                },
                "component/container/swiper": {
                    component: "index"
                },
                "component/form/switch": {
                    component: "index"
                },
                "component/container/tabs": {
                    component: "index"
                },
                "component/basic/text": {
                    component: "index"
                },
                "component/basic/rating": {
                    component: "index"
                },
                "component/form/textarea": {
                    component: "index"
                },
                "component/media/video": {
                    component: "index"
                },
                "component/media/canvas": {
                    component: "index"
                },
                "component/media/audio": {
                    component: "index"
                },
                "component/thirdParty/map": {
                    component: "index"
                },
                "framework/deeplink": {
                    component: "index"
                },
                "framework/lifecycle": {
                    component: "index"
                },
                "framework/exit": {
                    component: "index"
                },
                "framework/exit/pages/page1": {
                    component: "index",
                    path: "/exit/page1"
                },
                "framework/exit/pages/page2": {
                    component: "index",
                    path: "/exit/page2"
                },
                "framework/exit/pages/page3": {
                    component: "index",
                    path: "/exit/page3"
                },
                "interface/thirdparty/alipay": {
                    component: "index"
                },
                "interface/thirdparty/wxpay": {
                    component: "index"
                },
                "interface/thirdparty/serviceshare": {
                    component: "index"
                },
                "interface/thirdparty/wxaccount": {
                    component: "index"
                },
                "interface/thirdparty/qqaccount": {
                    component: "index"
                },
                "interface/thirdparty/wbaccount": {
                    component: "index"
                },
                "interface/system/brightness": {
                    component: "index"
                },
                "interface/system/calendar": {
                    component: "index"
                },
                "interface/system/clipboard": {
                    component: "index"
                },
                "interface/system/device": {
                    component: "index"
                },
                "interface/system/app": {
                    component: "index"
                },
                "interface/system/fetch": {
                    component: "index"
                },
                "interface/system/file": {
                    component: "index"
                },
                "interface/system/filerw": {
                    component: "index"
                },
                "interface/system/geolocation": {
                    component: "index"
                },
                "interface/system/image": {
                    component: "index"
                },
                "interface/system/media": {
                    component: "index"
                },
                "interface/system/network": {
                    component: "index"
                },
                "interface/system/notification": {
                    component: "index"
                },
                "interface/system/prompt": {
                    component: "index"
                },
                "interface/system/package": {
                    component: "index"
                },
                "interface/system/forbid": {
                    component: "index"
                },
                "interface/system/qrcode": {
                    component: "index"
                },
                "interface/system/request": {
                    component: "index"
                },
                "interface/system/router": {
                    component: "index"
                },
                "interface/system/router/detail": {
                    component: "index"
                },
                "interface/system/record": {
                    component: "index"
                },
                "interface/system/sensor": {
                    component: "index"
                },
                "interface/system/share": {
                    component: "index"
                },
                "interface/system/shortcut": {
                    component: "index"
                },
                "interface/system/storage": {
                    component: "index"
                },
                "interface/system/vibrator": {
                    component: "index"
                },
                "interface/system/volume": {
                    component: "index"
                },
                "interface/system/battery": {
                    component: "index"
                },
                "interface/system/webview": {
                    component: "index"
                },
                "interface/system/sms": {
                    component: "index"
                },
                "interface/system/contact": {
                    component: "index"
                },
                "interface/system/websocket": {
                    component: "index"
                },
                "interface/system/wifi": {
                    component: "index"
                },
                "component/style/animation": {
                    component: "index"
                },
                "component/style/transform": {
                    component: "index"
                },
                "component/style/translatepercent": {
                    component: "index"
                },
                "component/style/backgroundposition": {
                    component: "index"
                },
                "component/style/background9image": {
                    component: "index"
                },
                "component/style/font-family": {
                    component: "index"
                },
                "functionality/animationapi": {
                    component: "index"
                },
                "functionality/changestyle": {
                    component: "index"
                },
                "functionality/form": {
                    component: "index"
                },
                "functionality/menutop": {
                    component: "index"
                },
                "functionality/ceiling": {
                    component: "index"
                },
                "functionality/photo": {
                    component: "index"
                },
                "functionality/h5download": {
                    component: "index"
                },
                "functionality/postMessage": {
                    component: "index"
                },
                "functionality/qrcode": {
                    component: "index"
                },
                "functionality/titlebar": {
                    component: "index"
                },
                "functionality/listcombination": {
                    component: "index"
                },
                "functionality/verification": {
                    component: "index"
                },
                "functionality/simulate-swipe": {
                    component: "index"
                },
                "functionality/template/elec-business": {
                    component: "index"
                },
                "functionality/customWeb": {
                    component: "index"
                },
                "functionality/web": {
                    component: "index"
                }
            }
        },
        display: {
            backgroundColor: "#fbf9fe",
            titleBar: true,
            titleBarBackgroundColor: "#0faeff",
            titleBarTextColor: "#ffffff",
            pages: {
                home: {
                    titleBarText: "快应用组件展示"
                },
                "component/media/web": {
                    titleBar: false
                },
                "framework/lifecycle": {
                    menu: true
                }
            },
            windowSoftInputMode: "adjustResize"
        }
    };
    var createAppHandler = function() {
        return (() => {
            var __webpack_modules__ = {
                "../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../packages/hap-packager/lib/loaders/manifest-loader.js?path=<project-root>/src!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/app.ux?uxType=app": (module, __unused_webpack_exports, __webpack_require__) => {
                    module.exports = function __scriptModule__(module, exports, $app_require$) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _regenerator = _interopRequireDefault(__webpack_require__("./src/regenerator.js"));
                        function _interopRequireDefault(obj) {
                            return obj && obj.__esModule ? obj : {
                                default: obj
                            };
                        }
                        var _default = {
                            onError(err) {
                                console.log(`error message=${err.message}, stack=${err.stack}`);
                            }
                        };
                        exports.default = _default;
                    };
                },
                "./src/regenerator.js": (__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
                    "use strict";
                    const injectRef = Object.getPrototypeOf(__webpack_require__.g) || __webpack_require__.g;
                    injectRef.regeneratorRuntime = __webpack_require__("./node_modules/@babel/runtime/regenerator/index.js");
                },
                "./node_modules/@babel/runtime/helpers/regeneratorRuntime.js": (module, __unused_webpack_exports, __webpack_require__) => {
                    "use strict";
                    var _typeof = __webpack_require__("./node_modules/@babel/runtime/helpers/typeof.js")["default"];
                    function _regeneratorRuntime() {
                        "use strict";
                        module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
                            return exports;
                        }, module.exports.__esModule = true, module.exports["default"] = module.exports;
                        var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function(obj, key, desc) {
                            obj[key] = desc.value;
                        }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
                        function define(obj, key, value) {
                            return Object.defineProperty(obj, key, {
                                value,
                                enumerable: !0,
                                configurable: !0,
                                writable: !0
                            }), obj[key];
                        }
                        try {
                            define({}, "");
                        } catch (err) {
                            define = function define(obj, key, value) {
                                return obj[key] = value;
                            };
                        }
                        function wrap(innerFn, outerFn, self, tryLocsList) {
                            var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []);
                            return defineProperty(generator, "_invoke", {
                                value: makeInvokeMethod(innerFn, self, context)
                            }), generator;
                        }
                        function tryCatch(fn, obj, arg) {
                            try {
                                return {
                                    type: "normal",
                                    arg: fn.call(obj, arg)
                                };
                            } catch (err) {
                                return {
                                    type: "throw",
                                    arg: err
                                };
                            }
                        }
                        exports.wrap = wrap;
                        var ContinueSentinel = {};
                        function Generator() {}
                        function GeneratorFunction() {}
                        function GeneratorFunctionPrototype() {}
                        var IteratorPrototype = {};
                        define(IteratorPrototype, iteratorSymbol, (function() {
                            return this;
                        }));
                        var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([])));
                        NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
                        var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
                        function defineIteratorMethods(prototype) {
                            [ "next", "throw", "return" ].forEach((function(method) {
                                define(prototype, method, (function(arg) {
                                    return this._invoke(method, arg);
                                }));
                            }));
                        }
                        function AsyncIterator(generator, PromiseImpl) {
                            function invoke(method, arg, resolve, reject) {
                                var record = tryCatch(generator[method], generator, arg);
                                if ("throw" !== record.type) {
                                    var result = record.arg, value = result.value;
                                    return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then((function(value) {
                                        invoke("next", value, resolve, reject);
                                    }), (function(err) {
                                        invoke("throw", err, resolve, reject);
                                    })) : PromiseImpl.resolve(value).then((function(unwrapped) {
                                        result.value = unwrapped, resolve(result);
                                    }), (function(error) {
                                        return invoke("throw", error, resolve, reject);
                                    }));
                                }
                                reject(record.arg);
                            }
                            var previousPromise;
                            defineProperty(this, "_invoke", {
                                value: function value(method, arg) {
                                    function callInvokeWithMethodAndArg() {
                                        return new PromiseImpl((function(resolve, reject) {
                                            invoke(method, arg, resolve, reject);
                                        }));
                                    }
                                    return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
                                }
                            });
                        }
                        function makeInvokeMethod(innerFn, self, context) {
                            var state = "suspendedStart";
                            return function(method, arg) {
                                if ("executing" === state) throw new Error("Generator is already running");
                                if ("completed" === state) {
                                    if ("throw" === method) throw arg;
                                    return doneResult();
                                }
                                for (context.method = method, context.arg = arg; ;) {
                                    var delegate = context.delegate;
                                    if (delegate) {
                                        var delegateResult = maybeInvokeDelegate(delegate, context);
                                        if (delegateResult) {
                                            if (delegateResult === ContinueSentinel) continue;
                                            return delegateResult;
                                        }
                                    }
                                    if ("next" === context.method) context.sent = context._sent = context.arg; else if ("throw" === context.method) {
                                        if ("suspendedStart" === state) throw state = "completed", context.arg;
                                        context.dispatchException(context.arg);
                                    } else "return" === context.method && context.abrupt("return", context.arg);
                                    state = "executing";
                                    var record = tryCatch(innerFn, self, context);
                                    if ("normal" === record.type) {
                                        if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
                                        return {
                                            value: record.arg,
                                            done: context.done
                                        };
                                    }
                                    "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
                                }
                            };
                        }
                        function maybeInvokeDelegate(delegate, context) {
                            var method = delegate.iterator[context.method];
                            if (undefined === method) {
                                if (context.delegate = null, "throw" === context.method) {
                                    if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, 
                                    maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
                                    context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
                                }
                                return ContinueSentinel;
                            }
                            var record = tryCatch(method, delegate.iterator, context.arg);
                            if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, 
                            context.delegate = null, ContinueSentinel;
                            var info = record.arg;
                            return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, 
                            "return" !== context.method && (context.method = "next", context.arg = undefined), 
                            context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), 
                            context.delegate = null, ContinueSentinel);
                        }
                        function pushTryEntry(locs) {
                            var entry = {
                                tryLoc: locs[0]
                            };
                            1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], 
                            entry.afterLoc = locs[3]), this.tryEntries.push(entry);
                        }
                        function resetTryEntry(entry) {
                            var record = entry.completion || {};
                            record.type = "normal", delete record.arg, entry.completion = record;
                        }
                        function Context(tryLocsList) {
                            this.tryEntries = [ {
                                tryLoc: "root"
                            } ], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
                        }
                        function values(iterable) {
                            if (iterable) {
                                var iteratorMethod = iterable[iteratorSymbol];
                                if (iteratorMethod) return iteratorMethod.call(iterable);
                                if ("function" == typeof iterable.next) return iterable;
                                if (!isNaN(iterable.length)) {
                                    var i = -1, next = function next() {
                                        for (;++i < iterable.length; ) {
                                            if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
                                        }
                                        return next.value = undefined, next.done = !0, next;
                                    };
                                    return next.next = next;
                                }
                            }
                            return {
                                next: doneResult
                            };
                        }
                        function doneResult() {
                            return {
                                value: undefined,
                                done: !0
                            };
                        }
                        return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
                            value: GeneratorFunctionPrototype,
                            configurable: !0
                        }), defineProperty(GeneratorFunctionPrototype, "constructor", {
                            value: GeneratorFunction,
                            configurable: !0
                        }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), 
                        exports.isGeneratorFunction = function(genFun) {
                            var ctor = "function" == typeof genFun && genFun.constructor;
                            return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
                        }, exports.mark = function(genFun) {
                            return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, 
                            define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), 
                            genFun;
                        }, exports.awrap = function(arg) {
                            return {
                                __await: arg
                            };
                        }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, (function() {
                            return this;
                        })), exports.AsyncIterator = AsyncIterator, exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
                            void 0 === PromiseImpl && (PromiseImpl = Promise);
                            var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
                            return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then((function(result) {
                                return result.done ? result.value : iter.next();
                            }));
                        }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, (function() {
                            return this;
                        })), define(Gp, "toString", (function() {
                            return "[object Generator]";
                        })), exports.keys = function(val) {
                            var object = Object(val), keys = [];
                            for (var key in object) {
                                keys.push(key);
                            }
                            return keys.reverse(), function next() {
                                for (;keys.length; ) {
                                    var key = keys.pop();
                                    if (key in object) return next.value = key, next.done = !1, next;
                                }
                                return next.done = !0, next;
                            };
                        }, exports.values = values, Context.prototype = {
                            constructor: Context,
                            reset: function reset(skipTempReset) {
                                if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, 
                                this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), 
                                !skipTempReset) for (var name in this) {
                                    "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
                                }
                            },
                            stop: function stop() {
                                this.done = !0;
                                var rootRecord = this.tryEntries[0].completion;
                                if ("throw" === rootRecord.type) throw rootRecord.arg;
                                return this.rval;
                            },
                            dispatchException: function dispatchException(exception) {
                                if (this.done) throw exception;
                                var context = this;
                                function handle(loc, caught) {
                                    return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", 
                                    context.arg = undefined), !!caught;
                                }
                                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                    var entry = this.tryEntries[i], record = entry.completion;
                                    if ("root" === entry.tryLoc) return handle("end");
                                    if (entry.tryLoc <= this.prev) {
                                        var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc");
                                        if (hasCatch && hasFinally) {
                                            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
                                            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
                                        } else if (hasCatch) {
                                            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
                                        } else {
                                            if (!hasFinally) throw new Error("try statement without catch or finally");
                                            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
                                        }
                                    }
                                }
                            },
                            abrupt: function abrupt(type, arg) {
                                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                    var entry = this.tryEntries[i];
                                    if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                                        var finallyEntry = entry;
                                        break;
                                    }
                                }
                                finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
                                var record = finallyEntry ? finallyEntry.completion : {};
                                return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", 
                                this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
                            },
                            complete: function complete(record, afterLoc) {
                                if ("throw" === record.type) throw record.arg;
                                return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, 
                                this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), 
                                ContinueSentinel;
                            },
                            finish: function finish(finallyLoc) {
                                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                    var entry = this.tryEntries[i];
                                    if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), 
                                    resetTryEntry(entry), ContinueSentinel;
                                }
                            },
                            catch: function _catch(tryLoc) {
                                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                    var entry = this.tryEntries[i];
                                    if (entry.tryLoc === tryLoc) {
                                        var record = entry.completion;
                                        if ("throw" === record.type) {
                                            var thrown = record.arg;
                                            resetTryEntry(entry);
                                        }
                                        return thrown;
                                    }
                                }
                                throw new Error("illegal catch attempt");
                            },
                            delegateYield: function delegateYield(iterable, resultName, nextLoc) {
                                return this.delegate = {
                                    iterator: values(iterable),
                                    resultName,
                                    nextLoc
                                }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
                            }
                        }, exports;
                    }
                    module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;
                },
                "./node_modules/@babel/runtime/helpers/typeof.js": module => {
                    "use strict";
                    function _typeof(obj) {
                        "@babel/helpers - typeof";
                        return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                            return typeof obj;
                        } : function(obj) {
                            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                        }, module.exports.__esModule = true, module.exports["default"] = module.exports, 
                        _typeof(obj);
                    }
                    module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
                },
                "./node_modules/@babel/runtime/regenerator/index.js": (module, __unused_webpack_exports, __webpack_require__) => {
                    "use strict";
                    var runtime = __webpack_require__("./node_modules/@babel/runtime/helpers/regeneratorRuntime.js")();
                    module.exports = runtime;
                    try {
                        regeneratorRuntime = runtime;
                    } catch (accidentalStrictMode) {
                        if (typeof globalThis === "object") {
                            globalThis.regeneratorRuntime = runtime;
                        } else {
                            Function("r", "regeneratorRuntime = r")(runtime);
                        }
                    }
                },
                "./src/manifest.json": module => {
                    "use strict";
                    module.exports = JSON.parse('{"package":"org.hapjs.demo.sample","name":"快应用组件展示","versionName":"1.0.3","versionCode":103,"icon":"/common/logo.png","features":[{"name":"system.webview"},{"name":"system.prompt"},{"name":"system.clipboard"},{"name":"system.calendar"},{"name":"system.device"},{"name":"system.fetch"},{"name":"system.file"},{"name":"system.geolocation"},{"name":"system.image"},{"name":"system.media"},{"name":"system.notification"},{"name":"system.barcode"},{"name":"system.sensor"},{"name":"system.share"},{"name":"system.shortcut"},{"name":"system.storage"},{"name":"system.vibrator"},{"name":"system.network"},{"name":"system.request"},{"name":"system.audio"},{"name":"system.volume"},{"name":"system.battery"},{"name":"system.brightness"},{"name":"system.package"},{"name":"system.record"},{"name":"system.sms"},{"name":"system.websocketfactory"},{"name":"system.wifi"},{"name":"system.animation"},{"name":"service.stats"},{"name":"service.account"},{"name":"system.contact"},{"name":"service.app"},{"name":"service.share","params":{"appSign":"","wxKey":""}},{"name":"service.pay"},{"name":"service.alipay"},{"name":"service.wxpay","params":{"url":"","package":"","sign":""}},{"name":"service.push","params":{"appId":"","appKey":""}},{"name":"service.wxaccount","params":{"appId":"xxx","package":"xxx","sign":"xxx"}},{"name":"service.qqaccount","params":{"package":"xxx","appId":"xxx","sign":"xxx","clientId":"xxx"}},{"name":"service.wbaccount","params":{"sign":"","appKey":""}}],"permissions":[{"origin":"*"}],"config":{"logLevel":"debug","data":{"back":"false"}},"router":{"entry":"home","pages":{"home":{"component":"index"},"component/basic/a":{"component":"index"},"component/media/web/detail":{"component":"index"},"component/media/web":{"component":"index"},"component/container/div":{"component":"index"},"component/basic/image":{"component":"index"},"component/form/input":{"component":"index"},"component/form/label":{"component":"index"},"component/container/list":{"component":"index"},"component/form/picker":{"component":"index"},"component/form/multi-picker":{"component":"index"},"component/basic/progress":{"component":"index"},"component/container/popup":{"component":"index"},"component/container/refresh":{"component":"index"},"component/container/richtext":{"component":"index"},"component/form/slider":{"component":"index"},"component/basic/span":{"component":"index"},"component/container/stack":{"component":"index"},"component/container/swiper":{"component":"index"},"component/form/switch":{"component":"index"},"component/container/tabs":{"component":"index"},"component/basic/text":{"component":"index"},"component/basic/rating":{"component":"index"},"component/form/textarea":{"component":"index"},"component/media/video":{"component":"index"},"component/media/canvas":{"component":"index"},"component/media/audio":{"component":"index"},"component/thirdParty/map":{"component":"index"},"framework/deeplink":{"component":"index"},"framework/lifecycle":{"component":"index"},"framework/exit":{"component":"index"},"framework/exit/pages/page1":{"component":"index","path":"/exit/page1"},"framework/exit/pages/page2":{"component":"index","path":"/exit/page2"},"framework/exit/pages/page3":{"component":"index","path":"/exit/page3"},"interface/thirdparty/alipay":{"component":"index"},"interface/thirdparty/wxpay":{"component":"index"},"interface/thirdparty/serviceshare":{"component":"index"},"interface/thirdparty/wxaccount":{"component":"index"},"interface/thirdparty/qqaccount":{"component":"index"},"interface/thirdparty/wbaccount":{"component":"index"},"interface/system/brightness":{"component":"index"},"interface/system/calendar":{"component":"index"},"interface/system/clipboard":{"component":"index"},"interface/system/device":{"component":"index"},"interface/system/app":{"component":"index"},"interface/system/fetch":{"component":"index"},"interface/system/file":{"component":"index"},"interface/system/filerw":{"component":"index"},"interface/system/geolocation":{"component":"index"},"interface/system/image":{"component":"index"},"interface/system/media":{"component":"index"},"interface/system/network":{"component":"index"},"interface/system/notification":{"component":"index"},"interface/system/prompt":{"component":"index"},"interface/system/package":{"component":"index"},"interface/system/forbid":{"component":"index"},"interface/system/qrcode":{"component":"index"},"interface/system/request":{"component":"index"},"interface/system/router":{"component":"index"},"interface/system/router/detail":{"component":"index"},"interface/system/record":{"component":"index"},"interface/system/sensor":{"component":"index"},"interface/system/share":{"component":"index"},"interface/system/shortcut":{"component":"index"},"interface/system/storage":{"component":"index"},"interface/system/vibrator":{"component":"index"},"interface/system/volume":{"component":"index"},"interface/system/battery":{"component":"index"},"interface/system/webview":{"component":"index"},"interface/system/sms":{"component":"index"},"interface/system/contact":{"component":"index"},"interface/system/websocket":{"component":"index"},"interface/system/wifi":{"component":"index"},"component/style/animation":{"component":"index"},"component/style/transform":{"component":"index"},"component/style/translatepercent":{"component":"index"},"component/style/backgroundposition":{"component":"index"},"component/style/background9image":{"component":"index"},"component/style/font-family":{"component":"index"},"functionality/animationapi":{"component":"index"},"functionality/changestyle":{"component":"index"},"functionality/form":{"component":"index"},"functionality/menutop":{"component":"index"},"functionality/ceiling":{"component":"index"},"functionality/photo":{"component":"index"},"functionality/h5download":{"component":"index"},"functionality/postMessage":{"component":"index"},"functionality/qrcode":{"component":"index"},"functionality/titlebar":{"component":"index"},"functionality/listcombination":{"component":"index"},"functionality/verification":{"component":"index"},"functionality/simulate-swipe":{"component":"index"},"functionality/template/elec-business":{"component":"index"},"functionality/customWeb":{"component":"index"},"functionality/web":{"component":"index"}}},"display":{"backgroundColor":"#fbf9fe","titleBar":true,"titleBarBackgroundColor":"#0faeff","titleBarTextColor":"#ffffff","pages":{"home":{"titleBarText":"快应用组件展示"},"component/media/web":{"titleBar":false},"framework/lifecycle":{"menu":true}},"windowSoftInputMode":"adjustResize"}}');
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
            (() => {
                __webpack_require__.g = function() {
                    if (typeof globalThis === "object") return globalThis;
                    try {
                        return this || new Function("return this")();
                    } catch (e) {
                        if (typeof window === "object") return window;
                    }
                }();
            })();
            var __webpack_exports__ = {};
            (() => {
                var $app_style$ = {};
                var $app_script$ = __webpack_require__("../../packages/hap-dsl-xvm/lib/loaders/script-loader.js!../../packages/hap-packager/lib/loaders/module-loader.js!../../packages/hap-packager/lib/loaders/manifest-loader.js?path=<project-root>/src!../../node_modules/babel-loader/lib/index.js?cwd=<project-root>&cacheDirectory&comments=false&configFile=<project-root>/babel.config.js!../../packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/app.ux?uxType=app");
                $app_define$("@app-application/app", [], (function($app_require$, $app_exports$, $app_module$) {
                    $app_script$($app_module$, $app_exports$, $app_require$);
                    if ($app_exports$.__esModule && $app_exports$.default) {
                        $app_module$.exports = $app_exports$.default;
                    }
                    $app_module$.exports.manifest = __webpack_require__("./src/manifest.json");
                    $app_module$.exports.style = {
                        list: [ $app_style$ ]
                    };
                }));
                $app_bootstrap$("@app-application/app", {
                    packagerVersion: "<VERSION>"
                });
            })();
        })();
    };
    if (typeof window === "undefined") {
        return createAppHandler();
    } else {
        window.createAppHandler = createAppHandler;
        global.manifest = manifestJson;
    }
})();