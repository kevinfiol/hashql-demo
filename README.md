# HashQL Demo

A small demo of [HashQL](https://github.com/HashQL/HashQL).

Run migrations first:

```bash
pnpm run migrate up
```

Then run the HashQL server:
```
pnpm run hashql
```

`dev` mode will accept all queries from the client. If you run the `build` script, `queries.json` will be created at `/src/server/queries.json`.