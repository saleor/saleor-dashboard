import faker from "faker";

import { getShopInfo, updateShopAddress } from "../../apiRequests/shopSettings";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SITE_SETTINGS_DETAILS } from "../../elements/siteSettings/site-settings-details";
import { fillUpBasicAddress } from "../../steps/shared/addressForm";
import { confirmationMessageShouldDisappear } from "../../steps/shared/confirmationMessages";
import filterTests from "../../support/filterTests";
import { urlList } from "../../url/urlList";

filterTests(["all"], () => {
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
        .click();
      confirmationMessageShouldDisappear();
      getShopInfo().then(shopInfo => {
        expect(shopInfo.name).to.eq(name);
      });
    });

    it("should change site url", () => {
      const url = `http://cypress${faker.datatype.number()}.saleor.com`;

      cy.get(SITE_SETTINGS_DETAILS.urlInput)
        .clearAndType(url)
        .get(BUTTON_SELECTORS.confirm)
        .click();
      confirmationMessageShouldDisappear();
      getShopInfo().then(shopInfo => {
        expect(shopInfo.domain.host).to.eq(url);
      });
    });

    it("should change store description", () => {
      const description = faker.lorem.sentence();

      cy.get(SITE_SETTINGS_DETAILS.descriptionInput)
        .clearAndType(description)
        .get(BUTTON_SELECTORS.confirm)
        .click();
      confirmationMessageShouldDisappear();
      getShopInfo().then(shopInfo => {
        expect(shopInfo.description).to.eq(description);
      });
    });

    it("should change store address", () => {
      fillUpBasicAddress(address);
      cy.get(BUTTON_SELECTORS.confirm).click();
      confirmationMessageShouldDisappear();
      getShopInfo().then(({ companyAddress }) => {
        expect(companyAddress.companyName).to.eq(address.companyName);
        cy.expectCorrectBasicAddress(companyAddress, address);
      });
    });
  });
});
