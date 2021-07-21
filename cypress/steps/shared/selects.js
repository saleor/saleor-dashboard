import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { selectorWithDataValue } from "../../elements/shared/sharedElements";

export function fillAutocompleteSelect(selectSelector, option) {
  cy.get(selectSelector)
    .click()
    .get(BUTTON_SELECTORS.selectOption)
    .should("be.visible");
  if (option) {
    cy.get(selectSelector).clearAndType(option);
    cy.contains(BUTTON_SELECTORS.selectOption, option).click();
    cy.wrap(option).as("option");
  } else {
    cy.get(BUTTON_SELECTORS.selectOption)
      .first()
      .invoke("text")
      .as("option");
    cy.get(BUTTON_SELECTORS.selectOption)
      .first()
      .click();
  }
  return cy.get("@option");
}

export function fillBaseSelect(selectSelector, value) {
  cy.get(selectSelector)
    .click()
    .get(selectorWithDataValue(value))
    .click();
}
