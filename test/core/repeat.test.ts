import MockAdapter from 'axios-mock-adapter';
import AxiosSugar from '../../src/index';
import { expect } from 'chai';
import { Method } from 'axios/index';

const axiosSugar = AxiosSugar.create(undefined, {
  onlineCheck: {
    enable: false
  }
});

const mock = new MockAdapter(axiosSugar.axios);

mock.onGet('/timeout').reply(408);
mock.onGet('/success').reply(200);
mock.onPost('/success').reply(200);

it('cancel repeated', () => {
  const rq1 = axiosSugar.get('/timeout');
  const rq2 = axiosSugar.get('/timeout');

  return rq1.catch((err) => {
    return expect(AxiosSugar.isCancel(err)).to.true;
  })
  .then(() => {
    return rq2.catch((err) => {
      return expect(err.reason.response.status).eq(408);
    });
  });
});


it('repeaTag', () => {
  const method1: Method = 'get';
  const conf1 = {
    method: method1,
    url: '/success',
    params: {
      a: 1
    }
  };
  const str1 = AxiosSugar.repeatTag(conf1);

  expect(str1).to.eq(`method=${conf1.method}&url=${conf1.url}&data=${JSON.stringify(conf1.params)}`);
});

it('repeat callback', (done) => {
  axiosSugar.on('repeated', function () {
    done();
  });
  axiosSugar.get('/success').catch((err) => {
    
  });
  axiosSugar.get('/success');
});

it('repeat interval', (done) => {
  axiosSugar.post('/success').then(() => {
    // resolve()
  });
  setTimeout(function () {
    axiosSugar.post('/success', {}, {
      repeat: {
        interval: 30
      }
    }).then(() => {
      done();
    });
  }, 30);
});
