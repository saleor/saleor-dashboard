/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { CHANNEL_FORM_SELECTORS } from "../../elements/channels/channel-form-selectors";
import { HEADER_SELECTORS } from "../../elements/header/header-selectors";
import { DRAFT_ORDER_SELECTORS } from "../../elements/orders/draft-order-selectors";
import { ORDERS_SELECTORS } from "../../elements/orders/orders-selectors";
import { urlList } from "../../fixtures/urlList";
import { createChannel } from "../../support/api/requests/Channels";
import * as channelsUtils from "../../support/api/utils/channelsUtils";
import {
  selectChannelInHeader,
  selectChannelInPicker,
} from "../../support/pages/channelsPage";

xdescribe("Channels in draft orders", () => {
  const startsWith = "CyChannelInDraftOrders-";
  const randomName = startsWith + faker.datatype.number();

  let defaultChannel;
  let otherChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    channelsUtils.deleteChannelsStartsWith(startsWith);
    channelsUtils
      .getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        createChannel({ name: randomName });
      })
      .then(channelResp => {
        otherChannel = channelResp;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "Draft order channel should be taken from global channel picker",
    { tags: ["@orders", "@allEnv"] },
    () => {
      let channelName;
      cy.visit(urlList.homePage);
      cy.getTextFromElement(HEADER_SELECTORS.channelSelect).then(
        channelInHeader => {
          channelName = channelInHeader;
        },
      );
      cy.visit(urlList.orders)
        .get(ORDERS_SELECTORS.createOrder)
        .click();
      cy.getTextFromElement(CHANNEL_FORM_SELECTORS.channelSelect).then(
        selectedChannelName => {
          expect(channelName).to.contains(selectedChannelName);
        },
      );
      cy.get(CHANNEL_FORM_SELECTORS.confirmButton).click();
      cy.getTextFromElement(DRAFT_ORDER_SELECTORS.salesChannel).then(
        channelNameInDraftOrder => {
          expect(channelName).to.contains(channelNameInDraftOrder);
        },
      );
    },
  );

  it(
    "Draft order channel should be taken from global channel picker when changed",
    { tags: ["@orders", "@allEnv"] },
    () => {
      cy.visit(urlList.homePage);
      selectChannelInHeader(otherChannel.name);
      cy.visit(urlList.orders);
      cy.get(ORDERS_SELECTORS.createOrder).click();
      cy.getTextFromElement(CHANNEL_FORM_SELECTORS.channelSelect).then(
        channelInSelect => {
          expect(channelInSelect).to.be.eq(otherChannel.name);
        },
      );
      cy.get(CHANNEL_FORM_SELECTORS.confirmButton).click();
      cy.getTextFromElement(DRAFT_ORDER_SELECTORS.salesChannel).then(
        channelInDraftOrder => {
          expect(channelInDraftOrder).to.be.eq(otherChannel.name);
        },
      );
    },
  );

  it(
    "should create draft order with chosen channel",
    { tags: ["@orders", "@allEnv"] },
    () => {
      cy.visit(urlList.homePage);
      selectChannelInHeader(defaultChannel.name);
      cy.visit(urlList.orders);
      cy.get(ORDERS_SELECTORS.createOrder).click();
      cy.getTextFromElement(CHANNEL_FORM_SELECTORS.channelSelect).then(
        channelInSelect => {
          expect(channelInSelect).to.be.eq(defaultChannel.name);
        },
      );
      selectChannelInPicker(otherChannel.name);
      cy.getTextFromElement(DRAFT_ORDER_SELECTORS.salesChannel).then(
        channelInDraftOrder => {
          expect(channelInDraftOrder).to.be.eq(otherChannel.name);
        },
      );
    },
  );
});
