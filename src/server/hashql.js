import ey from 'ey';
import http from 'http';
import { json } from '@polka/parse';
import postgres from 'postgres';
import HashQL from 'hashql/server.js';
import { createRequire } from 'module';
import config from '../../config.js';

const DEV = config.mode == 'dev';
const PORT = config.port;
const require = createRequire(import.meta.url);

const app = ey();
const sql = postgres(config.postgres);
const hql = HashQL(DEV ? x => x : require('./queries.json'), {
    sql: (query, input, context) =>
        sql.call(null, query, ...input),
    node: (query, input, context) =>
        eval(
            query.slice(1).reduce(
                (acc, x, i) => acc + JSON.stringify(input[i]) + x,
                query[0]
            )
        )
});

app.use(
    json(),
    (req, _, next) => {
        console.log(`~> [${req.method}] ${req.url}`);
        next();
    }
).post('/hql', (req, res) => {
    hql(req.body)
        .then(data => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(data));
            res.end();
        })
        .catch((err) => {
            console.log(err);
            res.statusCode = err.statusCode
            res.end(err.message)
        });
});

http.createServer(app).listen(PORT);
if (DEV) console.log('Running HashQL server in *DEV* mode.');
console.log(`Listening on port: ${PORT}`);