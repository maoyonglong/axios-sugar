'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isDef(value) {
    return typeof value !== 'undefined';
}
function isStr(value) {
    return typeof value === 'string';
}
function getDurationMS(a, b) {
    return a - b;
}

var AxiosSugarConfig = (function () {
    function AxiosSugarConfig(options) {
        this.isResend = false;
        this.resendDelay = 1000;
        this.resendTimes = 3;
        this.isSave = false;
        this.prop = 'custom';
        options = options || {};
        for (var _i = 0, _a = Object.keys(options); _i < _a.length; _i++) {
            var key = _a[_i];
            if (isDef(key)) {
                this[key] = options[key];
            }
            else {
                console.error("[axios sugar]: the option " + key + " is not valid.");
            }
        }
    }
    return AxiosSugarConfig;
}());

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var ECMA_SIZES = {
    STRING: 2,
    BOOLEAN: 4,
    NUMBER: 8
};

var isBrowser = typeof window !== 'undefined';
var Buffer;
if (!isBrowser) {
    Buffer = require('buffer').Buffer;
}
function sizeOfObject(seen, object) {
    if (object == null) {
        return 0;
    }
    var bytes = 0;
    for (var key in object) {
        if (typeof object[key] === 'object' && object[key] !== null) {
            if (seen.has(object[key])) {
                continue;
            }
            seen.add(object[key]);
        }
        bytes += getCalculator(seen)(key);
        try {
            bytes += getCalculator(seen)(object[key]);
        }
        catch (ex) {
            if (ex instanceof RangeError) {
                bytes = 0;
            }
        }
    }
    return bytes;
}
function getCalculator(seen) {
    return function (object) {
        if (!isBrowser && Buffer.isBuffer(object)) {
            return object.length;
        }
        var objectType = typeof (object);
        switch (objectType) {
            case 'string':
                return object.length * ECMA_SIZES.STRING;
            case 'boolean':
                return ECMA_SIZES.BOOLEAN;
            case 'number':
                return ECMA_SIZES.NUMBER;
            case 'object':
                if (Array.isArray(object)) {
                    return object.map(getCalculator(seen)).reduce(function (acc, curr) {
                        return acc + curr;
                    }, 0);
                }
                else {
                    return sizeOfObject(seen, object);
                }
            default:
                return 0;
        }
    };
}
function sizeof(object) {
    return getCalculator(new WeakSet())(object);
}

var AxiosSugarInnerStorage = (function () {
    function AxiosSugarInnerStorage() {
        this.data = {};
    }
    AxiosSugarInnerStorage.prototype.set = function (symbol, res) {
        this.data[symbol] = res;
    };
    AxiosSugarInnerStorage.prototype.get = function (symbol) {
        return this.data[symbol] || null;
    };
    AxiosSugarInnerStorage.prototype.contains = function (symbol) {
        return typeof this.data[symbol] !== 'undefined';
    };
    return AxiosSugarInnerStorage;
}());
var AxiosSugarInnerReleaseStorage = (function (_super) {
    __extends(AxiosSugarInnerReleaseStorage, _super);
    function AxiosSugarInnerReleaseStorage(duration, limit) {
        var _this = _super.call(this) || this;
        _this.duration = 5 * 60 * 1000;
        _this.limit = 15 * 1024 * 1024;
        if (isDef(duration))
            _this.duration = duration;
        if (isDef(limit))
            _this.limit = limit;
        return _this;
    }
    AxiosSugarInnerReleaseStorage.prototype.set = function (symbol, res) {
        var data = this.data;
        for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], item = _b[1];
            if (getDurationMS(new Date().getTime(), item.time) >= this.duration) {
                delete data[key];
            }
        }
        if (sizeof(res) + sizeof(data) > this.limit) {
            data = this.data = {};
        }
        data[symbol] = {
            data: res,
            time: new Date().getTime()
        };
    };
    AxiosSugarInnerReleaseStorage.prototype.get = function (symbol) {
        var target = this.data[symbol];
        return target ? target.data : null;
    };
    return AxiosSugarInnerReleaseStorage;
}(AxiosSugarInnerStorage));
var AxiosSugarLocalStorage = (function () {
    function AxiosSugarLocalStorage() {
    }
    AxiosSugarLocalStorage.prototype.set = function (symbol, res) {
        try {
            localStorage.setItem(symbol, JSON.stringify(res));
        }
        catch (err) {
            console.error("[axios-sugar]: " + err.message);
        }
    };
    AxiosSugarLocalStorage.prototype.get = function (symbol) {
        var data = localStorage.getItem(symbol);
        return data === null ? null : JSON.parse(data);
    };
    AxiosSugarLocalStorage.prototype.contains = function (symbol) {
        return this.get(symbol) !== null;
    };
    return AxiosSugarLocalStorage;
}());

