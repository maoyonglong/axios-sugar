var AxiosSugar = (function (exports) {
  'use strict';

  function isDef(value) {
      return typeof value !== 'undefined';
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

  var AxiosSugarRequestStack = (function () {
      function AxiosSugarRequestStack() {
          this.confs = [];
      }
      AxiosSugarRequestStack.prototype.push = function (conf) {
          this.confs.push(conf);
      };
      AxiosSugarRequestStack.prototype.contains = function (conf) {
          return this.confs.indexOf(conf) >= 0;
      };
      AxiosSugarRequestStack.prototype.remove = function (conf) {
          var confs = this.confs;
          return confs.splice(confs.indexOf(conf), 1);
      };
      AxiosSugarRequestStack.prototype.forEach = function (cb) {
          this.confs.forEach(function (conf, confIdx, thisArg) {
              cb.call(conf, conf, confIdx, thisArg);
          });
      };
      return AxiosSugarRequestStack;
  }());

  function genSymbol(config) {
      var method = config.method, url = config.url;
      var data;
      switch (method) {
          case 'get':
              data = '';
              if (/\?/.test(url)) {
                  var part = url.split('?');
                  url = part[0];
                  data += part[1];
              }
              if (config.params) {
                  for (var _i = 0, _a = Object.entries(config.params); _i < _a.length; _i++) {
                      var _b = _a[_i], key = _b[0], val = _b[1];
                      if (data !== '')
                          data += '&';
                      data += key + "=" + val;
                  }
              }
              break;
          case 'post':
              data = JSON.stringify(config.data);
              break;
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
              error = { reason: 'beforeResponseBreack', message: cycleRes.message };
              return Promise.reject(error);
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
              switch (reason) {
                  case 'existed':
                      return;
                  case 'saved':
                      return Promise.resolve(err.data);
                  case 'beforeRequestBreak':
                  case 'beforeResponseBreak':
                      return Promise.reject(err.message);
              }
          }
          var config = err.config;
          if (config) {
              stack.remove(config);
              var custom_1 = config[conf.prop];
              var isResend = conf.isResend, resendDelay = conf.resendDelay, resendTimes = conf.resendTimes, curResendTimes_1 = 0;
              if (custom_1) {
                  isResend = notUndef(custom_1.isResend, isResend);
                  resendDelay = notUndef(custom_1.resendDelay, resendDelay);
                  resendTimes = notUndef(custom_1.resendTimes, resendTimes);
                  curResendTimes_1 = notUndef(custom_1.curResendTimes, 0);
              }
              if (isResend && curResendTimes_1 < resendTimes) {
                  setTimeout(function () {
                      if (!custom_1) {
                          config.custom = {};
                      }
                      config.custom.curResendTimes = ++curResendTimes_1;
                      axios.request(config);
                  }, resendDelay);
                  error = { reason: 'timeout', message: "current resend times is " + curResendTimes_1 + "." };
                  return Promise.reject(error);
              }
              else {
                  return Promise.reject(err);
              }
          }
          return Promise.reject(err);
      });
  }

  function requestInterceptors (sugar, stack) {
      var axios = sugar.axios;
      var storage = sugar.storage;
      var conf = sugar.config;
      var lifecycle = sugar.lifecycle;
      var error;
      axios.interceptors.request.use(function (config) {
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

  exports.AxiosSugarConfig = AxiosSugarConfig;
  exports.AxiosSugarInnerStorage = AxiosSugarInnerStorage;
  exports.AxiosSugarLifeCycle = AxiosSugarLifeCycle;
  exports.AxiosSugarLocalStorage = AxiosSugarLocalStorage;
  exports.default = AxiosSugar;

  return exports;

}({}));
