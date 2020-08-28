import MockAdapter from 'axios-mock-adapter';
import AxiosSugar from '../../src/index';
import { expect } from 'chai';

const axiosSugar = AxiosSugar.create({}, {
  retry: {
    enable: true,
    delay: 0
  }
});

const mock = new MockAdapter(axiosSugar.axios);
mock.onGet('/retry').reply(408);

it('retry callback', (done) => {
  let count = 0;

  axiosSugar.get('/retry').catch((err) => {

  });

  axiosSugar.on('retried', () => {
    count++;
  });

  axiosSugar.on('retryFailed', () => {
    if (count === 3) {
      done();
    }
  });
});
