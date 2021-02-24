import { LOGIN_SELECTORS } from "../../elements/account/login-selectors";

Cypress.Commands.add("loginUser", () =>
  cy
    .get(LOGIN_SELECTORS.emailAddressInput)
    .type(Cypress.env("USER_NAME"))
    .get(LOGIN_SELECTORS.emailPasswordInput)
    .type(Cypress.env("USER_PASSWORD"), { log: false })
    .get(LOGIN_SELECTORS.signInButton)
    .click()
);

Cypress.Commands.add("loginUserViaRequest", () => {
  cy.sendLoginRequest().then(resp => {
    window.sessionStorage.setItem("auth", resp.body.data.tokenCreate.token);
  });
});

Cypress.Commands.add("loginInShop", () => {
  cy.sendLoginRequest("token").then(resp => {
    window.sessionStorage.setItem("token", resp.body[0].data.tokenCreate.token);
  });
});

Cypress.Commands.add("sendLoginRequest", (authorization = "auth") => {
  const mutation = `mutation TokenAuth{
    tokenCreate(email: "${Cypress.env("USER_NAME")}", password: "${Cypress.env(
    "USER_PASSWORD"
  )}") {
      token
      errors: accountErrors {
        code
        field
        message
      }
      user {
        id
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation, authorization);
});
