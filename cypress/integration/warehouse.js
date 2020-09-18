// <reference types="cypress" />
describe("Warehouse settings", () => {
  beforeEach(() => {
    cy.clearSessionData();
  });

  xit("Warehouse section visible in the configuration", () => {
    cy.visit("/configuration/")
      .loginUser()
      .get("[data-test-id=warehouses][data-test=settingsSubsection]")
      .click();
    cy.location("pathname").should("eq", "/warehouses/");
  });

  xit("Editing warehouse is available", () => {
    cy.visit(`/warehouses`)
      .loginUser()
      .get("[data-test=editButton]")
      .first()
      .click()
      .get("[data-test=generalInformationSection]");
  });
});
