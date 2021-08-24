import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import {
  selectorWithDataValue,
  SHARED_ELEMENTS
} from "../../elements/shared/sharedElements";

export function fillAutocompleteSelect(selectSelector, option) {
  cy.get(selectSelector)
    .click()
    .get(SHARED_ELEMENTS.autocompleteCircle)
    .should("be.visible")
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
      .as("option")
      .get(BUTTON_SELECTORS.selectOption)
      .first()
      .find(BUTTON_SELECTORS.checkbox)
      .should("be.enabled")
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
