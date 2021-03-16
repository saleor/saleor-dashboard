import { HEADER_SELECTORS } from "../elements/header/header-selectors";
export function changeChannel(channelName) {
  cy.get(HEADER_SELECTORS.channelSelect).click();
  cy.addAliasToGraphRequest("Home");
  cy.get(HEADER_SELECTORS.channelSelectList)
    .contains(channelName)
    .click();
  cy.wait("@Home");
}
