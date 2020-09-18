/* eslint-disable sort-keys */
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
  const logInMutationQuery = `mutation TokenAuth($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      errors: accountErrors {
        code
        field
        message
        __typename
      }
      user {
        id
        __typename
      }
      __typename
    }
  }`;

  return cy
    .request({
      method: "POST",
      url: Cypress.env("API_URI"),
      body: {
        operationName: "TokenAuth",
        variables: {
          email: Cypress.env("USER_NAME"),
          password: Cypress.env("USER_PASSWORD")
        },
        query: logInMutationQuery
      }
    })
    .then(resp => {
      window.sessionStorage.setItem("auth", resp.body.data.tokenCreate.token);
    });
});
