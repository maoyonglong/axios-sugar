import { capitalize, isDef } from '../src/utils';
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
