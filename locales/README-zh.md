![Travis (.org)](https://img.shields.io/travis/maoyonglong/axios-sugar)
![Coveralls github](https://img.shields.io/coveralls/github/maoyonglong/axios-sugar)
![version](https://img.shields.io/npm/v/axios-sugar)
![download](https://img.shields.io/npm/dm/axios-sugar)
![license](https://img.shields.io/badge/license-MIT-brightgreen)

# Locales
[English](../README.md)

# AxiosSugar
axios.js的二次封装库

# Carefully
该新版本有很大的改变，和旧版不兼容。它的特点是用法上和axios很相像。

# Features
* 类axios的方法
* 取消重复请求
* 重试
* 响应存储器
* 断网重传
* Http状态代码响应的处理程序
* 取消筛选器匹配的所有请求

# Usage
```js
import AxiosSugar from 'axios-sugar';

// 假设请求返回paramA
AxiosSugar.get('/somePath', {
  params: {
    paramA: 1
  }
}).then(res => {
  console.log(res.data); // 1
})
```
它的用法和axios.js真的很类似！其它的像*request*, *get*, *post*, *delete*, *put*, *patch*, *head*, *options*的一些方法也一样。
  
不同的是，除了axios方法原来接收的参数，这些请求方法还接收另一个类型为[AxiosSugarConfig](https://myl970421.gitee.io/axios-sugar-docs/zh/guide/configuration)的参数。
例如：
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
接下来，你应该查看 [参考指南](https://myl970421.gitee.io/axios-sugar-docs/zh/guide)

# Test
**Node test**:
```
npm test
```
**Some browser test**`(e.g. AxiosSugarLocalStorage)`:  
open the corresponding `index.html` File in `/test` which built by mocha.
