import { LOGIN_SELECTORS } from "../elements/account/login-selectors";

// <reference types="cypress" />
describe("User authorization", () => {
  beforeEach(() => {
    cy.clearSessionData();
  });

  describe("Login", () => {
    it("should successfully log in an user", () => {
      cy.visit("/");
      cy.loginUser();
      cy.get(LOGIN_SELECTORS.welcomePage);
    });

    it("should fail for wrong password", () => {
      cy.visit("/")
        .get(LOGIN_SELECTORS.emailAddressInput)
        .type("admin@example.com")
        .get(LOGIN_SELECTORS.emailPasswordInput)
        .type("wrong-password")
        .get(LOGIN_SELECTORS.signInButton)
        .click()
        .get(LOGIN_SELECTORS.warningCredentialMessage);
    });
  });

  describe("Logout", () => {
    it("should successfully log out an user", () => {
      cy.window().then(win => {
        win.sessionStorage.clear();
      });
      cy.visit("/");
      cy.loginUser();
      cy.get("[data-test=userMenu]")
        .click()
        .get("[data-test=accountSettingsButton]")
        .click();
      cy.location("pathname").should("contains", "/staff/");
    });
  });
});
