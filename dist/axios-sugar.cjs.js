'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));

var getCompareSymbol = function (rule, injectProp, config) {
    if (rule === void 0) { rule = 1; }
    if (rule === 1) {
        var conf = JSON.parse(JSON.stringify(config));
        delete conf.headers;
        delete conf.timeout;
        delete conf.transformRequest;
        delete conf.transformResponse;
        delete conf.xsrfCookieName;
        delete conf.xsrfHeaderName;
        delete conf["X-XSRF-TOKEN"];
        delete conf.maxContentLength;
        delete conf[injectProp];
        return JSON.stringify(conf);
    }
    else {
        return config[injectProp].rid;
    }
};
var compare = (function (rule, injectProp, target, source) {
    if (rule === void 0) { rule = 1; }
    var tSymbol = getCompareSymbol(rule, injectProp, target);
    for (var _i = 0, _a = Object.values(source); _i < _a.length; _i++) {
        var s = _a[_i];
        var sSymbol = getCompareSymbol(rule, injectProp, s);
        if (tSymbol === sSymbol) {
            return true;
        }
    }
    return false;
});

var defaultConfig = {
    resend: false,
    resendDelay: 200,
    resendNum: 3,
    compareRule: 1,
    store: false
};

function merge(target) {
    var source = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        source[_i - 1] = arguments[_i];
    }
    var t = JSON.parse(JSON.stringify(target));
    source.forEach(function (s) {
        for (var _i = 0, _a = Object.keys(s); _i < _a.length; _i++) {
            var key = _a[_i];
            t[key] = s[key];
        }
    });
    return t;
}
function capitalize(str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
}

var Store = {
    data: {},
    save: function (symbol, res) {
        this.data[symbol] = res;
    },
    get: function (symbol) {
        return this.data[symbol];
    },
    contains: function (key) {
        return typeof this.data[key] !== 'undefined';
    }
};

var axiosSugar = {
    requestConfigs: [],
    config: defaultConfig,
    axiosInstance: null,
    injectProp: "reqConf",
    clear: function () {
        var _this = this;
        this.requestConfigs.forEach(function (c) {
            c[_this.injectProp].cancelTokenSource.cancel();
        });
    },
    getStore: function () {
        return Store;
    },
    setConfig: function (config) {
        this.config = merge(defaultConfig, config);
    },
    injectReqConfig: function (reqConfig) {
        var resend = this.config.resend;
        var injectProp = this.injectProp;
        if (resend && !reqConfig[injectProp].resendCount) {
            reqConfig[injectProp].resendCount = 0;
        }
        reqConfig[injectProp].cancelTokenSource = axios.CancelToken.source();
        return reqConfig;
    },
    beforeRequest: function () {
        var _this = this;
        axios.interceptors.request.use(function (config) {
            var _a = _this.config, compareRule = _a.compareRule, store = _a.store;
            var injectProp = _this.injectProp;
            config[injectProp] = config[injectProp] || {};
            if (store) {
                var symbol = getCompareSymbol(compareRule, injectProp, config);
                var saved = Store.contains(symbol);
                if (saved) {
                    return Promise.reject({
                        reason: "saved",
                        message: "this request has been saved.",
                        res: Store.get(symbol)
                    });
                }
            }
            var existed = compare(compareRule, injectProp, config, _this.requestConfigs);
            if (existed) {
                return Promise.reject({
                    reason: "existed",
                    message: "a same request has been already sent, waiting for response."
                });
            }
            else {
                config = _this.injectReqConfig(config);
                _this.requestConfigs.push(config);
                return Promise.resolve(config);
            }
        }, function (err) {
            Promise.reject(err);
        });
    },
    beforeResponse: function () {
        axios.interceptors.response.use(this.beforeSuccess.bind(this), this.beforeError.bind(this));
    },
    beforeSuccess: function (res) {
        var _a = this.config, compareRule = _a.compareRule, store = _a.store;
        var requestConfigs = this.requestConfigs;
        var reqConfig = res.config;
        var symbol = getCompareSymbol(compareRule, this.injectProp, reqConfig);
        var confIdx = requestConfigs.indexOf(reqConfig);
        requestConfigs.splice(confIdx, 1);
        if (store) {
            var existed = Store.contains(symbol);
            if (!existed) {
                Store.save(symbol, res);
            }
        }
        return Promise.resolve(res);
    },
    beforeError: function (err) {
        if (err.reason) {
            this['on' + capitalize(err.reason)].call(this, err);
            return;
        }
        var _a = this.config, resend = _a.resend, resendDelay = _a.resendDelay, resendNum = _a.resendNum;
        var reqConfig = err.response.config;
        var axiosInstance = this.axiosInstance || axios;
        var requestConfigs = this.requestConfigs;
        var confIdx = requestConfigs.indexOf(reqConfig);
        requestConfigs.splice(confIdx, 1);
        if (resend && reqConfig[this.injectProp].resendCount < resendNum) {
            reqConfig[this.injectProp].resendCount++;
            setTimeout(function () {
                axiosInstance.request(reqConfig);
            }, resendDelay);
        }
        return Promise.reject(err);
    }
};
["Saved", "Existed"].forEach(function (reason) {
    axiosSugar['on' + reason] = function (err) {
        console.log("[No Send]: " + err.reason + " - " + err.message);
    };
});
axiosSugar.beforeRequest.bind(axiosSugar)();
axiosSugar.beforeResponse.bind(axiosSugar)();

module.exports = axiosSugar;
