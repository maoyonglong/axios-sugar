import MockAdapter from 'axios-mock-adapter';
import AxiosSugar from '../../src/index';
import { expect } from 'chai';

const axiosSugar = AxiosSugar.create(undefined, {
  onlineCheck: {
    enable: false
  }
});

const mock = new MockAdapter(axiosSugar.axios);

mock.onGet('/timeout').reply(408);

it('cancel repeated', () => {
  const rq1 = axiosSugar.get('/timeout');
  const rq2 = axiosSugar.get('/timeout');

  return rq1.catch((err) => {
    return expect(AxiosSugar.isCancel(err.reason)).to.true;
  })
  .then(() => {
    return rq2.catch((err) => {
      return expect(err.reason.response.status).eq(408);
    });
  });
});

// it('repeaTag', () => {

// });

// it('repeat callback', () => {

// });
