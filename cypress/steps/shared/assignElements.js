import { ASSIGN_ELEMENTS_SELECTORS } from "../../elements/shared/assign-elements-selectors";
import { waitForProgressBarToNotBeVisible } from "./progressBar";

export function assignElements(name, withLoader = true) {
  cy.get(ASSIGN_ELEMENTS_SELECTORS.searchInput).type(name);
  if (withLoader) {
    cy.get(ASSIGN_ELEMENTS_SELECTORS.dialogContent);
    waitForProgressBarToNotBeVisible();
  }
  cy.contains(ASSIGN_ELEMENTS_SELECTORS.tableRow, name)
    .find(ASSIGN_ELEMENTS_SELECTORS.checkbox)
    .click()
    .get(ASSIGN_ELEMENTS_SELECTORS.submitButton)
    .click();
}
