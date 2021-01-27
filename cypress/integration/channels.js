import faker from "faker";

import Channels from "../apiRequests/Channels";
import { LEFT_MENU_SELECTORS } from "../elements/account/left-menu/left-menu-selectors";
import { PRODUCTS_SELECTORS } from "../elements/catalog/product-selectors";
import { ADD_CHANNEL_FORM_SELECTOS } from "../elements/channels/add-channel-form-selectors";
import { CHANNEL_FORM_SELECTORS } from "../elements/channels/channel-form-selectors";
import { CHANNELS_SELECTORS } from "../elements/channels/channels-selectors";
import { DELETE_CHANNEL_FORM_SELECTORS } from "../elements/channels/delete-channel-form-selectors";
import { CONFIGURATION_SELECTORS } from "../elements/configuration/configuration-selectors";
import { HEADER_SELECTORS } from "../elements/header/header-selectors";
import { DRAFT_ORDER_SELECTORS } from "../elements/orders/draft-order-selectors";
import { ORDERS_SELECTORS } from "../elements/orders/orders-selectors";
import { URL_LIST } from "../url/url-list";

describe("Channels", () => {
  const channelStartsWith = "Cypress:";
  const currency = "PLN";
  const channels = new Channels();

  before(() => {
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
    cy.visit(URL_LIST.channels)
      .get(CHANNELS_SELECTORS.createChannelButton)
      .click()
      .get(ADD_CHANNEL_FORM_SELECTOS.channelName)
      .type(randomChannel)
      .get(ADD_CHANNEL_FORM_SELECTOS.slug)
      .type(randomChannel)
      .get(ADD_CHANNEL_FORM_SELECTOS.currency)
      .click()
      .get(ADD_CHANNEL_FORM_SELECTOS.currencyOptions)
      .first()
      .click()
      .get(ADD_CHANNEL_FORM_SELECTOS.saveButton)
      .click()
      .waitForGraph("ChannelCreate")
      .get(ADD_CHANNEL_FORM_SELECTOS.backToChannelsList)
      .click()
      .get(CHANNELS_SELECTORS.channelsTable)
      .contains(randomChannel);
    cy.visit(URL_LIST.dashbord)
      .get(HEADER_SELECTORS.channelSelect)
      .click()
      .get(HEADER_SELECTORS.channelSelectList)
      .contains(randomChannel)
      .click();
    cy.visit(URL_LIST.products)
      .waitForGraph("ProductList")
      .get(PRODUCTS_SELECTORS.productsList)
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
    createChannel(randomChannel);
    cy.get(ADD_CHANNEL_FORM_SELECTOS.slugValidationMessage).should(
      "be.visible"
    );
  });

  it("should validate currency", () => {
    const randomChannel = `${channelStartsWith} ${faker.random.number()}`;
    cy.visit(URL_LIST.channels);
    createChannel(randomChannel, randomChannel, "notExistingCurrency");
    cy.get(ADD_CHANNEL_FORM_SELECTOS.currencyValidationMassege).should(
      "be.visible"
    );
  });

  it("should delete channel and move orders", () => {
    const randomChannelToDelete = `${channelStartsWith} ${faker.random.number()}`;
    const randomTargetChannel = `${channelStartsWith} ${faker.random.number()}`;
    cy.createChannel(
      false,
      randomChannelToDelete,
      randomChannelToDelete,
      currency
    )
      .createChannelByApi(
        false,
        randomTargetChannel,
        randomTargetChannel,
        currency
      )
      .visit(URL_LIST.channels)
      .get(CHANNELS_SELECTORS.channelName)
      .contains(randomChannelToDelete)
      .parentsUntil(CHANNELS_SELECTORS.channelsTable)
      .find("button")
      .click();
    cy.get(DELETE_CHANNEL_FORM_SELECTORS.targetChannelSelect)
      .click()
      .get(DELETE_CHANNEL_FORM_SELECTORS.targetChannelOption)
      .contains(randomTargetChannel)
      .click()
      .get(DELETE_CHANNEL_FORM_SELECTORS.confirmButton)
      .click();
    cy.get(CHANNELS_SELECTORS.channelName)
      .not()
      .contains(randomChannelToDelete);
  });

  it("should not be possible to add products to order with inactive channel", () => {
    const randomChannel = `${channelStartsWith} ${faker.random.number()}`;
    cy.createChannel(false, randomChannel, randomChannel, currency)
      .visit(URL_LIST.orders)
      .get(ORDERS_SELECTORS.createOrder)
      .click()
      .get(CHANNEL_FORM_SELECTORS.channelSelect)
      .click()
      .get(CHANNEL_FORM_SELECTORS.channelOption)
      .contains(randomChannel)
      .click()
      .get(CHANNEL_FORM_SELECTORS.confirmButton)
      .click()
      .get(DRAFT_ORDER_SELECTORS.addProducts)
      .should("not.exist");
  });

  function createChannel(name, slug = name, currency) {
    cy.get(CHANNELS_SELECTORS.createChannelButton)
      .click()
      .get(ADD_CHANNEL_FORM_SELECTOS.channelName)
      .type(name)
      .get(ADD_CHANNEL_FORM_SELECTOS.slug)
      .type(slug)
      .get(ADD_CHANNEL_FORM_SELECTOS.currency)
      .click();
    if (!currency) {
      cy.get(ADD_CHANNEL_FORM_SELECTOS.currencyOptions)
        .first()
        .click();
    } else {
      cy.get(ADD_CHANNEL_FORM_SELECTOS.currency)
        .type(currency)
        .get(ADD_CHANNEL_FORM_SELECTOS.currencyAutocompliteDropdown)
        .click();
    }
    cy.get(ADD_CHANNEL_FORM_SELECTOS.saveButton).click();
  }
});