var Stack = (function () {
    function Stack() {
        this.stack = [];
    }
    Stack.prototype.push = function (el) {
        return this.stack.push(el);
    };
    Stack.prototype.pop = function () {
        return this.stack.pop();
    };
    Stack.prototype.contains = function (el) {
        return this.stack.indexOf(el) >= 0;
    };
    Stack.prototype.remove = function (el) {
        return this.stack.splice(this.indexOf(el), 1)[0];
    };
    Stack.prototype.indexOf = function (el) {
        return this.stack.indexOf(el);
    };
    return Stack;
}());
var AxiosSugarRequestStack = (function (_super) {
    __extends(AxiosSugarRequestStack, _super);
    function AxiosSugarRequestStack() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AxiosSugarRequestStack.prototype.forEach = function (cb) {
        this.stack.forEach(function (conf, confIdx, thisArg) {
            cb.call(conf, conf, confIdx, thisArg);
        });
    };
    return AxiosSugarRequestStack;
}(Stack));
var AxiosStack = (function (_super) {
    __extends(AxiosStack, _super);
    function AxiosStack() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AxiosStack;
}(Stack));

function sendDataWay(method) {
    var isInData = ['post', 'put', 'patch'].indexOf(method) >= 0, isInParams = method === 'get';
    return isInData ? 'data' : (isInParams ? 'params' : 'both');
}
function normalizeProp(config, prop) {
    if (prop === void 0) { prop = 'custom'; }
    if (sendDataWay(config.method) === 'data' && config.data) {
        var propVal = config.data[prop];
        if (propVal) {
            config[prop] = propVal;
            delete config.data[prop];
        }
    }
    return config;
}
function genSymbol(config) {
    var url = config.url;
    var method = config.method;
    var data;
    function getParamsSymbolData(params) {
        var data = '';
        if (/\?/.test(url)) {
            var part = url.split('?');
            url = part[0];
            data += part[1];
        }
        if (params) {
            for (var _i = 0, _a = Object.entries(params); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], val = _b[1];
                if (data !== '')
                    data += '&';
                data += key + "=" + val;
            }
        }
        return data;
    }
    function getDataSymbolData(data) {
        return isDef(data) ? JSON.stringify(data) : '';
    }
    switch (sendDataWay(method)) {
        case 'params':
            data = getParamsSymbolData(config.params);
            break;
        case 'data':
            data = getDataSymbolData(config.data);
            break;
        case 'both':
            data = getParamsSymbolData(config.params) || getDataSymbolData(config.params);
    }
    return "method=" + method + "&url=" + url + "&data=" + data;
}
function notUndef(targetVal, defaultVal) {
    return typeof targetVal === 'undefined' ? defaultVal : targetVal;
}

