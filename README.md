# AxiosSugar
An axios wrapper, which supports resending, storage, cancel repeat request automatically; and so on.

# Usage
```js
import axios from 'axios'
import AxiosSugar from 'axios-sugar'

const axiosSugar = new AxiosSugar(axios);
// or
const ins = axios.create();
const axiosSugar = new AxiosSugar(ins);

// now you can use axios as before
// current version only support get and post
axios.get();
// or 
ins.get();
// ...
```

# Config
```js
import axios from 'axios'
import AxiosSugar, { AxiosSugarConfig } from 'axios-sugar'

// AxiosSugarConfigOptions
let options = {
  isResend: true,
  isSave: true
}

const axiosSugar = new AxiosSugar(axios, {
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
import AxiosSugar, { AxiosSugarConfig } from 'axios-sugar'

// AxiosSugarConfigOptions
let options = {
  isResend: true,
  isSave: true // default to use innerStorage
}

const axiosSugar = new AxiosSugar(axios, {
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
import AxiosSugar, { AxiosSugarInnerStorage } from 'axios-sugar'

let options = {
  isSave: true // default to use innerStorage
}

const axiosSugar = new AxiosSugar(axios, {
  config: new AxiosSugarConfig(options),
  storage: new AxiosSugarInnerStorage() // storage
});
```
### LocalStorage
This storage will be save the data in localStorage.
```js
import axios from 'axios'
import AxiosSugar, { AxiosSugarLocalStorage } from 'axios-sugar'

let options = {
  isSave: true // default to use innerStorage
}

const axiosSugar = new AxiosSugar(axios, {
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
import AxiosSugar from 'axios-sugar'

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

const axiosSugar = new AxiosSugar(axios, {
  config: new AxiosSugarConfig(options),
  storage: new CustomStorage() // storage
});
```

# Lifecycle
The lifecycle is some callback.
```js
import axios from 'axios'
import AxiosSugar, { AxiosSugarLifeCycle } from 'axios-sugar'

let cycle = new AxiosSugarLifeCycle();
// now, you can override some callback
cycle.beforeRequest = (conf) => {
  return false // This will break the request
}
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

# Test
**Node test**:
```
npm test
```
**Some browser test**`(e.g. AxiosSugarLocalStorage)`:  
open the corresponding `index.html` File in `/test` which built by mocha.

# TODO
* support other axios method
* Broken network retransmission
* Broken network lifecycle