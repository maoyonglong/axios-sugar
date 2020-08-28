const storage = new AxiosSugar.storage.inner();
const expect = chai.expect;

it('inner:set', () => {
  storage.set('first', 1);
  expect(storage.data.first).to.equal(1);
});

it('inner:get', () => {
  expect(storage.get('first')).to.equal(1);
  expect(storage.get('')).to.null;
});

const storage2 = new AxiosSugar.storage.local();

it('local:set', () => {
  storage2.set('first', 1);
  expect(localStorage.getItem('first')).to.equal('1');
});

it('local:get', () => {
  expect(storage2.get('first')).to.equal(1);
  expect(storage2.get('')).to.null;
});
