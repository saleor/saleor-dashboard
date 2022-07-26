import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";

Cypress.Commands.add("searchInTable", query => {
  cy.get(SHARED_ELEMENTS.searchInput)
    .type(query)
    .get(SHARED_ELEMENTS.progressBar)
    .should("be.visible")
    .waitForProgressBarToNotExist();
});

// This command is searching for element/s on table, and then make an action on this element/s (select checkbox, or click)
// Before this command execute cy.addAliasToGraphRequest(), same alias pass as elementsGraphqlAlias parameter
// elementsName is for example "shippingZones", pass elements ids in array, or single element id in elementsIds
// action function is click or select checkbox on table with parameter id
Cypress.Commands.add(
  "findElementsAndMakeActionOnTable",
  ({
    elementsGraphqlAlias,
    elementsName,
    elementsIds,
    counter = 0,
    actionFunction
  }) => {
    cy.wait(`@${elementsGraphqlAlias}`)
      .its("response.body")
      .then(body => {
        let shippingResults;
        if (Array.isArray(body)) {
          shippingResults = body.find(element => {
            if (element.data[elementsName]) {
              return element;
            }
          });
        } else {
          shippingResults = body;
        }
        const shippingList = shippingResults.data[elementsName].edges;
        const notSelectedElements = [];
        elementsIds = Array.isArray(elementsIds) ? elementsIds : [elementsIds];
        elementsIds.forEach(id => {
          const isShippingOnList = shippingList.find(
            element => element.node.id === id
          );
          if (isShippingOnList) {
            actionFunction(id);
            counter += 1;
          } else {
            notSelectedElements.push(id);
          }
          if (counter === elementsIds.length) {
            return;
          }
        });
        if (counter === elementsIds.length) {
          return;
        }
        cy.get(SHARED_ELEMENTS.skeleton)
          .should("not.exist")
          .get(BUTTON_SELECTORS.nextPaginationButton)
          .click()
          .findElementsAndMakeActionOnTable({
            elementsIds: notSelectedElements,
            actionFunction,
            counter,
            elementsGraphqlAlias,
            elementsName
          });
      });
  }
);
