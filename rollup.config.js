import typescript from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify'

const isProd = /production/.test(process.env.NODE_ENV)

let plugins = [
  typescript({
    useTsconfigDeclarationDir: true
  })
]

let output = {
  file: 'dist/axios-sugar.cjs.js',
  format: 'cjs',
}

if (isProd) {
  plugins = plugins.concat([uglify()])
  output = [
    {
      file: 'dist/axios-sugar.bundle.js',
      format: 'iife',
      name: 'axiosSugar'
    },
    {
      file: 'dist/axios-sugar.js',
      format: 'iife',
      name: 'axiosSugar'
    }
  ]
}

export default {
  input: 'src/AxiosSugar.ts',
  output,
  plugins,
  include: ['node_modules/axios/lib/utils.js']
}
