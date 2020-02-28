import typescript from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify'

const isProd = /production/.test(process.env.NODE_ENV)

let plugins = [
  typescript({
    useTsconfigDeclarationDir: true
  })
]

let output = {
  file: 'dist/axios-sugar.js',
  format: 'cjs'
}

if (isProd) {
  plugins = plugins.concat([uglify()])
  output = {
    file: 'dist/axios-sugar.bundle.js',
    format: 'iife',
    name: 'axiosSugar'
  }
}

export default {
  input: 'src/AxiosSugar.ts',
  output,
  plugins
}
