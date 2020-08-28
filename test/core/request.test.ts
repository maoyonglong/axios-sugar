import MockAdapter from 'axios-mock-adapter';
import AxiosSugar from '../../src/index';
import { expect } from 'chai';

const axiosSugar = AxiosSugar.create({}, {
  repeat: {
    interval: 0
  }
});

const mock = new MockAdapter(axiosSugar.axios);
const usersData = {
  users: [
    { id: 1, name: 'John Smith' }
  ]
}

mock.onGet('/users').reply(200, usersData);
mock.onPost('/addUser').reply(200);

it('get', async () => {
  let result = await axiosSugar.get('/users');
  expect(result.data).to.deep.eq(usersData);

  result = await axiosSugar.get('/users', {});
  expect(result.data).to.deep.eq(usersData);

  result = await axiosSugar.get('/users', {}, {});
  expect(result.data).to.deep.eq(usersData);
});

it('post', async () => {
  let result = await axiosSugar.post('/addUser');
  expect(result.status === 200)
});
 