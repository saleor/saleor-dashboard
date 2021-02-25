// <reference types="cypress" />
import { LOGIN_SELECTORS } from "../elements/account/login-selectors";
import { urlList } from "../url/urlList";

describe("User authorization", () => {
  beforeEach(() => {
    cy.clearSessionData();
  });

  it("should successfully log in an user", () => {
    cy.visit(urlList.homePage);
    cy.loginUser();
    cy.get(LOGIN_SELECTORS.welcomePage);
  });

  it("should fail for wrong password", () => {
    cy.visit(urlList.homePage)
      .get(LOGIN_SELECTORS.emailAddressInput)
      .type("admin@example.com")
      .get(LOGIN_SELECTORS.emailPasswordInput)
      .type("wrong-password")
      .get(LOGIN_SELECTORS.signInButton)
      .click()
      .get(LOGIN_SELECTORS.warningCredentialMessage);
  });

  it("should successfully log out an user", () => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit(urlList.homePage);
    cy.loginUser();
    cy.get(LOGIN_SELECTORS.userMenu)
      .click()
      .get(LOGIN_SELECTORS.accountSettings)
      .click();
    cy.location("pathname").should("contains", "/staff/");
  });
});
