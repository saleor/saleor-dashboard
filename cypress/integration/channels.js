import faker from "faker";

import Channels from "../apiRequests/Channels";
import { LEFT_MENU_SELECTORS } from "../elements/account/left-menu/left-menu-selectors";
import { PRODUCTS_SELECTORS } from "../elements/catalog/product-selectors";
import { ADD_CHANNEL_FORM_SELECTOS } from "../elements/channels/add-channel-form-selectors";
import { CHANNEL_FORM_SELECTORS } from "../elements/channels/channel-form-selectors";
import { CHANNELS_SELECTORS } from "../elements/channels/channels-selectors";
import { CONFIGURATION_SELECTORS } from "../elements/configuration/configuration-selectors";
import { HEADER_SELECTORS } from "../elements/header/header-selectors";
import { DRAFT_ORDER_SELECTORS } from "../elements/orders/draft-order-selectors";
import { ORDERS_SELECTORS } from "../elements/orders/orders-selectors";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { URL_LIST } from "../url/url-list";
import ChannelsUtils from "../utils/channelsUtils";

describe("Channels", () => {
  const channelStartsWith = "Cypress:";
  const currency = "PLN";
  const channels = new Channels();
  const channelsUtils = new ChannelsUtils();

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    channels.deleteTestChannels(channelStartsWith);
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should navigate to channels page", () => {
    cy.visit("/")
      .get(LEFT_MENU_SELECTORS.configuration)
      .click()
      .get(CONFIGURATION_SELECTORS.channels)
      .click()
      .location("pathname")
      .should("contain", URL_LIST.channels);
  });

  it("should create new channel", () => {
    const randomChannel = `${channelStartsWith} ${faker.random.number()}`;
    cy.visit(URL_LIST.channels).waitForGraph("Channels");
    channelsUtils.createChannelByView(randomChannel, currency);
    cy.waitForGraph("Channel")
      .get(ADD_CHANNEL_FORM_SELECTOS.backToChannelsList)
      .click()
      .get(CHANNELS_SELECTORS.channelsTable)
      .contains(randomChannel)
      .visit(URL_LIST.dashbord)
      .get(HEADER_SELECTORS.channelSelect)
      .click()
      .get(HEADER_SELECTORS.channelSelectList)
      .contains(randomChannel)
      .click()
      .visit(URL_LIST.products)
      .waitForGraph("InitialProductFilterData");
    cy.get(PRODUCTS_SELECTORS.productsList)
      .first()
      .click()
      .get(PRODUCTS_SELECTORS.availableManageButton)
      .click()
      .get(PRODUCTS_SELECTORS.channelsAvailabilityForm)
      .contains(randomChannel);
  });

  it("should validate slug name", () => {
    const randomChannel = `${channelStartsWith} ${faker.random.number()}`;
    channels.createChannel(false, randomChannel, randomChannel, currency);
    cy.visit(URL_LIST.channels);
    channelsUtils.createChannelByView(randomChannel, currency);
    cy.get(ADD_CHANNEL_FORM_SELECTOS.slugValidationMessage).should(
      "be.visible"
    );
  });

  it("should validate currency", () => {
    const randomChannel = `${channelStartsWith} ${faker.random.number()}`;
    cy.visit(URL_LIST.channels);
    channelsUtils.createChannelByView(
      randomChannel,
      currency,
      "notExistingCurrency"
    );
    cy.get(ADD_CHANNEL_FORM_SELECTOS.currencyValidationMassege).should(
      "be.visible"
    );
  });

  it("should delete channel", () => {
    const randomChannelToDelete = `${channelStartsWith} ${faker.random.number()}`;
    channels.createChannel(
      false,
      randomChannelToDelete,
      randomChannelToDelete,
      currency
    );
    cy.visit(URL_LIST.channels).waitForGraph("Channels");
    cy.get(CHANNELS_SELECTORS.channelName)
      .contains(randomChannelToDelete)
      .parentsUntil(CHANNELS_SELECTORS.channelsTable)
      .find("button")
      .click()
      .get(BUTTON_SELECTORS.submit)
      .click()
      .waitForGraph("Channels");
    cy.get(CHANNELS_SELECTORS.channelName)
      .contains(randomChannelToDelete)
      .should("not.exist");
  });

  it("should not be possible to add products to order with inactive channel", () => {
    const randomChannel = `${channelStartsWith} ${faker.random.number()}`;
    channels.createChannel(false, randomChannel, randomChannel, currency);
    cy.visit(URL_LIST.orders)
      .get(ORDERS_SELECTORS.createOrder)
      .click()
      .get(CHANNEL_FORM_SELECTORS.channelSelect)
      .click()
      .get(CHANNEL_FORM_SELECTORS.channelOption)
      .contains(randomChannel)
      .click()
      .get(CHANNEL_FORM_SELECTORS.confirmButton)
      .click();
    cy.location()
      .should(loc => {
        const urlRegex = new RegExp(`${URL_LIST.orders}.+`, "g");
        expect(loc.pathname).to.match(urlRegex);
      })
      .get(DRAFT_ORDER_SELECTORS.addProducts)
      .should("not.exist");
  });
});
