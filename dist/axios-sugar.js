var AxiosSugar = (function (exports, axios) {
    'use strict';

    axios = axios && Object.prototype.hasOwnProperty.call(axios, 'default') ? axios['default'] : axios;

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

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function isArray(val) {
        return toString.call(val) === '[object Array]';
    }
    function forEach(obj, fn) {
        if (obj === null || typeof obj === 'undefined') {
            return;
        }
        if (typeof obj !== 'object') {
            obj = [obj];
        }
        if (isArray(obj)) {
            for (var i = 0, l = obj.length; i < l; i++) {
                fn.call(null, obj[i], i, obj);
            }
        }
        else {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    fn.call(null, obj[key], key, obj);
                }
            }
        }
    }
    function merge() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var result = {};
        function assignValue(val, key) {
            if (typeof result[key] === 'object' && typeof val === 'object') {
                result[key] = merge(result[key], val);
            }
            else {
                result[key] = val;
            }
        }
        for (var i = 0, l = arguments.length; i < l; i++) {
            forEach(args[i], assignValue);
        }
        return result;
    }
    function deepMerge() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var result = {};
        function assignValue(val, key) {
            if (typeof result[key] === 'object' && typeof val === 'object') {
                result[key] = deepMerge(result[key], val);
            }
            else if (typeof val === 'object') {
                result[key] = deepMerge({}, val);
            }
            else {
                result[key] = val;
            }
        }
        for (var i = 0, l = arguments.length; i < l; i++) {
            forEach(args[i], assignValue);
        }
        return result;
    }

    function capitalize(str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
    function isDef(value) {
        return typeof value !== 'undefined';
    }
    function isStr(value) {
        return typeof value === 'string';
    }
    function isError(value) {
        return value instanceof Error;
    }
    function getDurationMS(a, b) {
        return a - b;
    }
    function customMessage(msg) {
        return "[axios-sugar]: " + msg + ".";
    }
    function warn(msg) {
        console.warn(customMessage(msg));
    }
    function error(msg) {
        console.error(customMessage(msg));
    }
    function throwError(msg) {
        throw new Error(customMessage(msg));
    }
    function isDev() {
        return process.env.NODE_ENV === 'development';
    }
    function isFn(val) {
        return typeof val === 'function';
    }
    function isNum(val) {
        return typeof val === 'number';
    }
    function deepMerge$1() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return deepMerge.apply(null, args);
    }
    function merge$1() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return merge.apply(null, args);
    }
    function isOnline(options) {
        return navigator.onLine;
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

    var innerStorageDefaults = {
        release: false,
        duration: 5 * 60 * 1000,
        limit: 15 * 1024 * 1024
    };
    var AxiosSugarInnerStorage = (function () {
        function AxiosSugarInnerStorage(config) {
            this.data = {};
            this.config = config ? merge$1(innerStorageDefaults, config) : innerStorageDefaults;
        }
        AxiosSugarInnerStorage.prototype.release = function (tag, data) {
            if (this.config.release && isDef(this.data[tag])) {
                if (this.config.duration) {
                    var time = this.data[tag].time;
                    if (getDurationMS(new Date().getTime(), time) >= this.config.duration) {
                        this.data[tag] = undefined;
                    }
                }
                else if (isDef(data) &&
                    sizeof(this.data) + sizeof(data) > this.config.limit) {
                    if (isFn(this.full)) {
                        this.full(tag, data);
                    }
                }
            }
        };
        AxiosSugarInnerStorage.prototype.full = function (tag, data) {
            throwError('The capacity of the storage is full');
        };
        AxiosSugarInnerStorage.prototype.set = function (tag, data) {
            try {
                this.release(tag, data);
                this.data[tag] = data;
                return true;
            }
            catch (err) {
                if (isDev()) {
                    error(err.message);
                }
                return false;
            }
        };
        AxiosSugarInnerStorage.prototype.get = function (tag) {
            this.release(tag);
            return this.data[tag] || null;
        };
        return AxiosSugarInnerStorage;
    }());
    var AxiosSugarLocalStorage = (function () {
        function AxiosSugarLocalStorage() {
            this.data = {};
        }
        AxiosSugarLocalStorage.prototype.set = function (tag, data) {
            try {
                localStorage.setItem(tag, JSON.stringify(data));
                return true;
            }
            catch (err) {
                if (isDev()) {
                    error(err.message);
                }
                return false;
            }
        };
        AxiosSugarLocalStorage.prototype.get = function (tag) {
            var data = localStorage.getItem(tag);
            return data === null ? null : JSON.parse(data);
        };
        return AxiosSugarLocalStorage;
    }());

    var defaults = {
        repeat: {
            interval: 2000
        },
        onlineCheck: {
            enable: false,
            reconnect: {
                enable: true
            }
        },
        save: {
            enable: false,
            storage: new AxiosSugarInnerStorage()
        },
        retry: {
            enable: false,
            auto: true,
            count: 3,
            delay: 2000
        },
        cancelDisabled: false
    };

    var AxiosSugarInterceptorManager = (function () {
        function AxiosSugarInterceptorManager() {
            this.handlers = [];
        }
        AxiosSugarInterceptorManager.prototype.use = function (fulfilled, rejected) {
            this.handlers.push({
                fulfilled: fulfilled,
                rejected: rejected
            });
            return this.handlers.length - 1;
        };
        AxiosSugarInterceptorManager.prototype.eject = function (i) {
            if (this.handlers[i]) {
                this.handlers[i] = null;
            }
        };
        AxiosSugarInterceptorManager.prototype.each = function (fn) {
            this.handlers.forEach(function (handler) {
                if (handler !== null) {
                    fn(handler);
                }
            });
        };
        return AxiosSugarInterceptorManager;
    }());

    var MiddleData = (function () {
        function MiddleData() {
            this.tags = [];
            this.cancels = [];
            this.configs = [];
        }
        MiddleData.getInstance = function () {
            return MiddleData.instance;
        };
        MiddleData.instance = new MiddleData();
        return MiddleData;
    }());
    var middleData = MiddleData.getInstance();
    function dataDestory(index) {
        middleData.configs[index] = null;
        if (middleData.tags[index] !== null) {
            middleData.tags[index] = null;
            middleData.cancels[index] = null;
        }
    }

    var storage = {
        get: function (config) {
            var save = config.sugar.save;
            if (save.enable) {
                var storage = save.storage;
                var tag = middleData.tags[config.index];
                if (tag !== null) {
                    return storage.get(tag);
                }
            }
            return null;
        },
        set: function (config) {
            var save = config.sugar.save;
            if (save.enable) {
                var storage = save.storage;
                var tag = middleData.tags[config.index];
                if (tag !== null) {
                    storage.set(tag, {
                        response: config.response,
                        time: new Date().getTime()
                    });
                    return true;
                }
            }
            return false;
        }
    };

    var MiddleResponseError = (function (_super) {
        __extends(MiddleResponseError, _super);
        function MiddleResponseError(reason, config) {
            var _newTarget = this.constructor;
            var _this = _super.call(this, reason.message) || this;
            _this.name = _newTarget.name;
            if (typeof Error.captureStackTrace === 'function') {
                Error.captureStackTrace(_this, (_newTarget));
            }
            if (typeof Object.setPrototypeOf === 'function') {
                Object.setPrototypeOf(_this, _newTarget.prototype);
            }
            else {
                _this.__proto__ = _newTarget.prototype;
            }
            _this.reason = reason;
            _this.axios = config.axios;
            _this.index = config.index;
            _this.sugar = config.sugar;
            _this.count = config.count;
            _this.sendingTime = config.sendingTime;
            _this.completeTime = config.completeTime;
            _this.isAxiosSugarError = true;
            return _this;
        }
        return MiddleResponseError;
    }(Error));
    function dispatchRequest (config) {
        var cache = config.sugar.save.enable ? storage.get(config) : null;
        config.sendingTime = new Date().getTime();
        if (cache !== null) {
            return Promise.resolve({
                response: cache.response,
                sugar: config.sugar,
                index: config.index,
                sendingTime: config.sendingTime,
                cacheTime: cache.time,
                completeTime: new Date().getTime()
            });
        }
        else {
            return this.axios.request(config.axios).then(function (response) {
                config.completeTime = new Date().getTime();
                return {
                    response: response,
                    sugar: config.sugar,
                    index: config.index,
                    sendingTime: config.sendingTime,
                    completeTime: config.completeTime
                };
            }, function (reason) {
                config.completeTime = new Date().getTime();
                var error = new MiddleResponseError(reason, config);
                return Promise.reject(error);
            });
        }
    }

    function sendDataWay(method) {
        var isInData = ['post', 'put', 'patch'].indexOf(method) >= 0;
        return isInData ? 'data' : 'params';
    }
    function querystring(url) {
        var result = {};
        var index = url.indexOf('?');
        if (index >= 0) {
            var arr = url.trim().substring(url.indexOf()).split('&');
            arr.forEach(function (item) {
                var arr = item.trim().split('=');
                if (arr.length === 1) {
                    result[arr[0]] = '';
                }
                else {
                    result[arr[0]] = result[arr[1]];
                }
            });
        }
        return result;
    }
    function getDataString(data) {
        return data ? JSON.stringify(data) : '';
    }
    function genSymbol(config) {
        var url = config.url;
        var method = config.method;
        var data;
        switch (sendDataWay(method)) {
            case 'params': {
                data = config.params || {};
                if (method === 'get') {
                    data = deepMerge$1(querystring(url), data);
                }
                data = getDataString(data);
                break;
            }
            case 'data': data = getDataString(config.data);
        }
        return "method=" + method + "&url=" + url + "&data=" + data;
    }
    function isInInterval(sendingTime, completeTime, interval) {
        return getDurationMS(completeTime, sendingTime) < interval;
    }
    function repeatTag(axiosConfig, config) {
        return genSymbol(axiosConfig);
    }
    function repeat (config) {
        var _this = this;
        var tag = SugarStatic.repeatTag(config.axios, config.sugar);
        var i = middleData.tags.indexOf(tag);
        if (i >= 0 &&
            middleData.configs[i].sendingTime &&
            !isInInterval(middleData.configs[i].sendingTime, new Date().getTime(), config.sugar.repeat.interval)) {
            dataDestory(i);
            i = -1;
        }
        var callRepeated = function () {
            var repeated = _this.events['repeated'];
            if (isFn(repeated)) {
                repeated.call(_this, config);
            }
        };
        if (i >= 0) {
            if (middleData.configs[i] && middleData.configs[i].completeTime) {
                callRepeated();
                throwError('The current request is repeated.');
            }
            else {
                middleData.cancels[i]('The previous request is repeated.');
                middleData.tags[i] = null;
                middleData.cancels[i] = null;
                callRepeated();
            }
        }
        var source = axios.CancelToken.source();
        config.axios.cancelToken = source.token;
        middleData.cancels.push(source.cancel);
        return middleData.tags.push(tag) - 1;
    }

    var ReasonError = (function (_super) {
        __extends(ReasonError, _super);
        function ReasonError(error) {
            var _newTarget = this.constructor;
            var _this = _super.call(this, error.message) || this;
            _this.name = _newTarget.name;
            if (typeof Error.captureStackTrace === 'function') {
                Error.captureStackTrace(_this, (_newTarget));
            }
            if (typeof Object.setPrototypeOf === 'function') {
                Object.setPrototypeOf(_this, _newTarget.prototype);
            }
            else {
                _this.__proto__ = _newTarget.prototype;
            }
            _this.reason = error;
            return _this;
        }
        return ReasonError;
    }(Error));
    function dataType(data) {
        if (isDef(data)) {
            if (data instanceof Promise) {
                return 'promise';
            }
            if (isError(data)) {
                if (isDef(data.reason)) {
                    return 'reasonError';
                }
                return 'error';
            }
        }
        else {
            return 'undefined';
        }
    }
    function transformSyncData(data) {
        switch (dataType(data)) {
            case 'undefined': return;
            case 'error': return new ReasonError(data);
            default: return data;
        }
    }
    var normalize = (function (data) {
        var result = transformSyncData(data);
        if (result instanceof Promise) {
            return result.then(function (data) { return transformSyncData(data); }, function (data) { return transformSyncData(data); });
        }
        else {
            return result;
        }
    });

    function initInterceptors(axiosSugar) {
        axiosSugar.interceptors.request.use(function (config) {
            middleData.configs.push(config);
            config.index = repeat.call(axiosSugar, config);
            return config;
        }, function (err) {
            return Promise.reject(err);
        });
        axiosSugar.interceptors.response.use(function (config) {
            if (storage.set(config)) {
                var stored = axiosSugar.events['stored'];
                if (isFn(stored)) {
                    stored.call(axiosSugar, config);
                }
            }
            if (!isInInterval(config.sendingTime, config.completeTime, config.sugar.repeat.interval)) {
                dataDestory(config.index);
            }
            return axiosSugar.httpStatusProcessor.dispatch(axiosSugar, config.response.status.toString(), config);
        }, function (err) {
            var result = err;
            if ((err.reason &&
                !isInInterval(err.sendingTime, err.completeTime, err.sugar.repeat.interval))) {
                dataDestory(err.index);
            }
            if (err.reason && err.reason.response) {
                result = axiosSugar.httpStatusProcessor.dispatch(axiosSugar, err.reason.response.status.toString(), err);
            }
            result = normalize(result);
            if (result instanceof Promise && err.count >= 1) {
                dataDestory(err.index);
            }
            return result instanceof Promise ? result : Promise.reject(result || err);
        });
    }

    function retryFn (err) {
        var _this = this;
        if (isNum(err.count)) {
            err.count += 1;
        }
        else {
            err.count = 1;
        }
        if (isNum(err.sugar.retry.count) &&
            err.count <= err.sugar.retry.count) {
            var retried = _this.events['retried'];
            if (retried) {
                retried.call(_this, err);
            }
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    reject(_this.request(err));
                }, err.sugar.retry.delay);
            });
        }
        else {
            var retryFailed = _this.events['retryFailed'];
            if (isFn(retryFailed)) {
                retryFailed.call(_this, err);
            }
            return new Error('[axios-sugar]: retryFiled.');
        }
    }

    var HttpStatusProcessorPrototype = (function () {
        function HttpStatusProcessorPrototype() {
            this.statusTable = {
                400: this.onBadRequest,
                401: this.onUnauthorized,
                403: this.onForbidden,
                404: this.onNotFound,
                405: this.onMethodNotAllow,
                406: this.onNotAcceptable,
                407: this.onProxyAuthenticationRequired,
                408: this.onTimeout,
                409: this.onConflict,
                500: this.onInternalServerError,
                501: this.onNotImplemented,
                502: this.onBadGateway
            };
            this.reservedCodes = Object.keys(this.statusTable);
        }
        HttpStatusProcessorPrototype.prototype.setStatusHandler = function (status, fn) {
            if (this.reservedCodes.indexOf(status) < 0) {
                this.statusTable[status] = fn;
                return true;
            }
            else if (isDev()) {
                error("can't set the handler of http status code " + status + ".");
            }
            return false;
        };
        HttpStatusProcessorPrototype.prototype.dispatch = function (axiosSugar, status, payload) {
            var firstCode = status.toString().substr(0, 1);
            var result = payload.response;
            var isRetried = false;
            var retriedRequest = undefined;
            var retry = (payload.reason &&
                payload.sugar.retry.enable) ? function () {
                if (!isRetried) {
                    isRetried = true;
                    retriedRequest = retryFn.call(axiosSugar, payload);
                    return true;
                }
                else if (isDev()) {
                    warn('retry has been already called');
                }
                return false;
            } : undefined;
            function handlerCall(fn, result) {
                return fn.call(axiosSugar, status, payload, result, retry);
            }
            if (isFn(this["on" + firstCode + "XXBefore"])) {
                result = handlerCall(this["on" + firstCode + "XXBefore"], result);
            }
            else if (isFn(this.onStatusBefore)) {
                result = handlerCall(this.onStatusBefore, result);
            }
            if (isFn(this.statusTable[status])) {
                result = handlerCall(this.statusTable[status], result);
            }
            if (isFn(this["on" + firstCode + "XXAfter"])) {
                result = handlerCall(this["on" + firstCode + "XXAfter"], result);
            }
            else if (isFn(this.onStatusAfter)) {
                result = handlerCall(this.onStatusAfter, result);
            }
            return retriedRequest || result;
        };
        return HttpStatusProcessorPrototype;
    }());
    var HttpStatusProcessor = (function (_super) {
        __extends(HttpStatusProcessor, _super);
        function HttpStatusProcessor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return HttpStatusProcessor;
    }(HttpStatusProcessorPrototype));
    var errorhandlers = [
        'BadRequest',
        'Unauthorized',
        'Forbidden',
        'NotFound',
        'MethodNotAllow',
        'NotAcceptable',
        'ProxyAuthenticationRequired',
        'Conflict',
        'InternalServerError',
        'NotImplemented',
        'BadGateway'
    ];
    function autoRetry(axiosSugar, err, retry) {
        if (retry && err.sugar.retry.auto) {
            if (!retry()) {
                warn('retry has been already retried before');
            }
        }
    }
    errorhandlers.forEach(function (h) {
        HttpStatusProcessor.prototype['on' + h] = function (status, err, result, retry) {
            if (isDev()) {
                error(err.reason.message);
            }
            autoRetry(this, err, retry);
            return err.reason;
        };
    });
    HttpStatusProcessor.prototype.on = function (event, fn) {
        this['on' + capitalize(event)] = fn;
    };
    HttpStatusProcessor.prototype['onTimeout'] = function (status, err, result, retry) {
        return __awaiter(this, void 0, void 0, function () {
            var onlineCheck, onlineTimeout, offline;
            var _this = this;
            return __generator(this, function (_a) {
                onlineCheck = err.sugar.onlineCheck;
                if (onlineCheck.enable) {
                    if (isOnline()) {
                        if (isDev()) {
                            error("online but timeout");
                        }
                        onlineTimeout = this.events['onlineTimeout'];
                        if (isFn(onlineTimeout)) {
                            this.events['onlineTimeout'].call(this, err, retry);
                        }
                        autoRetry(this, err, retry);
                    }
                    else {
                        if (isDev()) {
                            error("offline");
                        }
                        offline = this.events['offline'];
                        if (isFn(offline)) {
                            this.events['offline'].call(this, err);
                        }
                        if (onlineCheck.reconnect.enable) {
                            window.addEventListener('online', function () {
                                var online = _this.events['online'];
                                if (isFn(online)) {
                                    _this.events['online'].call(_this, err, retry);
                                    autoRetry(_this, err, retry);
                                }
                            });
                        }
                    }
                }
                else {
                    if (isDev()) {
                        error(err.reason.message);
                    }
                    autoRetry(this, err, retry);
                }
                return [2, err.reason];
            });
        });
    };

    function mergeConfig(target, source) {
        var result = deepMerge$1(target, source);
        if (source.save && source.save.storage) {
            result.save.storage = source.save.storage;
        }
        else {
            result.save.storage = target.save.storage;
        }
        return result;
    }

    var httpStatusProcessor = new HttpStatusProcessor();
    var AxiosSugar = (function () {
        function AxiosSugar(axiosConfig, config) {
            this.httpStatusProcessor = httpStatusProcessor;
            this.axios = axios.create(axiosConfig);
            this.config = config || Object.assign({}, defaults);
            this.events = {};
            this.interceptors = {
                request: new AxiosSugarInterceptorManager(),
                response: new AxiosSugarInterceptorManager()
            };
            initInterceptors(this);
        }
        AxiosSugar.prototype.request = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var axiosConfig;
            var config;
            var _this = this;
            if (isStr(args[0])) {
                axiosConfig = args[1] || {};
                axiosConfig.url = args[0];
                config = args[2];
            }
            else {
                axiosConfig = args[0] || {};
                config = args[1];
            }
            config = config ? mergeConfig(defaults, config) : _this.config;
            var chain = [dispatchRequest.bind(this), undefined];
            var middleResponseError = axiosConfig;
            var data = middleResponseError.isAxiosSugarError ? {
                axios: middleResponseError.axios,
                sugar: middleResponseError.sugar,
                count: middleResponseError.count
            } : {
                axios: axiosConfig,
                sugar: config
            };
            var promise = Promise.resolve(data);
            _this.interceptors.request.each(function (interceptor) {
                chain.unshift(interceptor.fulfilled, interceptor.rejected);
            });
            _this.interceptors.response.each(function (interceptor) {
                chain.push(interceptor.fulfilled, interceptor.rejected);
            });
            while (chain.length) {
                promise = promise.then(chain.shift(), chain.shift());
            }
            return promise;
        };
        AxiosSugar.prototype.on = function (event, fn) {
            this.events[event] = fn;
        };
        AxiosSugar.prototype.off = function (event, fn) {
            if (this.events[event] === fn) {
                this.events[event] = undefined;
                return true;
            }
            return false;
        };
        return AxiosSugar;
    }());
    ['delete', 'get', 'head', 'options'].forEach(function (method) {
        AxiosSugar.prototype[method] = function (url, axiosConfig, config) {
            return this.request(merge$1(axiosConfig || {}, {
                method: method,
                url: url
            }), config);
        };
    });
    ['post', 'put', 'patch'].forEach(function (method) {
        AxiosSugar.prototype[method] = function (url, data, axiosConfig, config) {
            return this.request(merge$1(axiosConfig || {}, {
                method: method,
                url: url,
                data: data
            }), config);
        };
    });
    var AxiosSugarStatic = (function (_super) {
        __extends(AxiosSugarStatic, _super);
        function AxiosSugarStatic() {
            var _this_1 = _super.call(this) || this;
            _this_1.repeatTag = repeatTag;
            _this_1.defaults = defaults;
            _this_1.axiosDefaults = axios.defaults;
            _this_1.axios = axios;
            return _this_1;
        }
        AxiosSugarStatic.prototype.create = function (axiosConfig, config) {
            if (config) {
                config = mergeConfig(defaults, config);
            }
            return new AxiosSugar(axiosConfig, config);
        };
        AxiosSugarStatic.prototype.isCancel = function (err) {
            if (err.reason) {
                return axios.isCancel(err.reason);
            }
            else {
                return false;
            }
        };
        AxiosSugarStatic.prototype.getUri = function (config) {
            return axios.getUri(config);
        };
        AxiosSugarStatic.prototype.spread = function (fn) {
            return axios.spread(fn);
        };
        AxiosSugarStatic.prototype.all = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return axios.all(args);
        };
        AxiosSugarStatic.prototype.cancelAll = function () {
            var cancelConfigs = [];
            middleData.configs.map(function (c) {
                if (c !== null) {
                    cancelConfigs.push({
                        cancel: middleData.cancels[c.index],
                        config: c
                    });
                }
            });
            if (isFn(this.cancelFilter)) {
                cancelConfigs = this.cancelFilter(cancelConfigs);
            }
            console.log(cancelConfigs);
            cancelConfigs.forEach(function (c) {
                c.cancel();
            });
        };
        AxiosSugarStatic.prototype.cancelFilter = function (cancelConfigs) {
            return cancelConfigs.filter(function (c) { return !c.config.sugar.cancelDisabled; });
        };
        AxiosSugarStatic.prototype.cancelAutoRetry = function (err) {
            err.sugar.retry.auto = false;
        };
        return AxiosSugarStatic;
    }(AxiosSugar));
    var SugarStatic = new AxiosSugarStatic();

    var storage$1 = {
        inner: AxiosSugarInnerStorage,
        local: AxiosSugarLocalStorage
    };

    exports.AxiosSugar = AxiosSugar;
    exports.HttpStatusProcessor = HttpStatusProcessor;
    exports.default = SugarStatic;
    exports.storage = storage$1;

    return exports;

}({}, axios));