function responseInterceptors (sugar, stack) {
    var axios = sugar.axios;
    var storage = sugar.storage;
    var conf = sugar.config;
    var lifecycle = sugar.lifecycle;
    var error;
    axios.interceptors.response.use(function (res) {
        var config = res.config;
        var resData = res.data;
        var cycleRes = lifecycle.beforeResponse(res);
        if (!cycleRes.state) {
            error = { reason: 'beforeResponseBreak', message: cycleRes.message };
            return Promise.reject(error);
        }
        if (config) {
            stack.remove(config);
        }
        var custom = config.custom;
        var isSave;
        if (custom) {
            isSave = notUndef(custom.isSave, conf.isSave);
        }
        if (isSave) {
            var symbol = genSymbol(config);
            storage.set(symbol, resData);
        }
        return Promise.resolve(resData);
    }, function (err) {
        var reason = err.reason;
        if (reason) {
            return reason === 'saved' ? Promise.resolve(err.data) : Promise.reject(err);
        }
        var config = err.config;
        if (config) {
            stack.remove(config);
            var custom_1 = config[conf.prop];
            var isResend = conf.isResend, resendDelay_1 = conf.resendDelay, resendTimes = conf.resendTimes, curResendTimes_1 = 0;
            if (custom_1) {
                isResend = notUndef(custom_1.isResend, isResend);
                resendDelay_1 = notUndef(custom_1.resendDelay, resendDelay_1);
                resendTimes = notUndef(custom_1.resendTimes, resendTimes);
                curResendTimes_1 = notUndef(custom_1.curResendTimes, 0);
            }
            if (isResend) {
                if (curResendTimes_1 < resendTimes) {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            if (!custom_1) {
                                config.custom = {};
                            }
                            config.custom.curResendTimes = ++curResendTimes_1;
                            if (isStr(config.data)) {
                                config.data = JSON.parse(config.data);
                            }
                            return resolve(axios.request(config));
                        }, resendDelay_1);
                    });
                }
                else {
                    error = { reason: 'resendEnd', message: "Can't get a response." };
                    return Promise.reject(error);
                }
            }
            else {
                return Promise.reject(err);
            }
        }
    });
}

function requestInterceptors (sugar, stack) {
    var axios = sugar.axios;
    var storage = sugar.storage;
    var conf = sugar.config;
    var lifecycle = sugar.lifecycle;
    var error;
    axios.interceptors.request.use(function (config) {
        config = normalizeProp(config, conf.prop);
        if (stack.contains(config)) {
            error = { reason: 'existed' };
            return Promise.reject(error);
        }
        var custom = config[conf.prop];
        var isSave = conf.isSave;
        if (custom) {
            isSave = notUndef(custom.isSave, isSave);
        }
        if (isSave) {
            var storageRes = storage.get(genSymbol(config));
            if (storageRes) {
                error = { reason: 'saved', data: storageRes };
                return Promise.reject(error);
            }
        }
        var cycleRes = lifecycle.beforeRequest(config);
        if (!cycleRes.state) {
            error = { reason: 'beforeRequestBreak', message: cycleRes.message };
            return Promise.reject(error);
        }
        stack.push(config);
        return Promise.resolve(config);
    }, function (err) {
        Promise.reject(err);
    });
}

var AxiosSugarLifeCycle = (function () {
    function AxiosSugarLifeCycle() {
    }
    AxiosSugarLifeCycle.prototype.beforeRequest = function (conf) {
        return {
            state: true,
            message: ''
        };
    };
    AxiosSugarLifeCycle.prototype.beforeResponse = function (res) {
        return {
            state: true,
            message: ''
        };
    };
    return AxiosSugarLifeCycle;
}());

var AxiosSugar = (function () {
    function AxiosSugar(axios, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.stack = new AxiosSugarRequestStack();
        this.config = new AxiosSugarConfig();
        this.storage = new AxiosSugarInnerStorage();
        this.lifecycle = new AxiosSugarLifeCycle();
        this.axios = axios;
        ['config', 'storage', 'lifecycle'].forEach(function (option) {
            if (options[option]) {
                _this[option] = options[option];
            }
        });
        this.init();
    }
    AxiosSugar.prototype.init = function () {
        requestInterceptors(this, this.stack);
        responseInterceptors(this, this.stack);
    };
    return AxiosSugar;
}());
var usedAxios = new AxiosStack();
function factory(axios, options) {
    if (options === void 0) { options = {}; }
    if (usedAxios.contains(axios)) {
        console.error('[axios-sugar]: an axios static or instance only can call factory once.');
    }
    else {
        usedAxios.push(axios);
        return new AxiosSugar(axios, options);
    }
}

exports.AxiosSugarConfig = AxiosSugarConfig;
exports.AxiosSugarInnerReleaseStorage = AxiosSugarInnerReleaseStorage;
exports.AxiosSugarInnerStorage = AxiosSugarInnerStorage;
exports.AxiosSugarLifeCycle = AxiosSugarLifeCycle;
exports.AxiosSugarLocalStorage = AxiosSugarLocalStorage;
exports.default = factory;
