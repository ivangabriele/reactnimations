import babel from '@rollup/plugin-babel'
import cleaner from 'rollup-plugin-cleaner'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import sizes from 'rollup-plugin-sizes'

export default {
  external: ['prop-types', 'react', 'simplex-noise'],

  input: './index.js',

  output: [
    {
      exports: 'default',
      file: './dist/bundle.js',
      format: 'cjs',
    },
  ],

  plugins: [
    // Clean /dist directory:
    cleaner({ targets: ['./dist'] }),
    // Locate dependencies via node.js resolution algorithm:
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    // Transpile JSX to JS:
    babel({
      babelHelpers: 'runtime',
      babelrc: false,
      exclude: /node_modules/,
      presets: ['@babel/preset-react'],
      skipPreflightCheck: true,
    }),
    // Convert CommonJS modules to ES6:
    commonjs(),
    // Output bundle dependencies sizes:
    sizes(),
  ],
}
