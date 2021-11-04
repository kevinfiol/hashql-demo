import fs from 'fs';
import crypto from 'crypto';
import { bundle, logSuccess, logError } from './bundle.js';
import textReplace from 'esbuild-plugin-text-replace'

// await esbuild.build(
//     {
//         entryPoints: ['./test-build-input'],
//         outfile: 'test-build-out.js',
//         plugins: [
            
//             textReplace(
//                 {
//                     include: /mypackage\/dist/loader\.js$\/,
//                     pattern:[
//                         ['const installRetry','let installRetry'],
//                         [/const\s+{\s*textReplace\s*}\s*=\s*require\s*\(\s*'esbuild-plugin-text-replace'\s*\)\s*;/g , "'import textReplace from 'esbuild-plugin-text-replace'"]
//                     ]
//                 }
//             )
//         ],
//     }
// )

const queries = {};

function add(tag, query) {
    const md5 = crypto
        .createHash('md5')
        .update(query.join())
        .digest('hex');

    tag in queries === false && (queries[tag] = {})
    queries[tag][md5] = query

    return md5
}

bundle({
    minify: true,
    plugins: [
        {
            name: 'hashql',
            setup(build) {
https://regex101.com/r/ah8hP3/1
// \b(?:sql|bar)`[^`]*`
https://github.com/acornjs/acorn
                build.onLoad({ filter: /\.js$/ }, async ({ path }) => {
                    const source = await fs.promises.readFile(path, 'utf8');
                    let temp = '(' + [].concat(['sql']).join('|') + ')`';
                    console.log(temp);
                    const matchRegex = new RegExp('(' + [].concat(['sql']).join('|') + ')`', 'g');

                    let contents = source.slice();
                    contents = contents.replaceAll(matchRegex, (foo) => {
                        console.log(foo);
                        return 'foobar`';
                    });

                    return { contents };
                });
            }
        }
    ]
})
    .then(logSuccess)
    .catch(e => {
        logError(e);
        process.exit(1);
    });