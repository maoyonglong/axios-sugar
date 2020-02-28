# AxiosSugar
An axios wrapper, which supports resending, store and so on

# Usage
```js
// use the aixos static
import axiosSugar from 'axiosSugar';
// use an axios instance
import axios from 'axios';
import axiosSugar from 'axiosSugar';
const ins = axios.create();
axiosSugar.axiosInstance = ins;

// now you can use axios as before
axios.get();
// or 
ins.get();
// ...
```

# Callback
You can overrid the callback to achieve some goals, e.g.:
```js
axiosSugar.onExisted = function (error) {
  // `this` is aim to axiosSugar
  console.log(error.reason); // existed
}
```
The base properties of the error argument is reason and message.
### onExisted
The argument of this callback is an error.
### onSaved
The argument of this callback is an error, with an additional property `res: AxiosResponse`

# Config
You can use `setConfig` to change the configure.
```js
axiosSugar.setConfig(conf);
```
The conf is:
```js
const defaultConfig = {
  resend: false, // if resend when an exception is encountered
  resendDelay: 200, // resend delay (setTimeout)
  resendNum: 3, // resend times
  compareRule: 1, // rule for judging the same request
  store: false // if save the requests
};
```

# Compare Rule
1: use the `JSON.stringify(AxiosRequestConfig)` as symbol  
2: use the `rid` as symbol, e.g.:
```js
axios.request({
  url: '',
  method: '',
  // the injected property
  reqConf: {
    rid: '' // string or number
  }
});
```
# reqConf
this is a property injected in each `AxiosRequestConfig`:
```js
{
  reqConf: {
    rid: '', // rid symbol
    resendCount: 0 // exists if `resend` is true, current resend times
  }
}
```
You can change the key name
```js
axiosSugar.injectProp = 'injectProp';
// now it will be:
{
  injectProp: {
    rid: '', // rid symbol
    resendCount: 0 // exists if `resend` is true, current resend times
  }
}
```

# Store
In default, Store will save the response in an object variable:
```js
{
  // request symbol: response
  symbol: response
}
```
The Store is an single object, you can override this Store's function`(save, get, contains)` to customize:
```js
{
  data: {},
  // when a request to be saved, it will be call
  save (symbol: csymbol, res: AxiosResponse) {
    this.data[symbol] = res;
  },
  get (symbol: csymbol): any {
    return this.data[symbol];
  },
  contains (key): boolean {
    return typeof this.data[key] !== 'undefined';
  }
}
```
