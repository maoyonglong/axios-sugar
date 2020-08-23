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

    var defaults = {
        timeout: 2000,
        save: false,
        retry: {
            enable: false,
            count: 3
        },
    };

    var AxiosSugarInterceptorManager = (function () {
        function AxiosSugarInterceptorManager() {
            this.handlers = [];
        }
        AxiosSugarInterceptorManager.prototype.use = function (fullfilled, rejected) {
            this.handlers.push({
                fullfilled: fullfilled,
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

    function dispatchRequest (config) {
        return this.axios.request(config.axios).then(function (response) { return ({
            response: response,
            sugar: config.sugar
        }); }, function (reason) { return Promise.reject({
            reason: reason,
            index: config.index,
            sugar: config.sugar
        }); });
    }

    var MiddleData = {
        tags: [],
        cancelTokens: []
    };

    function repeatTag(axiosConfig, config) {
        return "method=" + axiosConfig.method + ",url=" + axiosConfig.url;
    }
    function repeat (config) {
        var tag = repeatTag(config.axios, config.sugar);
        var i = MiddleData.tags.indexOf(tag);
        if (i >= 0) {
            MiddleData.cancelTokens[i]();
            MiddleData.tags[i] = null;
            MiddleData.cancelTokens[i] = null;
        }
        else {
            var token = axios.CancelToken.source().token;
            config.axios.cancelToken = token;
            MiddleData.cancelTokens.push(token);
        }
        return this.tags.push(tag) - 1;
    }

    function initInterceptors(axiosSugar) {
        axiosSugar.interceptors.request.use(function (config) {
            config.index = repeat(config);
            return config;
        }, function (err) {
            return Promise.reject(err);
        });
        axiosSugar.interceptors.response.use(function (config) {
            if (MiddleData.tags[config.index] !== null) {
                MiddleData.tags[config.index] = null;
            }
            return axiosSugar.httpStatusProcessor.dispatch(config.response.status, config);
        }, function (err) {
            var result = axiosSugar.httpStatusProcessor.dispatch(err.reason.response.status, err);
            return Promise.resolve(result || err);
        });
    }

    function log(msg) {
        console.log("[axios-sugar]: " + msg + ".");
    }
    function isDev() {
        return process.env.NODE_ENV === 'development';
    }

    var HttpStatusProcessorPrototype = (function () {
        function HttpStatusProcessorPrototype() {
            this.statusTable = {
                200: this.onOk,
                201: this.onCreated,
                202: this.onAccepted,
                203: this.onNonAuthoritativeInformation,
                204: this.onNoContent,
                205: this.onResetContent,
                206: this.onPartialContent,
                207: this.onMultiStatus,
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
                log("can't set the handler of http status code " + status + ".");
            }
            return false;
        };
        HttpStatusProcessorPrototype.prototype.dispatch = function (status) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var firstCode = status.toString().substr(0, 1);
            var result;
            if (this["on" + firstCode + "XXBefore"]) {
                result = this["on" + firstCode + "XXBefore"].call(null, status, args);
            }
            if (this.statusTable[status]) {
                result = this.statusTable[status].call(null, status, args, result);
            }
            if (this["on" + firstCode + "XXAfter"]) {
                result = this.statusTable[status].call(null, status, args, result);
            }
            return result;
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
        'Timeout',
        'Conflict',
        'InternalServerError',
        'NotImplemented',
        'BadGateway'
    ];
    errorhandlers.forEach(function (h) {
        HttpStatusProcessor.prototype['on' + h] = function (err) {
            if (isDev()) {
                log(err.message);
            }
        };
    });

    var deepMerge = require('axios/lib/utils');
    var AxiosSugarPrototype = (function () {
        function AxiosSugarPrototype() {
            this.httpStatusProcessor = new HttpStatusProcessor();
        }
        return AxiosSugarPrototype;
    }());
    var AxiosSugar = (function (_super) {
        __extends(AxiosSugar, _super);
        function AxiosSugar(axiosConfig, config) {
            var _this = _super.call(this) || this;
            _this.axios = axios.create(axiosConfig);
            _this.config = config || defaults;
            _this.events = {};
            _this.interceptors = {
                request: new AxiosSugarInterceptorManager(),
                response: new AxiosSugarInterceptorManager()
            };
            initInterceptors(_this);
            return _this;
        }
        return AxiosSugar;
    }(AxiosSugarPrototype));
    AxiosSugar.prototype.create = function (axiosConfig, config) {
        if (config) {
            config = deepMerge(defaults, config);
        }
        return new AxiosSugar(axiosConfig, config);
    };
    AxiosSugar.prototype.request = function (axiosConfig, config) {
        if (config) {
            config = deepMerge(defaults, config);
        }
        var chain = [dispatchRequest, undefined];
        var promise = Promise.resolve({ axios: axiosConfig, config: config });
        this.interceptors.request.each(function (interceptor) {
            chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
        this.interceptors.response.each(function (interceptor) {
            chain.push(interceptor.fulfilled, interceptor.rejected);
        });
        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
    };
    AxiosSugar.prototype.repeatTag = repeatTag;
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

    var axiosSugar = new AxiosSugar();

    exports.HttpStatusProcessor = HttpStatusProcessor;
    exports.default = axiosSugar;

    return exports;

}({}, axios));
