# Running E2E tests

Cypress tests work until version 3.18. From version 3.19 we moved the tests to PW. 

> [!NOTE]
> The tests are based on Saleor Cloud and use snapshots with prepared data.
> If you want to run those tests on your infrastructure you should update test data with your own created objects
https://github.com/saleor/saleor-dashboard/blob/main/playwright/data/e2eTestData.ts and make sure to create snapshot.

Playwright-specific env variables to `.env` file

```
BASE_URL=
API_URL=

E2E_USER_NAME=
E2E_USER_PASSWORD=
E2E_PERMISSIONS_USERS_PASSWORD=

MAILPITURL=
```

You are ready to run PW commands like:

```shell
npm run qa:pw-ui
```