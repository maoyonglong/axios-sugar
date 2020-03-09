import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import AxiosSugar from '../../src/core/AxiosSugar';
import { expect } from 'chai';
import AxiosSugarConfig from '../../src/AxiosSugarConfig';
import AxiosSugarLifeCycle from '../../src/AxiosSugarLifeCycle';
import { AxiosSugarInnerStorage } from '../../src/AxiosSugarStorage';
 
let axiosSugar = new AxiosSugar(axios);

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

mock.onGet('/timeout').timeout();

it('resend', () => {
  let currentResendTimes = 0
  ins
    .get('/timeout')
    .catch(error => {
      expect(error.reason).to.eq('timeout');
      expect(error.message).to.eq(`current resend times is ${currentResendTimes}.`);
      currentResendTimes++;
    });
});

it('save', () => {
  axiosSugar.config = new AxiosSugarConfig({
    isSave: true
  });
  let resTimes = 0
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
 