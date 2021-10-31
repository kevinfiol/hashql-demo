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

## Tips

For a quick way to spin up a Postgres database, see [this gist](https://gist.github.com/kevinfiol/f5120fbd0d3858ebe0c3d1fa1faf9c8b).