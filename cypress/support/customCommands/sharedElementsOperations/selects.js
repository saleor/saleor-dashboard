import { DRAFT_ORDER_SELECTORS, PAGINATION } from "../../../elements";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import {
  selectorWithDataValue,
  SHARED_ELEMENTS,
} from "../../../elements/shared/sharedElements";

Cypress.Commands.add("clickRowNumberButton", () =>
  cy.get(PAGINATION.rowNumberButton).click(),
);
Cypress.Commands.add("getRowNumberButton", () =>
  cy.get(PAGINATION.rowNumberButton),
);
Cypress.Commands.add("clickNextPagePaginationButton", () =>
  cy.get(PAGINATION.rowNumberButton),
);
Cypress.Commands.add("clickPrevPagePaginationButton", () =>
  cy.get(PAGINATION.previousPagePaginationButton),
);
Cypress.Commands.add("clickSubmitButton", () =>
  cy.get(BUTTON_SELECTORS.submit).click(),
);
Cypress.Commands.add("clickConfirmButton", () =>
  cy.get(BUTTON_SELECTORS.confirm).click(),
);
Cypress.Commands.add("clickFinalizeButton", () =>
  cy.get(DRAFT_ORDER_SELECTORS.finalizeButton).click(),
);
Cypress.Commands.add("openColumnPicker", () =>
  cy.get(SHARED_ELEMENTS.openColumnPickerButton).click(),
);

Cypress.Commands.add("createNewOption", (selectSelector, newOption) => {
  cy.get(selectSelector).type(newOption);
  cy.contains(BUTTON_SELECTORS.selectOption, newOption)
    .should("be.visible")
    .click()
    .get(selectSelector)
    .find("input")
    .first()
    .click({ force: true });
});

Cypress.Commands.add("fillNewMultiSelect", (selectSelector, option) => {
  cy.fillAutocompleteSelect(selectSelector, option, true).then(
    returnedOption => {
      cy.get(SHARED_ELEMENTS.header)
        .first()
        .click({ force: true })
        .get(SHARED_ELEMENTS.multiselect.selectedOptions)
        .should("be.visible");
      return cy.wrap(returnedOption);
    },
  );
});

Cypress.Commands.add("fillMultiSelect", (selectSelector, option) => {
  cy.fillAutocompleteSelect(selectSelector, option, true).then(
    returnedOption => {
      cy.get(SHARED_ELEMENTS.header)
        .first()
        .click({ force: true })
        .get(SHARED_ELEMENTS.multiAutocomplete.selectedOptions)
        .should("be.visible");
      return cy.wrap(returnedOption);
    },
  );
});

Cypress.Commands.add("fillBaseSelect", (selectSelector, value) => {
  cy.get(selectSelector)
    .should("not.have.attr", "aria-disabled", "true")
    .click()
    .get(selectorWithDataValue(value))
    .click();
});

Cypress.Commands.add(
  "fillAutocompleteSelect",
  (selectSelector, option, isForce = false) => {
    let selectedOption = option;
    console.log("isForce", isForce);
    cy.get(selectSelector)
      .click(isForce ? { force: true } : undefined)
      .get(BUTTON_SELECTORS.selectOption)
      .should("be.visible");
    if (option) {
      cy.get(BUTTON_SELECTORS.selectOption)
        .first()
        .then(detachedOption => {
          cy.get(selectSelector).then(select => {
            if (select.find("input").length > 0) {
              cy.get(selectSelector)
                .find("input")
                .clear()
                .type(option, { delay: 10 });
            } else {
              cy.get(selectSelector).clear().type(option, { delay: 10 });
            }
          });
          cy.wrap(detachedOption).should(det => {
            Cypress.dom.isDetached(det);
          });
          cy.contains(BUTTON_SELECTORS.selectOption, option)
            .should("be.visible")
            .click({ force: true })
            .then(() => selectedOption);
        });
    } else {
      cy.get(BUTTON_SELECTORS.selectOption)
        .wait(1000)
        .first()
        .invoke("text")
        .then(text => {
          selectedOption = text;
        });
      return cy
        .get(BUTTON_SELECTORS.selectOption)
        .first()
        .click()
        .then(() => selectedOption);
    }
  },
);
