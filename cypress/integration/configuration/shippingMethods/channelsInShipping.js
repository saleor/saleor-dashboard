// <reference types="cypress" />
import faker from "faker";

import { createChannel } from "../../../apiRequests/Channels";
import {
  addChannelToShippingMethod,
  addChannelToShippingZone
} from "../../../apiRequests/ShippingMethod";
import { ONE_PERMISSION_USERS } from "../../../Data/users";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { SHIPPING_ZONE_DETAILS } from "../../../elements/shipping/shipping-zone-details";
import { selectChannelInHeader } from "../../../steps/channelsSteps";
import { waitForProgressBarToNotExist } from "../../../steps/shared/progressBar";
import filterTests from "../../../support/filterTests";
import { getFormattedCurrencyAmount } from "../../../support/format/formatCurrencyAmount";
import { urlList } from "../../../url/urlList";
import * as channelsUtils from "../../../utils/channelsUtils";
import * as shippingUtils from "../../../utils/shippingUtils";

filterTests(["all"], () => {
  describe("Channels in shippingMethod", () => {
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

    it("should display different price for each channel", () => {
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
          cy.clearSessionData()
            .loginUserViaRequest("auth", ONE_PERMISSION_USERS.shipping)
            .visit(urlList.shippingMethods)
            .get(SHARED_ELEMENTS.header)
            .should("be.visible");
          waitForProgressBarToNotExist();
          cy.addAliasToGraphRequest("ShippingZone");
          cy.getTextFromElement(SHARED_ELEMENTS.table);
        })
        .then(tableText => {
          if (!tableText.includes(shippingZone.name)) {
            cy.get(BUTTON_SELECTORS.nextPaginationButton).click();
          }
          cy.contains(shippingZone.name).click();
          cy.wait("@ShippingZone");
          selectChannelInHeader(defaultChannel.name);
          cy.getTextFromElement(
            SHIPPING_ZONE_DETAILS.shippingRatePriceTableCell
          )
            .then(text => {
              const expectedValue = getFormattedCurrencyAmount(
                defaultChannelPrice,
                defaultChannel.currencyCode
              );
              expect(text).to.be.eq(expectedValue);

              selectChannelInHeader(createdChannel.name);
            })
            .then(() => {
              cy.getTextFromElement(
                SHIPPING_ZONE_DETAILS.shippingRatePriceTableCell
              );
            })
            .then(text => {
              const expectedValue = getFormattedCurrencyAmount(
                createdChannelPrice,
                createdChannelCurrency
              );
              expect(text).to.be.eq(expectedValue);
            });
        });
    });
  });
});
