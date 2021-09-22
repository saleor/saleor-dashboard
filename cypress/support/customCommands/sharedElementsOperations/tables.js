import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";

Cypress.Commands.add("findElementOnTable", elementName => {
  cy.getTextFromElement(SHARED_ELEMENTS.table).then(tableText => {
    if (tableText.includes(elementName)) {
      cy.contains(SHARED_ELEMENTS.tableRow, elementName).click({ force: true });
    } else {
      cy.get(BUTTON_SELECTORS.nextPaginationButton)
        .click()
        .findElementOnTable(elementName);
    }
  });
});

Cypress.Commands.add("searchInTable", query => {
  cy.get(SHARED_ELEMENTS.searchInput)
    .type(query)
    .waitForProgressBarToNotExist();
});
