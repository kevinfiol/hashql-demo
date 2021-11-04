import { join, dirname } from 'path';
import { writeFileSync } from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import HashQL from 'hashql/rollup.js'
import { fileURLToPath } from 'url';
import serve from 'create-serve';
const __dirname = dirname(fileURLToPath(import.meta.url));

const QUERIES_OUTPUT = join(__dirname, './src/server/queries.json');

const production = !process.env.ROLLUP_WATCH;

const SERVER_PORT = 5000;
let firstServerRun = true;

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

    !production && {
      name: 'server',
      buildStart: () => {
        if (firstServerRun) {
          serve.start({
              port: SERVER_PORT,
              root: 'dist',
              live: true
          });

          firstServerRun = false;
        }
      },

      generateBundle: () => {
        serve.update();
        console.log(`localhost:${SERVER_PORT}`);
      }
    }
  ]
};