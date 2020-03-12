import { genSymbol, normalizeProp } from '../../src/core/utils';
import { AxiosRequestConfig } from '../../src/vendor/axios';
import { expect } from 'chai';
import axios from 'axios';

const sendData = {
  a: 1
};

const custom = {
  isSave: true
};

axios.interceptors.request.use(config => {
  return Promise.resolve(normalizeProp(config));
});

// send params methods
const get = () => axios.get('/', ({
  params: sendData,
  custom
} as any));

// send data methods
const dataMethods = {};
const dataMethodsArr = ['put', 'post', 'patch'];
dataMethodsArr.forEach(method => {
  dataMethods[method] = () => axios[method]('/', {
    ...sendData,
    custom
  });
});

// send both methods
const bothMethods = {};
const bothMethodsArr = ['head', 'delete', 'options', 'request'];
bothMethodsArr.forEach(method => {
  bothMethods[method] = (way) => {
    let toSend: any = {custom};
    if (way === 'params') {
      toSend.params = sendData;
    }
    if (way === 'data') {
      toSend.data = {
        ...sendData,
      };
    }
    const axiosMethod = axios[method];
    return method === 'request' ? axiosMethod({
      url: '/',
      method: 'delete',
      ...toSend
    }) : axiosMethod('/', toSend);
  }
});

function normalizePropExpect (err, dataIn = 'params') {
  expect(err.config.custom).to.eql(custom);
  // the config.data will be transformed to string
  expect(err.config[dataIn]).to.eql(dataIn === 'params' ? sendData : JSON.stringify(sendData));
}

it('normalizeProp:get', () => {
  get().catch(normalizePropExpect);
});

dataMethodsArr.forEach(method => {
  it(`normalizeProp:${method}`, () => {
    dataMethods[method]().catch(err => {
      normalizePropExpect(err, 'data');
    });
  });
});

bothMethodsArr.forEach(method => {
  ['params', 'data'].forEach(way => {
    it(`normalizeProp:${method}:${way}`, () => {
      bothMethods[method](way).catch(err => {
        normalizePropExpect(err, way);
      });
    });
  });
});

it('genSymbol', () => {
  let config: AxiosRequestConfig = {
    url: 'http://localhost',
    method: 'get',
    params: {
      a: 1,
      b: 2
    }
  };
  expect(genSymbol(config)).to.eq(`method=${config.method}&url=${config.url}&data=a=1&b=2`);
  config.method = 'post';
  config.data = {
    a: 1,
    b: 2
  };
  expect(genSymbol(config)).to.eq(`method=${config.method}&url=${config.url}&data=${JSON.stringify(config.data)}`);
});
