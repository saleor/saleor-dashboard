/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SITE_SETTINGS_DETAILS } from "../../elements/siteSettings/site-settings-details";
import { urlList } from "../../fixtures/urlList";
import {
  getShopInfo,
  updateShopAddress
} from "../../support/api/requests/ShopSettings";
import filterTests from "../../support/filterTests";

filterTests({ definedTags: ["all"] }, () => {
  describe("Tests for site settings", () => {
    let address;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();

      cy.fixture("addresses").then(({ usAddress, plAddress }) => {
        address = usAddress;
        updateShopAddress(plAddress);
      });
    });

    beforeEach(() => {
      cy.clearSessionData()
        .loginUserViaRequest()
        .visit(urlList.siteSettings);
    });

    it("should change store name", () => {
      const name = `Cypress-${faker.datatype.number()}`;

      cy.get(SITE_SETTINGS_DETAILS.nameInput)
        .clearAndType(name)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear();
      getShopInfo().then(shopInfo => {
        expect(shopInfo.name).to.eq(name);
      });
    });

    it("should change store description", () => {
      const description = faker.lorem.sentence();

      cy.get(SITE_SETTINGS_DETAILS.descriptionInput)
        .clearAndType(description)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear();
      getShopInfo().then(shopInfo => {
        expect(shopInfo.description).to.eq(description);
      });
    });

    it("should change store address", () => {
      cy.fillUpBasicAddress(address)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear();
      getShopInfo().then(({ companyAddress }) => {
        expect(companyAddress.companyName).to.eq(address.companyName);
        cy.expectCorrectBasicAddress(companyAddress, address);
      });
    });
  });
});
