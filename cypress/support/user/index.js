import { LOGIN_SELECTORS } from "../../elements/account/login-selectors";
import { urlList } from "../../url/urlList";

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
      body: {
        operationName: "TokenAuth",
        query: logInMutationQuery,
        variables: {
          email: Cypress.env("USER_NAME"),
          password: Cypress.env("USER_PASSWORD")
        }
      },
      method: "POST",
      url: urlList.apiUri
    })
    .then(resp => {
      window.sessionStorage.setItem("auth", resp.body.data.tokenCreate.token);
    });
});

Cypress.Commands.add("loginInShop", () => {
  cy.request({
    method: "POST",
    url: Cypress.env("API_URI"),
    body: [
      {
        operationName: "TokenAuth",
        variables: {
          email: Cypress.env("USER_NAME"),
          password: Cypress.env("USER_PASSWORD")
        },
        query:
          "mutation TokenAuth($email: String!, $password: String!) {\n  tokenCreate(email: $email, password: $password) {\n    token\n    errors: accountErrors {\n      code\n      field\n      message\n      __typename\n    }\n    user {\n      id\n      __typename\n    }\n    __typename\n  }\n}\n"
      }
    ]
  }).then(resp => {
    window.localStorage.setItem("token", resp.body[0].data.tokenCreate.token);
  });
});
