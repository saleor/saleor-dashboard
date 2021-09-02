import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";

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
