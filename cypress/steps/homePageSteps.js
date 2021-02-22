import { HEADER_SELECTORS } from "../elements/header/header-selectors";
class HomePageSteps {
  changeChannel(channelName) {
    cy.get(HEADER_SELECTORS.channelSelect)
      .click()
      .get(HEADER_SELECTORS.channelSelectList)
      .contains(channelName)
      .click()
      .waitForGraph("Home");
  }
}
export default HomePageSteps;
