// import AxiosSugar from '../../src/index';
// import sugarDefaults from '../../src/defaults';
// import { expect } from 'chai';
// import { deepMerge } from '../../src/core/utils';

// it('empty', () => {
//   const newAxiosSugar = AxiosSugar.create();
//   expect(newAxiosSugar.config).to.deep.eq(sugarDefaults);
// });

// it('sugarConfigMerge', () => {
//   const newAxiosSugar = AxiosSugar.create(undefined, {
//     retry: {
//       auto: false
//     }
//   });

//   const config = deepMerge(sugarDefaults, {
//     retry: {
//       auto: false
//     }
//   });

//   expect(newAxiosSugar.config).to.deep.eq(config);
// });
