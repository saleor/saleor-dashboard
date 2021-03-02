// <reference types="cypress" />
import faker from "faker";

import { CHANNEL_FORM_SELECTORS } from "../../elements/channels/channel-form-selectors";
import { HEADER_SELECTORS } from "../../elements/header/header-selectors";
import { DRAFT_ORDER_SELECTORS } from "../../elements/orders/draft-order-selectors";
import { ORDERS_SELECTORS } from "../../elements/orders/orders-selectors";
import { urlList } from "../../url/urlList";
import ChannelsUtils from "../../utils/channelsUtils";

describe("Channels in draft orders", () => {
  const startsWith = "Cy-";
  const randomName = startsWith + faker.random.number();

  const channelsUtils = new ChannelsUtils();

  let defaultChannel;
  let otherChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    channelsUtils.deleteChannels(startsWith);
    channelsUtils
      .getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        channelsUtils.createChannel({ name: randomName });
      })
      .then(() => {
        otherChannel = channelsUtils.getCreatedChannel();
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("Draft order channel should be taken from global channel picker", () => {
    let channelName;
    cy.visit(urlList.homePage)
      .get(HEADER_SELECTORS.channelSelect)
      .invoke("text")
      .then(text => {
        channelName = text;
        cy.visit(urlList.orders)
          .get(ORDERS_SELECTORS.createOrder)
          .click();
        cy.get(CHANNEL_FORM_SELECTORS.channelSelect).invoke("text");
      })
      .then(selectedChannelName => {
        expect(channelName).to.contains(selectedChannelName);
        cy.get(CHANNEL_FORM_SELECTORS.confirmButton)
          .click()
          .get(DRAFT_ORDER_SELECTORS.salesChannel)
          .invoke("text");
      })
      .then(channelNameInDraftOrder => {
        expect(channelName).to.contains(channelNameInDraftOrder);
      });
  });
  it("Draft order channel should be taken from global channel picker when changed", () => {
    /*
        visit home page
        pick created channel
        visit orders
        expect created channel in picker
        create order
        expect order in created channel
        */
  });
  it("should create draft order with choosen channel", () => {
    /*
        visit home page
        pick channel - default
        visit orders
        expect default channel in picker
        pick created channel
        create order
        expect order in created channel
        */
  });
});
