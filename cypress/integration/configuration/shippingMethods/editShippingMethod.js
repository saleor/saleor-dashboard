// / <reference types="cypress"/>
// / <reference types="../../../support"/>

import faker from "faker";

import {
  priceRateUrl,
  shippingZoneDetailsUrl
} from "../../../fixtures/urlList";
import {
  addChannelToShippingMethod,
  createShippingRate,
  createShippingZone,
  getShippingZone
} from "../../../support/api/requests/ShippingMethod";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import { deleteProductsStartsWith } from "../../../support/api/utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../../support/api/utils/shippingUtils";
import filterTests from "../../../support/filterTests";
import {
  fillUpShippingRate,
  saveRate,
  saveRateAfterUpdate
} from "../../../support/pages/shippingMethodPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Postal codes in shipping", () => {
    const startsWith = "CyShippingMethods-";
    const name = `${startsWith}${faker.datatype.number()}`;

    const price = 10;

    let defaultChannel;
    let usAddress;
    let secondUsAddress;
    let shippingZone;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteShippingStartsWith(startsWith);
      deleteProductsStartsWith(startsWith);

      getDefaultChannel()
        .then(channel => {
          defaultChannel = channel;
          cy.fixture("addresses");
        })
        .then(
          ({
            usAddress: usAddressResp,
            secondUsAddress: secondUsAddressResp
          }) => {
            usAddress = usAddressResp;
            secondUsAddress = secondUsAddressResp;
            createShippingZone(name, "US", defaultChannel.id);
          }
        )
        .then(shippingZoneResp => {
          shippingZone = shippingZoneResp;
        });
    });

    beforeEach(() => {
      cy.clearSessionData()
        .loginUserViaRequest()
        .visit(shippingZoneDetailsUrl(shippingZone.id));
    });

    it("Update shipping rate", () => {
      const rateName = `${startsWith}${faker.datatype.number()}`;
      const updatedRateName = `${startsWith}Updated`;
      const deliveryTime = { min: 1, max: 7 };
      const weightLimits = { min: 0, max: 20 };
      let shippingMethod;

      createShippingRate({
        name: rateName,
        shippingZone: shippingZone.id
      })
        .then(({ shippingMethod: shippingResp }) => {
          shippingMethod = shippingResp;
          addChannelToShippingMethod(shippingMethod.id, defaultChannel.id, 1);
        })
        .then(() => {
          cy.visit(priceRateUrl(shippingZone.id, shippingMethod.id));
          fillUpShippingRate({
            rateName: updatedRateName,
            price: 100,
            deliveryTime
          });
          saveRateAfterUpdate();
          getShippingZone(shippingZone.id);
        })
        .then(({ shippingMethods }) => {
          expect(shippingMethods).to.have.length(1);
          chai
            .softExpect(shippingMethods[0].minimumDeliveryDays)
            .to.be.eq(deliveryTime.min);
          chai
            .softExpect(shippingMethods[0].maximumDeliveryDays)
            .to.be.eq(deliveryTime.max);
          chai
            .softExpect(shippingMethods[0].channelListings.maximumOrderPrice)
            .to.be.eq(price);
        });
    });
  });
});
