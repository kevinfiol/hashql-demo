import fs from 'fs';
import crypto from 'crypto';
import { resolve } from 'path';
import { bundle, logSuccess, logError } from './bundle.js';

const queries = {};

bundle({
    minify: true,
    plugins: [
        HashQL(['sql'])
    ]
}).then(() => {
    // write queries
    fs.writeFileSync(
        resolve('src/server/queries.json'),
        JSON.stringify(queries, null, 2)
    );
}).then(logSuccess).catch(e => {
    logError(e);
    process.exit(1);
});

function HashQL(tags) {
    if (!tags || tags.length < 1)
        throw Error('You must provide template tags to the HashQL plugin.');

    // https://regex101.com/r/ah8hP3/1
    // \b(sql|node)(`[^`]*`)
    const matchRegex = new RegExp('\\b(' + tags.join('|') + ')(`[^`]*`)', 'g');

    function add(tag, query) {
        const md5 = crypto
            .createHash('md5')
            .update(query.join())
            .digest('hex');

        tag in queries === false && (queries[tag] = {})
        queries[tag][md5] = query

        return md5
    }

    return {
        name: 'hashql',
        setup(build) {
            build.onLoad({ filter: /\.(js|mjs|jsx|ts|tsx)$/ }, async ({ path }) => {
                let contents = await fs.promises.readFile(path, 'utf8');

                let chunks = contents.slice();
                const matches = [...chunks.matchAll(matchRegex)];

                if (matches.length > 0) {
                    let origLen = contents.length;
                    let diff = 0; // used to re-align match indices after every change

                    matches.forEach(match => {
                        let taggedCall = match[0];
                        let tag = match[1];
                        let query = match[2].replace(/`/g, '');

                        const index = match.index + diff;
                        const callLen = taggedCall.length;

                        const beg = contents.slice(0, index);
                        const end = contents.slice(index + callLen);

                        const queryParts = query.split('${');
                        const args = [];
                        if (queryParts.length > 1) {
                            query = queryParts.reduce((acc, cur) => {
                                let temp = cur.split('}');
                                if (temp.length == 1) return [...acc, cur];
                                args.push(temp[0].trim());
                                return [...acc, temp[1]];
                            }, []);
                        } else {
                            query = [query];
                        }

                        const hash = add(tag, query);
                        contents = beg + `${tag}('${hash}'`;
                        if (args.length > 0) contents += `,${args.join(',')}`;
                        contents += ')' + end;

                        if (contents.length !== origLen) {
                            diff = contents.length - origLen;
                        }
                    })
                }

                return { contents };
            });
        }
    }
};