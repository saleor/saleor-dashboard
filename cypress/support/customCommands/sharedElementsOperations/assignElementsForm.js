import { ASSIGN_ELEMENTS_SELECTORS } from "../../../elements/shared/assign-elements-selectors";

Cypress.Commands.add("assignElements", name => {
  cy.get(ASSIGN_ELEMENTS_SELECTORS.tableRow)
    .first()
    .then(tableRow => {
      cy.get(ASSIGN_ELEMENTS_SELECTORS.searchInput).type(name);
      cy.wrap(tableRow).should(element => {
        Cypress.dom.isDetached(element);
      });
      cy.contains(ASSIGN_ELEMENTS_SELECTORS.tableRow, name)
        .find(ASSIGN_ELEMENTS_SELECTORS.checkbox)
        .click()
        .get(ASSIGN_ELEMENTS_SELECTORS.submitButton)
        .click();
    });
});
