import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import {
  selectorWithDataValue,
  SHARED_ELEMENTS,
} from "../../../elements/shared/sharedElements";

Cypress.Commands.add("createNewOption", (selectSelector, newOption) => {
  cy.get(selectSelector).type(newOption);
  cy.contains(BUTTON_SELECTORS.selectOption, newOption)
    .should("be.visible")
    .click()
    .get(selectSelector)
    .find("input")
    .first()
    .click({ force: true });
});

Cypress.Commands.add("fillMultiSelect", (selectSelector, option) => {
  cy.fillAutocompleteSelect(selectSelector, option).then(returnedOption => {
    cy.get(SHARED_ELEMENTS.header)
      .first()
      .click({ force: true })
      .get(SHARED_ELEMENTS.multiAutocomplete.selectedOptions)
      .should("be.visible");
    return cy.wrap(returnedOption);
  });
});

Cypress.Commands.add("fillBaseSelect", (selectSelector, value) => {
  cy.get(selectSelector)
    .should("not.have.attr", "aria-disabled", "true")
    .click()
    .get(selectorWithDataValue(value))
    .click();
});

Cypress.Commands.add("fillAutocompleteSelect", (selectSelector, option) => {
  cy.get(selectSelector)
    .click()
    .get(BUTTON_SELECTORS.selectOption)
    .should("be.visible");
  if (option) {
    cy.get(BUTTON_SELECTORS.selectOption)
      .first()
      .then(detachedOption => {
        cy.get(selectSelector).clear();
        cy.get(selectSelector).type(option);
        cy.wrap(detachedOption).should(det => {
          Cypress.dom.isDetached(det);
        });
        cy.contains(BUTTON_SELECTORS.selectOption, option).click();
        cy.wrap(option).as("option");
      });
  } else {
    cy.get(BUTTON_SELECTORS.selectOption)
      .wait(1000)
      .first()
      .invoke("text")
      .as("option")
      .get(BUTTON_SELECTORS.selectOption)
      .first()
      .click();
  }
  return cy.get("@option");
});
