const storage = new AxiosSugar.AxiosSugarInnerStorage();
const expect = chai.expect;

it('inner:set', () => {
  storage.set('first', 1);
  expect(storage.data.first).to.equal(1);
});

it('inner:get', () => {
  expect(storage.get('first')).to.equal(1);
  expect(storage.get('')).to.null;
});

it('inner:contains', () => {
  expect(storage.contains('first')).to.true;
});

const storage2 = new AxiosSugar.AxiosSugarLocalStorage();

it('local:set', () => {
  storage2.set('first', 1);
  expect(localStorage.getItem('first')).to.equal('1');
});

it('local:get', () => {
  expect(storage2.get('first')).to.equal(1);
  expect(storage2.get('')).to.null;
});

it('local:contains', () => {
  expect(storage2.contains('first')).to.true;
});

it('innerRelease:duration', () => {
  const s1 = new AxiosSugar.AxiosSugarInnerReleaseStorage(0);
  s1.set('first', 1);
  expect(s1.get('first')).to.eq(1);
  s1.set('second', 2);
  expect(s1.get('first')).to.null;
  expect(s1.get('second')).to.eq(2);
});

it('innerRelease:limit', () => {
  const s1 = new AxiosSugar.AxiosSugarInnerReleaseStorage(undefined, 1);
  s1.set('first', 1);
  expect(s1.get('first')).to.eq(1);
  s1.set('second', 2);
  expect(s1.get('first')).to.null;
  expect(s1.get('second')).to.eq(2);
});