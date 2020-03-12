import AxiosSugarConfig from '../src/AxiosSugarConfig';
import { expect } from 'chai';

let config = new AxiosSugarConfig();

it('default', () => {
  expect(config.isResend).to.false;
  expect(config.isSave).to.false;
  expect(config.prop).to.eq('custom');
  expect(config.resendDelay).to.eq(1000);
  expect(config.resendTimes).to.eq(3);
});

it('override', () => {
  config = new AxiosSugarConfig({
    isResend: true,
    isSave: true,
    prop: 'inject'
  });
  expect(config.isResend).to.true;
  expect(config.isSave).to.true;
  expect(config.prop).to.eq('inject');
  expect(config.resendDelay).to.eq(1000);
  expect(config.resendTimes).to.eq(3);
});

it('not valid key', () => {
  config = new AxiosSugarConfig({
    a: 1
  } as any);
  expect((config as any).a).to.undefined;
});
