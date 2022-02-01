/// <reference types="cypress"/>
/// <reference types="../../../../support"/>

import faker from "faker";

import { SHARED_ELEMENTS } from "../../../../elements/shared/sharedElements";
import { SHIPPING_RATE_DETAILS } from "../../../../elements/shipping/shipping-rate-details";
import { urlList, weightRateUrl } from "../../../../fixtures/urlList";
import {
  createShippingRate as createShippingRateViaApi,
  createShippingZone
} from "../../../../support/api/requests/ShippingMethod";
import { updateShopWeightUnit } from "../../../../support/api/requests/ShopSettings";
import { getDefaultChannel } from "../../../../support/api/utils/channelsUtils";
import { deleteProductsStartsWith } from "../../../../support/api/utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../../../support/api/utils/shippingUtils";
import filterTests from "../../../../support/filterTests";
import { changeWeightUnit } from "../../../../support/pages/shippingMethodPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Recalculate weights", () => {
    const startsWith = "RecalculateWeight";
    const name = `${startsWith}${faker.datatype.number()}`;

    let defaultChannel;
    let usAddress;
    let shippingZone;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteShippingStartsWith(startsWith);
      deleteProductsStartsWith(startsWith);

      updateShopWeightUnit("KG")
        .then(() => {
          getDefaultChannel().then(channel => {
            defaultChannel = channel;
            cy.fixture("addresses");
          });
        })
        .then(({ usAddress: usAddressResp }) => {
          usAddress = usAddressResp;
          createShippingZone(name, "US", defaultChannel.id);
        })
        .then(shippingZoneResp => {
          shippingZone = shippingZoneResp;
        });
    });

    // Log in as user with shipping permissions after resolving SALEOR-3407 bug
    it("should recalculate weight after changing shipping weight unit", () => {
      const rateName = `${startsWith}${faker.datatype.number()}`;
      const minWeightInKg = 1;
      const maxWeightInKg = 10;
      const minWeightInG = minWeightInKg * 1000;
      const maxWeightInG = maxWeightInKg * 1000;
      let shippingMethod;

      cy.clearSessionData().loginUserViaRequest();

      createShippingRateViaApi({
        name: rateName,
        shippingZone: shippingZone.id,
        type: "WEIGHT",
        maxWeight: maxWeightInKg,
        minWeight: minWeightInKg
      })
        .then(({ shippingMethod: shippingMethodResp }) => {
          shippingMethod = shippingMethodResp;
          cy.visit(urlList.shippingMethods)
            .get(SHARED_ELEMENTS.progressBar)
            .should("not.exist");
          changeWeightUnit("G");

          cy.addAliasToGraphRequest("ShippingZone");
          cy.visit(weightRateUrl(shippingZone.id, shippingMethod.id))
            .wait("@ShippingZone")
            .its("response.body");
        })
        .then(responseArray => {
          const shippingMethods = responseArray.find(
            element => element.data.shippingZone
          ).data.shippingZone.shippingMethods;
          const rate = shippingMethods.find(
            element => element.id === shippingMethod.id
          );
          cy.waitForProgressBarToNotBeVisible();
          expect(rate.minimumOrderWeight.unit).to.eq("G");
          cy.get(SHIPPING_RATE_DETAILS.restrictWeightLimitCheckbox)
            .click()
            .get(SHIPPING_RATE_DETAILS.minWeightInput)
            .invoke("val");
        })
        .then(actualMinWeight => {
          expect(parseInt(actualMinWeight, 10)).to.eq(minWeightInG);
          cy.get(SHIPPING_RATE_DETAILS.maxWeightInput).invoke("val");
        })
        .then(actualMaxWeight => {
          expect(parseInt(actualMaxWeight, 10)).to.eq(maxWeightInG);
        });
    });
  });
});
