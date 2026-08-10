# The shared schema

`schema.prisma` here is a **symlink** to the POS repo:

```
../../SwiftGrocers_POS/prisma/schema.prisma
```

One database, two applications. The schema is owned there and the two cannot
drift into different shapes of the same table.

## Rules

- **Never run `prisma migrate` from this project.** Migrations are forward-only
  and run from the POS repo. If the storefront needs a column, change the schema
  there in a pull request both teams can see.
- Generate a client here if you need one (`npx prisma generate`); the output is
  disposable and git-ignored.
- Read products through the **`app.product_public` view**, not the `product`
  table. The table carries `cost_kobo`, which must never reach a browser.
- Connect as `swiftgrocers_app`, never the owner. Row-level security is what
  keeps a shopper to their own orders.

Full contract: `SwiftGrocers_POS/docs/DATABASE.md`.

## Status

The storefront still runs on the static catalog in `lib/products.js`. Its 26
products and 12 categories have been seeded into the shared database with the
same slugs, so `/product/seedless-prunes` resolves either way — but the pages
have not been switched over to read from it yet.
