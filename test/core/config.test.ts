import AxiosSugar from '../../src/index';
import sugarDefaults from '../../src/defaults';
import { expect } from 'chai';
import mergeConfig from '../../src/core/mergeConfig';

it('empty', () => {
  const newAxiosSugar = AxiosSugar.create();
  expect(newAxiosSugar.config).to.deep.eq(sugarDefaults);
});

it('sugarConfigMerge', () => {
  const newAxiosSugar = AxiosSugar.create({}, {
    retry: {
      auto: false
    }
  });

  const config = mergeConfig(sugarDefaults, {
    retry: {
      auto: false
    }
  });

  expect(newAxiosSugar.config).to.deep.eq(config);
});
