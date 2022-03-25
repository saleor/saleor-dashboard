// / <reference types="cypress"/>
// / <reference types="../../../support"/>

import faker from "faker";

import { shippingRateUrl } from "../../../fixtures/urlList";
import {
  addChannelToShippingMethod,
  createShippingRate,
  createShippingZone,
  getShippingZone
} from "../../../support/api/requests/ShippingMethod";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import { deleteShippingStartsWith } from "../../../support/api/utils/shippingUtils";
import filterTests from "../../../support/filterTests";
import {
  fillUpShippingRate,
  saveRateAfterUpdate
} from "../../../support/pages/shippingMethodPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("As a user I should be able to update and delete shipping method", () => {
    const startsWith = "EditShipping-";
    const name = `${startsWith}${faker.datatype.number()}`;
    const price = 10;

    let defaultChannel;
    let shippingZone;
    let shippingMethod;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteShippingStartsWith(startsWith);

      getDefaultChannel()
        .then(channel => {
          defaultChannel = channel;
          createShippingZone(name, "US", defaultChannel.id);
        })
        .then(shippingZoneResp => {
          shippingZone = shippingZoneResp;
        });
    });

    beforeEach(() => {
      const rateName = `${startsWith}${faker.datatype.number()}`;

      cy.clearSessionData().loginUserViaRequest();
      createShippingRate({
        name: rateName,
        shippingZone: shippingZone.id
      }).then(({ shippingMethod: shippingResp }) => {
        shippingMethod = shippingResp;
        addChannelToShippingMethod(shippingMethod.id, defaultChannel.id, 1);
      });
    });

    it("should be able to update shipping rate. TC: SALEOR_0806", () => {
      const updatedRateName = `${startsWith}Updated`;
      const deliveryTime = { min: 1, max: 7 };

      cy.visit(shippingRateUrl(shippingZone.id, shippingMethod.id));
      fillUpShippingRate({
        rateName: updatedRateName,
        price,
        deliveryTime
      });
      saveRateAfterUpdate();
      getShippingZone(shippingZone.id).then(({ shippingMethods }) => {
        expect(shippingMethods).to.have.length(1);
        chai
          .softExpect(shippingMethods[0].minimumDeliveryDays)
          .to.be.eq(deliveryTime.min);
        chai
          .softExpect(shippingMethods[0].maximumDeliveryDays)
          .to.be.eq(deliveryTime.max);
        chai
          .softExpect(shippingMethods[0].channelListings[0].price.amount)
          .to.be.eq(price);
      });
    });

    it("should be able to delete shipping rate. TC: SALEOR_0807", () => {
      cy.visit(
        shippingRateUrl(shippingZone.id, shippingMethod.id)
      ).deleteElementWithReqAlias("DeleteShippingRate");
      getShippingZone(shippingZone.id).then(({ shippingMethods }) => {
        const deletedShipping = shippingMethods.find(
          element => element.id === shippingMethod.id
        );
        expect(deletedShipping).to.be.not.ok;
      });
    });
  });
});
