import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { waitForProgressBarToNotExist } from "./progressBar";

export function searchInTable(query) {
  cy.get(SHARED_ELEMENTS.searchInput).type(query);
  waitForProgressBarToNotExist();
}

export function findElementOnTable(elementName) {
  cy.getTextFromElement(SHARED_ELEMENTS.table).then(tableText => {
    if (tableText.includes(elementName)) {
      cy.contains(SHARED_ELEMENTS.tableRow, elementName).click();
    } else {
      cy.get(BUTTON_SELECTORS.nextPaginationButton).click();
      findElementOnTable(elementName);
    }
  });
}
