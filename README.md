![Travis (.org)](https://img.shields.io/travis/maoyonglong/axios-sugar)
![Coveralls github](https://img.shields.io/coveralls/github/maoyonglong/axios-sugar)
![version](https://img.shields.io/npm/v/axios-sugar)
![download](https://img.shields.io/npm/dm/axios-sugar)
![license](https://img.shields.io/badge/license-MIT-brightgreen)

# AxiosSugar
An axios wrapper, which supports resending, storage, cancel repeat request automatically; and so on.

# Usage
```js
import axios from 'axios'
// This is a factory to new AxiosSugar Class
import factory from 'axios-sugar'

factory(axios);
// or
const ins = axios.create();
factory(ins);

// In version 1.1.3-0, it is suggested to use factory instead of AxiosSugar class
// If you really need this class, you can use as follow:
import axios from 'axios'
import { AxiosSugar } from 'axios-sugar'

const axiosSugar = new AxiosSugar(axios);
// but carefully, an axios instance only can be call `new AxiosSugar()` once


// now you can use axios as before
axios.get();
// or 
ins.get();
// ...
```

# Config
```js
import axios from 'axios'
import factory, { AxiosSugarConfig } from 'axios-sugar'

// AxiosSugarConfigOptions
let options = {
  isResend: true,
  isSave: true
}

factory(axios, {
  config: new AxiosSugarConfig(options)
});
```
### AxiosSugarConfigOptions
```js
{
  isResend?: boolean; // default: false
  resendDelay?: number; // default: 1000 (ms)
  resendTimes?: number; // default: 3
  isSave?: boolean; // default: false
  prop?: string; // default: custom to override the options above in a special request
}
```
prop is a property injected in the config of axios:
```js
import axios from 'axios'
import factory, { AxiosSugarConfig } from 'axios-sugar'

// AxiosSugarConfigOptions
let options = {
  isResend: true,
  isSave: true // default to use innerStorage
}

factory(axios, {
  config: new AxiosSugarConfig(options)
});

axios.get('/path', {
  // prop
  custom: {
    isSave: false // Now, this request will not be saved.
  }
})
axios.get('/path') // This request will be saved
```

# Storage
This library supports two way to save the response data`(res.data in axios.then)`.
### InnerStorage
This storage will be save the data in a object variable.
```js
import axios from 'axios'
import factory, { AxiosSugarInnerStorage } from 'axios-sugar'

let options = {
  isSave: true // default to use innerStorage
}

factory(axios, {
  config: new AxiosSugarConfig(options),
  storage: new AxiosSugarInnerStorage() // storage
});
```
### InnerReleaseStorage
Unlike InnerStorage, it can automatically free up memory.
```js
import axios from 'axios'
import factory, { AxiosSugarInnerReleaseStorage } from 'axios-sugar'

let options = {
  isSave: true // default to use innerStorage
}

factory(axios, {
  config: new AxiosSugarConfig(options),
  storage: new AxiosSugarInnerReleaseStorage() // storage
});
// the constructor of AxiosSugarInnerReleaseStorage is:
/**
 * duration: storage time (ms)  default is 5 * 60 * 1000 (i.e. 5 minutes)
 * limit: memory limit (Bytes) default is 15 * 1024 * 1024 (i.e. 15MB)
 * constructor (duration: number, limit: number); 
 * /
```


### LocalStorage
This storage will be save the data in localStorage.
```js
import axios from 'axios'
import factory, { AxiosSugarLocalStorage } from 'axios-sugar'

let options = {
  isSave: true // default to use innerStorage
}

factory(axios, {
  config: new AxiosSugarConfig(options),
  storage: new AxiosSugarLocalStorage() // storage
});
```
### Custom Storage
You can implements the interface AxiosSugarStorage to customize your storage.
// The interface is:
```ts
interface AxiosSugarStorage {
  set (symbol: string, res: any): void;
  get (symbol: string): any;
  contains (symbol: string): boolean;
}
```
// custom:
```js
import axios from 'axios'
import factory from 'axios-sugar'

let options = {
  isSave: true // default to use innerStorage
}

// override set, get and contains methods
class CustomStorage {
  // symbol is a string to identify a request, res is `res.data in axios.then`
  set (symbol: string, res: any);
  get (symbol: string);
  contains (symbol: string);
}

factory(axios, {
  config: new AxiosSugarConfig(options),
  storage: new CustomStorage() // storage
});
```

# Lifecycle
The lifecycle is some callback.
```js
import axios from 'axios'
import factory{ AxiosSugarLifeCycle } from 'axios-sugar'

let cycle = new AxiosSugarLifeCycle();
// now, you can override some callback
cycle.beforeRequest = (conf) => {
  return false // This will break the request
}

factory(axios, {
  lifecycle: cycle
})
```
### callback
The callback of lifecycle is:
```ts
beforeRequest(conf: AxiosRequestConfig): AxiosSugarLifeCycleResult;
// carefully, this res is the `res` not `res.data`
beforeResponse(res: AxiosResponse): AxiosSugarLifeCycleResult;
```
All callback should return an AxiosSugarLifeCycleResult, it is a object:
```ts
{
  state: false, // will break execution and throw an AxiosSugarError if state is false
  message: '', // error message
}
```
### AxiosSugarError
The AxiosSugarError is:
```ts
{
  reason: string; // error reason
  message?: any;
  data?: any;
}
```

### AxiosSugarError Handler
You can catch the errors in `axios.catch`
```js
axios.get()
  .catch(err => {
    /**
     * AxiosSugarError
     * reason may be:
     * beforeRequestBreak
     * beforeResponseBreak
     * existed
     * ...
     */
    if (err.readon) {
      console.log(err)
    } 
    // an axios error
    else {
      // ...
    }
  })
```

# Test
**Node test**:
```
npm test
```
**Some browser test**`(e.g. AxiosSugarLocalStorage)`:  
open the corresponding `index.html` File in `/test` which built by mocha.

# TODO
* Broken network retransmission
* Broken network lifecycle

# Change Log
v1.1.3-0 export default a factory instead of exporting an AxiosSugar class
