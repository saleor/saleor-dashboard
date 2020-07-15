// <reference types="cypress" />
describe("Warehouse settings", () => {
  beforeEach(() => {
    cy.clearSessionData();
    cy.loginUser("admin@example.com", "admin");

    // Wait for log in
    cy.get("[data-test=welcomeHeader]").contains("Hello there");
  });

  it("Warehouse section visible in the configuration", () => {
    cy.visit("/configuration/")
      .get("[data-testid=warehouses][data-test=settingsSubsection]")
      .click();
    cy.location("pathname").should("eq", "/warehouses/");
  });

  it("Editing warehouse is available", () => {
    cy.visit(`/warehouses`)
      .get("[data-testid=defaultwarehouse]")
      .get("[data-test=editButton]")
      .first()
      .click()
      .get("[data-test=generalInformationSection]");
  });
});
