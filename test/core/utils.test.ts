import { genSymbol } from '../../src/core/utils';
import { AxiosRequestConfig } from 'axios';
import { expect } from 'chai';

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
  config.method = 'post'
  config.data = {
    a: 1,
    b: 2
  }
  expect(genSymbol(config)).to.eq(`method=${config.method}&url=${config.url}&data=${JSON.stringify(config.data)}`);
});
