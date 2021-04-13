import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";

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
