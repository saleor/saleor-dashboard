/// <reference types="cypress"/>
/// <reference types="../../../../support"/>

import faker from "faker";

import { SHARED_ELEMENTS } from "../../../../elements/shared/sharedElements";
import { SHIPPING_RATE_DETAILS } from "../../../../elements/shipping/shipping-rate-details";
import { shippingRateUrl, urlList } from "../../../../fixtures/urlList";
import { updateChannelWarehouses } from "../../../../support/api/requests/Channels";
import {
  createShippingRate as createShippingRateViaApi,
  createShippingZone,
} from "../../../../support/api/requests/ShippingMethod";
import { updateShopWeightUnit } from "../../../../support/api/requests/ShopSettings";
import { createWarehouse } from "../../../../support/api/requests/Warehouse";
import { getDefaultChannel } from "../../../../support/api/utils/channelsUtils";
import { deleteProductsStartsWith } from "../../../../support/api/utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../../../support/api/utils/shippingUtils";
import { changeWeightUnit } from "../../../../support/pages/shippingMethodPage";

describe("As a staff user I want to change shop default weight unit", () => {
  const startsWith = "RecalculateWeight";
  const name = `${startsWith}${faker.datatype.number()}`;

  let defaultChannel;
  let usAddress;
  let shippingZone;
  let warehouse;

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

        createWarehouse({ name, address: usAddress }).then(warehouseResp => {
          warehouse = warehouseResp;

          updateChannelWarehouses(defaultChannel.id, warehouse.id);
          createShippingZone(name, "US", defaultChannel.id, warehouse.id);
        });
      })
      .then(shippingZoneResp => {
        shippingZone = shippingZoneResp;
      });
  });

  it(
    "should recalculate weight after changing shipping weight unit. TC: SALEOR_0901",
    { tags: ["@shipping", "@allEnv", "@stable"] },
    () => {
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
        minWeight: minWeightInKg,
      })
        .then(({ shippingMethod: shippingMethodResp }) => {
          shippingMethod = shippingMethodResp;
          cy.visit(urlList.shippingMethods)
            .get(SHARED_ELEMENTS.progressBar)
            .should("not.exist");
          changeWeightUnit("G");

          cy.addAliasToGraphRequest("ShippingZone");
          cy.visit(shippingRateUrl(shippingZone.id, shippingMethod.id))
            .wait("@ShippingZone")
            .its("response.body");
        })
        .then(responseArray => {
          const shippingMethods =
            responseArray.data.shippingZone.shippingMethods;
          const rate = shippingMethods.find(
            element => element.id === shippingMethod.id,
          );
          cy.waitForProgressBarToNotBeVisible();
          expect(rate.minimumOrderWeight.unit).to.eq("G");
          cy.get(SHIPPING_RATE_DETAILS.restrictWeightLimitCheckbox)
            .click()
            .get(SHIPPING_RATE_DETAILS.minValueInput)
            .invoke("val");
        })
        .then(actualMinWeight => {
          expect(parseInt(actualMinWeight, 10)).to.eq(minWeightInG);
          cy.get(SHIPPING_RATE_DETAILS.maxValueInput).invoke("val");
        })
        .then(actualMaxWeight => {
          expect(parseInt(actualMaxWeight, 10)).to.eq(maxWeightInG);
        });
    },
  );
});
