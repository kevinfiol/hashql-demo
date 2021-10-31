import { join, dirname } from 'path';
import { writeFileSync } from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import HashQL from 'hashql/rollup'
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const QUERIES_OUTPUT = join(__dirname, './src/server/queries.json');

const production = !process.env.ROLLUP_WATCH;

export default {
  input: './src/client/index.js',
  output: {
    file: './dist/app.js',
    format: 'iife'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    production && terser(), // minify bundle in production,
    production && HashQL({
      tags: ['sql'],
      output: queries => writeFileSync(
        QUERIES_OUTPUT,
        JSON.stringify(queries, null, 2)
      )
    }),
    !production && serve('dist'),
    !production && livereload('dist')
  ]
};