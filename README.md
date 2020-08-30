![Travis (.org)](https://img.shields.io/travis/maoyonglong/axios-sugar)
![Coveralls github](https://img.shields.io/coveralls/github/maoyonglong/axios-sugar)
![version](https://img.shields.io/npm/v/axios-sugar)
![download](https://img.shields.io/npm/dm/axios-sugar)
![license](https://img.shields.io/badge/license-MIT-brightgreen)

# Locales
[简体中文](./locales/README-zh.md)

# AxiosSugar
An wrapper for axios.js

# Carefully
The new version has significant changes and is not compatible with the old version.    
Compared with the old version, it is used in a very similar way to Axios.

# Features
* Axios-Like Methods 
* Cancel Repeated Requests
* Retry
* Response Storage
* Broken Network Retransmission
* Handlers for Http-Status-Code Responses
* Cancel All Requests Matched By Filter

# Usage
```js
import AxiosSugar from 'axios-sugar';

// suppose the request returns paramA
AxiosSugar.get('/somePath', {
  params: {
    paramA: 1
  }
}).then(res => {
  console.log(res.data); // 1
})
```
Look, it's really like Axios！The *request*, *get*, *post*, *delete*, *put*, *patch*, *head*, *options* is also.  
  
The difference is that these methods also receive an [AxiosSugarConfig](https://maoyonglong.github.io/axios-sugar-docs/guide/configuration.html#axiossugarconfig) type parameter.
e.g.  
```js
AxiosSugar.get('/somePath'， {
  params: {
    paramA: 1
  }
}, {
  retry: {
    enable: true
  }
})
```
Next, you should get more details in [references](https://maoyonglong.github.io/axios-sugar-docs/guide)

# Test
**Node test**:
```
npm test
```
**Some browser test**`(e.g. AxiosSugarLocalStorage)`:  
open the corresponding `index.html` File in `/test` which built by mocha.
