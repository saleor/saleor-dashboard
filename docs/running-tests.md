# Running E2E tests

Add Cypress-specific env variables to `.env` file (created in the configuration section above):

```
CYPRESS_USER_NAME=
CYPRESS_USER_PASSWORD=
CYPRESS_SECOND_USER_NAME=
CYPRESS_PERMISSIONS_USERS_PASSWORD=

CYPRESS_mailHogUrl=
STRIPE_SECRET_KEY=
STRIPE_PUBLIC_KEY=

// not required
CYPRESS_RECORD_KEY= // if you want your local runs recorded
```

For values of those variables, refer to our internal documentation.

You are ready to run Cypress commands like:

```shell
npm run cy:open
```

## Updating recorded responses

We are using [Polly.js](https://netflix.github.io/pollyjs/#/) to record and replay API responses. Before you run update make sure that you have Saleor running at `localhost:8000/graphql/`. To update the recorded responses, run:

```shell
POLLY_MODE=record npm run test
```
