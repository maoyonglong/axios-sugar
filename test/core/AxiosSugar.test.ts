import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import AxiosSugar, { factory } from '../../src/core/AxiosSugar';
import { expect } from 'chai';
import AxiosSugarConfig from '../../src/AxiosSugarConfig';
import AxiosSugarLifeCycle from '../../src/AxiosSugarLifeCycle';
import { AxiosSugarInnerStorage } from '../../src/AxiosSugarStorage';
 
let axiosSugar = new AxiosSugar(axios);

it('factory', () => {
  const ins = axios.create()
  expect(factory(ins)).to.instanceOf(AxiosSugar);
  expect(factory(ins)).to.undefined;
});

it('defaultOptions', () => {
  expect(axiosSugar.config instanceof AxiosSugarConfig).to.true;
  expect(axiosSugar.lifecycle instanceof AxiosSugarLifeCycle).to.true;
  expect(axiosSugar.storage instanceof AxiosSugarInnerStorage).to.true;
});

const mock = new MockAdapter(axios);
const usersData = {
  users: [
    { id: 1, name: 'John Smith' }
  ]
}

mock.onGet('/users').reply(200, usersData);

it('beforeRequestBreak', () => {
  const lifecycle = new AxiosSugarLifeCycle();
  const message = 'break request.';
  lifecycle.beforeRequest = (conf) => ({state: false, message });

  axios
    .get('/users')
    .catch(function(error) {
      expect(error.reason).to.eq('beforeRequestBreak');
      expect(error.message).to.eq(message);
    });
});

it('beforeResponseBreak', () => {
  const lifecycle = new AxiosSugarLifeCycle();
  const message = 'break response.';
  lifecycle.beforeResponse = (conf) => ({state: false, message });

  axios
    .get('/users')
    .catch(function(error) {
      expect(error.reason).to.eq('beforeResponseBreak');
      expect(error.message).to.eq(message);
    });
});

let ins = axios.create();

axiosSugar = new AxiosSugar(ins, {
  config: new AxiosSugarConfig({
    isResend: true,
    resendDelay: 200
  })
});

let times = -1;
let timeoutOnce = true;
mock.onPost('/timeout').reply(() => {
  times++;
  if (!timeoutOnce) return [404, {}];
  return times === 0 ? [404, {}] : [200, {code: 0}];
});

it('resend', () => {
  // let currentResendTimes = 0
  ins
    .post('/timeout', {
      data: 1,
      isResend: true
    })
    .then(resData => {
      expect(resData).to.eql({code: 0});
    })
    .then(() => {
      timeoutOnce = false;
      ins.post('/timeout')
        .catch(err => {
          expect(err.reason).to.eq('resendEnd');
        })
    })
});

it('save', () => {
  axiosSugar.config = new AxiosSugarConfig({
    isSave: true
  });
  let resTimes = 0;
  function saveGetUsers (times) {
    ins
    .get('/users')
    .then(resData => {
      resTimes++;
      expect(resTimes).to.eq(times);
      expect(resData).to.deep.eq(usersData);
    });
  }
  saveGetUsers(1);
  setTimeout(() => {
    saveGetUsers(2);
  })
});

it('no repeat', () => {
  ins.get('/users');
  ins
    .get('/users')
    .catch(err => {
      expect(err.reason).to.eq('existed');
    });
});
 