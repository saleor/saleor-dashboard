// <reference types="cypress" />
describe("User authorization", () => {
  beforeEach(() => {
    cy.clearSessionData();
  });

  describe("Login", () => {
    it("should successfully log in an user", () => {
      cy.visit("/");
      cy.loginUser("admin@example.com", "admin");
      cy.get("[data-test=welcomeHeader]").contains("Hello there");
    });
  });

  describe("Logout", () => {
    it("should successfully log out an user", () => {
      cy.window().then(win => {
        win.sessionStorage.clear();
      });
      cy.visit("/");
      cy.loginUser("admin@example.com", "admin");
      cy.get("[data-test=userMenu]")
        .click()
        .get("[data-test=accountSettingsButton]")
        .click();
      cy.location("pathname").should("contains", "/dashboard/staff/");
    });
  });
});
