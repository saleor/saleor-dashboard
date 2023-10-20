/// <reference types="cypress"/>
/// <reference types="../../support"/>

import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { urlList } from "../../fixtures/urlList";
import { updateShopAddress } from "../../support/api/requests/ShopSettings";

describe("Tests for site settings", () => {
  let address;

  before(() => {
    cy.loginUserViaRequest();

    cy.fixture("addresses").then(({ usAddress, plAddress }) => {
      address = usAddress;
      updateShopAddress(plAddress);
      cy.checkIfDataAreNotNull(address);
    });
  });

  it(
    "should change store address",
    { tags: ["@siteSettings", "@allEnv", "@stable"] },
    () => {
      cy.clearSessionData()
        .loginUserViaRequest()
        .visit(urlList.siteSettings)
        .fillUpBasicAddress(address)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear();
    },
  );
});
