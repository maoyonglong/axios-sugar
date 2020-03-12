import { AxiosSugarRequestStack } from '../src/stack';
import { expect } from 'chai';
import { AxiosRequestConfig } from 'axios';

let stack = new AxiosSugarRequestStack();
let conf: AxiosRequestConfig = {method: 'get'};
let conf2: AxiosRequestConfig = {method: 'post'};

it('push', () => {
  stack.push(conf);
  expect(stack.contains(conf)).to.true;
});

it('remove', () => {
  stack.remove(conf);
  expect(stack.contains(conf)).to.false;
});

it('forEach', () => {
  stack.push(conf);
  stack.push(conf2);
  stack.forEach(function (curConf, confIdx, thisArg) {
    expect(this).to.equal(curConf);
    if (confIdx) {
      expect(curConf).to.equal(conf2);
    } else {
      expect(curConf).to.equal(conf);
    }
  });
});