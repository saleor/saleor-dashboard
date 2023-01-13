import "../../api/requests/utils/index";

import { LOGIN_SELECTORS } from "../../../elements/account/login-selectors";
import { TEST_ADMIN_USER } from "../../../fixtures/users";

Cypress.Commands.add("loginUser", () =>
  cy
    .get(LOGIN_SELECTORS.emailAddressInput)
    .type(Cypress.env("USER_NAME"))
    .get(LOGIN_SELECTORS.emailPasswordInput)
    .type(Cypress.env("USER_PASSWORD"), { log: false })
    .get(LOGIN_SELECTORS.signInButton)
    .click(),
);

Cypress.Commands.add("loginInShop", () => {
  cy.loginUserViaRequest("token");
});

Cypress.Commands.add(
  "loginUserViaRequest",
  (authorization = "auth", user = TEST_ADMIN_USER) => {
    const mutation = `mutation TokenAuth{
    tokenCreate(email: "${user.email}", password: "${user.password}") {
      token
      csrfToken
      refreshToken
      errors: errors {
        code
        field
        message
      }
      user {
        id
      }
    }
  }`;
    return cy.sendRequestWithQuery(mutation, null).then(resp => {
      window.localStorage.setItem(
        "_saleorCSRFToken",
        resp.body.data.tokenCreate.csrfToken,
      );
      window.sessionStorage.setItem(
        authorization,
        resp.body.data.tokenCreate.token,
      );
    });
  },
);

Cypress.Commands.add("loginUserViaMockedToken", () => {
  cy.window().then(appWindow => {
    appWindow.localStorage.setItem(
      "_saleorCSRFToken",
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE2NzM2MDY2NjIsIm93bmVyIjoic2FsZW9yIiwiaXNzIjoiaHR0cHM6Ly9hdXRvbWF0aW9uLWRhc2hib2FyZC5zdGFnaW5nLnNhbGVvci5jbG91ZC9ncmFwaHFsLyIsImV4cCI6MTY3MzYwNjk2MiwidG9rZW4iOiJNMmlyRm16VkFTUjMiLCJlbWFpbCI6InRlc3RlcnMrZGFzaGJvYXJkQHNhbGVvci5pbyIsInR5cGUiOiJhY2Nlc3MiLCJ1c2VyX2lkIjoiVlhObGNqb3hNRE16IiwiaXNfc3RhZmYiOnRydWV9.CKBD3eFB4kBy0h17-EArhNTZhvR3oCosx8LEVXem2MmqCgKbOj1VsrMeyV6rs-0uzJvdL5jpZU1whvAw6KyCtPuefJehfZ3BN0kekSTFdS6dPj8OS8Dk4NFh42XY6pjkMuKGcVBxBM81mw2NdkGpTjkP3_x7PgYruquBTVwQWG1BJG5IPGAtPXN4htdcdLQ8bmPBeIGjpq0ZFgsD2Y6nZ4ameR23BI9DwH9lB7YhrIwlzR5NW_GuI6VVMpWiaIIycv-6MunGc5OeC-g08ked1Qk54FXYFICGgLpQIfyeclu9n6EjaJ0iDhmy-C4tu_HKTiwNtRp27CalhenkehTmQg",
    );
  });
});
