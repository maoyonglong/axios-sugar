import MockAdapter from 'axios-mock-adapter';
import AxiosSugar, { storage } from '../../src/index';
import { expect } from 'chai';

const axiosSugar = AxiosSugar.create({}, {
  save: {
    enable: true,
    storage: new storage.inner()
  }
});

const mock = new MockAdapter(axiosSugar.axios);
mock.onGet('/save').reply(200, {
  save: true
});

it('save callback', (done) => {
  axiosSugar.get('/save');

  axiosSugar.on('stored', function () {
    done()
  })
});
