// <reference types="cypress" />
describe("Warehouse settings", () => {
  beforeEach(() => {
    cy.clearSessionData();
    cy.loginUser("admin@example.com", "admin");
  });

  it("Warehouse section visible in the configuration", () => {
    cy.visit("/configuration/")
      .get("[data-testid=warehouses][data-test=settingsSubsection]")
      .click();
    cy.location("pathname").should("eq", "/dashboard/warehouses/");
  });

  it("Editing warehouse is available", () => {
    cy.visit("/dashboard/warehouses")
      .get("[data-testid=africa]")
      .get("[data-test=editButton]")
      .first()
      .click()
      .get("[data-test=generalInformationSection]");
  });
});
