import { capitalize, isDef, getDurationMS } from '../src/utils';
import { expect } from 'chai';

it('capitalize', () => {
  expect(capitalize('existed')).to.equal('Existed');
});

it('isDef', () => {
  expect(isDef(undefined)).to.false;
  expect(isDef([])).to.true;
  expect(isDef('')).to.true;
  expect(isDef({})).to.true;
});

it('getDurationMS', () => {
  expect(getDurationMS(new Date(2020,2,12,11,34).getTime(), new Date(2020,2,12,11,33).getTime())).to.eq(60 * 1000);
});
