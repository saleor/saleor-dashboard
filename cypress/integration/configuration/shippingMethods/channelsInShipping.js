/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { SHIPPING_ZONE_DETAILS } from "../../../elements/shipping/shipping-zone-details";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { createChannel } from "../../../support/api/requests/Channels";
import {
  addChannelToShippingMethod,
  addChannelToShippingZone
} from "../../../support/api/requests/ShippingMethod";
import * as channelsUtils from "../../../support/api/utils/channelsUtils";
import * as shippingUtils from "../../../support/api/utils/shippingUtils";
import filterTests from "../../../support/filterTests";
import { getCurrencyAndAmountInString } from "../../../support/formatData/formatCurrencyAmount";
import { enterHomePageChangeChannelAndReturn } from "../../../support/pages/channelsPage";
import {
  enterAndSelectShippings,
  enterShippingZone
} from "../../../support/pages/shippingZones";

filterTests({ definedTags: ["all"] }, () => {
  describe("As a staff user I want have different shipping method prices for each channel", () => {
    const startsWith = "ChannelShippingMethod";
    let defaultChannel;
    let plAddress;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      shippingUtils.deleteShippingStartsWith(startsWith);
      channelsUtils.deleteChannelsStartsWith(startsWith);

      channelsUtils
        .getDefaultChannel()
        .then(channel => {
          defaultChannel = channel;
          cy.fixture("addresses");
        })
        .then(addresses => {
          plAddress = addresses.plAddress;
        });
    });

    it("should be able to display different price for each channel. TC: SALEOR_0805", () => {
      const shippingName = `${startsWith}${faker.datatype.number()}`;
      const defaultChannelPrice = 11;
      const createdChannelPrice = 7;
      const createdChannelCurrency = "PLN";

      let shippingMethod;
      let shippingZone;
      let createdChannel;

      cy.clearSessionData().loginUserViaRequest();
      createChannel({
        name: shippingName,
        currencyCode: createdChannelCurrency
      })
        .then(channel => {
          createdChannel = channel;
          shippingUtils.createShipping({
            channelId: defaultChannel.id,
            name: shippingName,
            address: plAddress,
            price: defaultChannelPrice
          });
        })
        .then(
          ({
            shippingMethod: shippingMethodResp,
            shippingZone: shippingZoneResp
          }) => {
            shippingZone = shippingZoneResp;
            shippingMethod = shippingMethodResp;
            addChannelToShippingZone(shippingZone.id, createdChannel.id).then(
              () => {
                addChannelToShippingMethod(
                  shippingMethod.id,
                  createdChannel.id,
                  createdChannelPrice
                );
              }
            );
          }
        )
        .then(() => {
          cy.clearSessionData().loginUserViaRequest(
            "auth",
            ONE_PERMISSION_USERS.shipping
          );
          enterAndSelectShippings(shippingZone.id, enterShippingZone);
          enterHomePageChangeChannelAndReturn(defaultChannel.name);
          cy.waitForProgressBarToNotBeVisible()
            .get(SHARED_ELEMENTS.skeleton)
            .should("not.exist")
            .getTextFromElement(
              SHIPPING_ZONE_DETAILS.shippingRatePriceTableCell
            )
            .then(text => {
              const expectedValue = getCurrencyAndAmountInString(
                defaultChannelPrice,
                defaultChannel.currencyCode
              );
              expect(text).to.eq(expectedValue);

              enterHomePageChangeChannelAndReturn(createdChannel.name);
              cy.waitForProgressBarToNotBeVisible()
                .get(SHARED_ELEMENTS.skeleton)
                .should("not.exist");
            })
            .then(() => {
              cy.getTextFromElement(
                SHIPPING_ZONE_DETAILS.shippingRatePriceTableCell
              );
            })
            .then(text => {
              const expectedValue = getCurrencyAndAmountInString(
                createdChannelPrice,
                createdChannelCurrency
              );
              expect(text).to.be.eq(expectedValue);
            });
        });
    });
  });
});
