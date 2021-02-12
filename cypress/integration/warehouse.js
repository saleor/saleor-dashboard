// <reference types="cypress" />
import { urlList } from "../url/urlList";

describe("Warehouse settings", () => {
  beforeEach(() => {
    cy.clearSessionData();
  });

  xit("Warehouse section visible in the configuration", () => {
    cy.visit(urlList.configuration)
      .loginUser()
      .get("[data-test-id=warehouses][data-test=settingsSubsection]")
      .click();
    cy.location("pathname").should("eq", "/warehouses/");
  });

  xit("Editing warehouse is available", () => {
    cy.visit(urlList.warehouses)
      .loginUser()
      .get("[data-test=editButton]")
      .first()
      .click()
      .get("[data-test=generalInformationSection]");
  });
});
