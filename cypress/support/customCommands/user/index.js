import "../../api/requests/utils/index";

import { LOGIN_SELECTORS } from "../../../elements/account/login-selectors";
import { urlList } from "../../../fixtures/urlList";
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

Cypress.Commands.add("visitHomePageLoggedViaApi", user => {
  cy.addAliasToGraphRequest("UserDetails")
    .loginUserViaRequest("auth", user)
    .visit(urlList.homePage)
    .waitForRequestAndCheckIfNoErrors("@UserDetails");
});

Cypress.Commands.add(
  "loginUserViaRequest",
  (authorization = "auth", user = TEST_ADMIN_USER) => {
    const mutation = `mutation TokenAuth{
    tokenCreate(email: "${user.email}", password: "${user.password}") {
      token
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
        "_saleorRefreshToken",
        resp.body.data.tokenCreate.refreshToken,
      );
      window.localStorage.setItem("notifiedAboutNavigator", "true");
      window.sessionStorage.setItem(
        authorization,
        resp.body.data.tokenCreate.token,
      );
    });
  },
);
