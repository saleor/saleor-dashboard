import { ASSIGN_ELEMENTS_SELECTORS } from "../../../elements/shared/assign-elements-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";

Cypress.Commands.add(
  "assignElements",
  (name, withLoader = true, waitWithoutLoader = false) => {
    cy.get(ASSIGN_ELEMENTS_SELECTORS.searchInput).type(name);
    if (withLoader) {
      cy.get(ASSIGN_ELEMENTS_SELECTORS.dialogContent);
      cy.waitForProgressBarToNotBeVisible();
    }
    if (waitWithoutLoader) {
      cy.get(SHARED_ELEMENTS.dialog)
        .find(ASSIGN_ELEMENTS_SELECTORS.tableRow)
        .should("have.length", 1);
    }
    cy.contains(ASSIGN_ELEMENTS_SELECTORS.tableRow, name)
      .find(ASSIGN_ELEMENTS_SELECTORS.checkbox)
      .click()
      .get(ASSIGN_ELEMENTS_SELECTORS.submitButton)
      .click();
  },
);
