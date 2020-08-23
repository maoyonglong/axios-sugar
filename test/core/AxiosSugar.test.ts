import MockAdapter from 'axios-mock-adapter';
import axiosSugar from '../../src/index';
import { expect } from 'chai';

const mock = new MockAdapter(axiosSugar.axios);
const usersData = {
  users: [
    { id: 1, name: 'John Smith' }
  ]
}

mock.onGet('/users').reply(200, usersData);

it('get', async () => {
  const result = await axiosSugar.get('/users');
  expect(result.data).to.deep.eq(usersData);
})

mock.onGet('/notFound').reply(404);

mock.onGet('/timeout').timeout();

it('not found', (done) => {
  axiosSugar.get('/notFound').catch((err) => {
    try {
      expect(err.message).to.eq('Request failed with status code 404');
      done();
    } catch (err) {
      done(err);
    }
  });
})

it('not repeat', () => {
  const result = axiosSugar.get('/timeout');
  const second = axiosSugar.get('/timeout');
  return new Promise((resolve, reject) => {
    result.catch((err) => {
      expect(axiosSugar.isCancel(err.reason)).to.true;
      resolve();
    }).catch((err) => {
      reject(err);
    })
    second.catch(() => {});
  })
});
 