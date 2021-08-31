import babel from '@rollup/plugin-babel'
import cleaner from 'rollup-plugin-cleaner'
import sizes from 'rollup-plugin-sizes'
import sourcemaps from 'rollup-plugin-sourcemaps'

const FORMATS = ['cjs', 'esm']

const configs = FORMATS.map(format => ({
  external: [/@babel\/runtime/, 'lodash.debounce', 'react', 'simplex-noise'],

  input: './index.js',

  output: [
    {
      exports: 'default',
      file: `./dist/index.${format}.js`,
      format,
      sourcemap: true,
    },
  ],

  plugins: [
    // Clean /dist directory:
    format === 'cjs' ? cleaner({ targets: ['./dist'] }) : null,
    // Transpile JSX to JS:
    babel({
      babelHelpers: 'runtime',
      babelrc: false,
      exclude: [/node_modules/],
      plugins: ['@babel/transform-runtime'],
      presets: ['@babel/preset-react', '@babel/preset-env'],
      // skipPreflightCheck: true,
    }),
    // Output bundle dependencies sizes:
    sourcemaps(),
    // Output bundle dependencies sizes:
    sizes(),
  ],
}))

export default [...configs]
