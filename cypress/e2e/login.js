/// <reference types="cypress"/>
/// <reference types="../support"/>

import { LOGIN_SELECTORS } from "../elements/account/login-selectors";
import { urlList } from "../fixtures/urlList";

describe("User authorization", () => {
  beforeEach(() => {
    cy.clearSessionData();
  });

  it(
    "should successfully log in an user",
    { tags: ["@login", "@allEnv", "@stable"] },
    () => {
      cy.visit(urlList.homePage);
      cy.loginUser();
      cy.get(LOGIN_SELECTORS.welcomePage).should("be.visible");
    },
  );

  it(
    "should fail for wrong password",
    { tags: ["@login", "@allEnv", "@stable"] },
    () => {
      cy.visit(urlList.homePage)
        .get(LOGIN_SELECTORS.emailAddressInput)
        .type("admin@example.com")
        .get(LOGIN_SELECTORS.emailPasswordInput)
        .type("wrong-password")
        .get(LOGIN_SELECTORS.signInButton)
        .click()
        .get(LOGIN_SELECTORS.warningCredentialMessage)
        .should("be.visible");
    },
  );

  it(
    "should successfully log out an user",
    { tags: ["@login", "@allEnv", "@stable"] },
    () => {
      cy.clearSessionData()
        .loginUserViaRequest()
        .visit(urlList.homePage)
        .get(LOGIN_SELECTORS.userMenu)
        .click()
        .get(LOGIN_SELECTORS.logOutButton)
        .click()
        .get(LOGIN_SELECTORS.emailAddressInput)
        .should("be.visible");
    },
  );
});
