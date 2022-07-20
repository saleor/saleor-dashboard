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
    return cy.sendRequestWithQuery(mutation, authorization).then(resp => {
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
