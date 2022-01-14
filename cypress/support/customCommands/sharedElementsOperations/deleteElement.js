import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";

Cypress.Commands.add("deleteElementWithReqAlias", alias =>
  cy
    .get(BUTTON_SELECTORS.deleteButton)
    .click()
    .addAliasToGraphRequest(alias)
    .get(BUTTON_SELECTORS.submit)
    .click()
    .waitForRequestAndCheckIfNoErrors(`@${alias}`)
);
