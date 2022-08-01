/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { SHIPPING_ZONE_DETAILS } from "../../../elements/shipping/shipping-zone-details";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { createChannel } from "../../../support/api/requests/Channels";
import {
  addChannelToShippingMethod,
  addChannelToShippingZone,
} from "../../../support/api/requests/ShippingMethod";
import * as channelsUtils from "../../../support/api/utils/channelsUtils";
import * as shippingUtils from "../../../support/api/utils/shippingUtils";
import { selectChannelInHeader } from "../../../support/pages/channelsPage";
import {
  enterAndSelectShippings,
  enterShippingZone,
} from "../../../support/pages/shippingZones";

describe("As a staff user I want have different shipping method prices for each channel", () => {
  const startsWith = "ChannelShippingMethod";
  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    shippingUtils.deleteShippingStartsWith(startsWith);
    channelsUtils.deleteChannelsStartsWith(startsWith);
  });

  it(
    "should be able to display different price for each channel. TC: SALEOR_0805",
    { tags: ["@shipping", "@allEnv", "@stable"] },
    () => {
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
        currencyCode: createdChannelCurrency,
      }).then(channel => {
        createdChannel = channel;
      });

      shippingUtils
        .createShippingWithDefaultChannel(shippingName, defaultChannelPrice)
        .then(
          ({
            shippingMethod: shippingMethodResp,
            shippingZone: shippingZoneResp,
            defaultChannel: defaultChannelResp,
          }) => {
            shippingZone = shippingZoneResp;
            shippingMethod = shippingMethodResp;
            defaultChannel = defaultChannelResp;

            addChannelToShippingZone(shippingZone.id, createdChannel.id).then(
              () => {
                addChannelToShippingMethod(
                  shippingMethod.id,
                  createdChannel.id,
                  createdChannelPrice,
                );
              },
            );
          },
        )
        .then(() => {
          cy.clearSessionData().loginUserViaRequest(
            "auth",
            ONE_PERMISSION_USERS.shipping,
          );
          enterAndSelectShippings(shippingZone.id, enterShippingZone);
          selectChannelInHeader(defaultChannel.name);
          cy.waitForProgressBarToNotBeVisible()
            .get(SHARED_ELEMENTS.skeleton)
            .should("not.exist")
            .getTextFromElement(
              SHIPPING_ZONE_DETAILS.shippingRatePriceTableCell,
            )
            .then(text => {
              const value = defaultChannelPrice
                .toFixed(2)
                .toString()
                .split(".");
              const valueRegex = new RegExp(value.join("(.|,)"));
              expect(text).to.match(valueRegex);
              expect(text).to.includes(defaultChannel.currencyCode);
              selectChannelInHeader(createdChannel.name);
              cy.waitForProgressBarToNotBeVisible()
                .get(SHARED_ELEMENTS.skeleton)
                .should("not.exist");
            })
            .then(() => {
              cy.getTextFromElement(
                SHIPPING_ZONE_DETAILS.shippingRatePriceTableCell,
              );
            })
            .then(text => {
              const value = createdChannelPrice
                .toFixed(2)
                .toString()
                .split(".");
              const valueRegex = new RegExp(value.join("(.|,)"));
              expect(text).to.match(valueRegex);
              expect(text).to.includes(createdChannelCurrency);
            });
        });
    },
  );
});
