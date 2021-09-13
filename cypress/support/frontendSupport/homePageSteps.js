import { HEADER_SELECTORS } from "../elements/header/header-selectors";
import { HOMEPAGE_SELECTORS } from "../elements/homePage/homePage-selectors";

export function changeChannel(channelName) {
  cy.get(HEADER_SELECTORS.channelSelect).click();
  cy.addAliasToGraphRequest("Home");
  cy.get(HEADER_SELECTORS.channelSelectList)
    .contains(channelName)
    .click();
  cy.wait("@Home");
}

export function expectWelcomeMessageIncludes(name) {
  cy.get(HOMEPAGE_SELECTORS.welcomeMessage)
    .invoke("text")
    .then(text => {
      expect(text, `welcome message should contains ${name}`).to.contains(name);
    });
}
