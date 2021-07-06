// <reference types="cypress" />
import faker from "faker";

import { createChannel } from "../../../apiRequests/Channels";
import {
  createShippingZone,
  getShippingZone
} from "../../../apiRequests/ShippingMethod";
import { ONE_PERMISSION_USERS } from "../../../Data/users";
import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { ADD_CHANNEL_FORM_SELECTORS } from "../../../elements/channels/add-channel-form-selectors";
import { AVAILABLE_CHANNELS_FORM } from "../../../elements/channels/available-channels-form";
import { CHANNELS_SELECTORS } from "../../../elements/channels/channels-selectors";
import { SELECT_CHANNELS_TO_ASSIGN } from "../../../elements/channels/select-channels-to-assign";
import { HEADER_SELECTORS } from "../../../elements/header/header-selectors";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { createChannelByView } from "../../../steps/channelsSteps";
import { urlList } from "../../../url/urlList";
import { deleteChannelsStartsWith } from "../../../utils/channelsUtils";
import { deleteShippingStartsWith } from "../../../utils/shippingUtils";

describe("Channels", () => {
  const channelStartsWith = `CyChannels`;
  const randomName = `${channelStartsWith} ${faker.datatype.number()}`;
  const currency = "PLN";
  let shippingZone;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteChannelsStartsWith(channelStartsWith);
    deleteShippingStartsWith(channelStartsWith);
    createShippingZone(randomName, "US").then(shippingZoneResp => {
      shippingZone = shippingZoneResp;
    });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest(
      "auth",
      ONE_PERMISSION_USERS.channel
    );
  });

  it("should create new channel", () => {
    const randomChannel = `${channelStartsWith} ${faker.datatype.number()}`;
    cy.addAliasToGraphRequest("Channels");
    cy.visit(urlList.channels);
    cy.wait("@Channels");
    createChannelByView({ name: randomChannel, currency });
    cy.wait("@Channel");

    // New channel should be visible in channels list
    cy.get(ADD_CHANNEL_FORM_SELECTORS.backToChannelsList)
      .click()
      .get(CHANNELS_SELECTORS.channelsTable)
      .contains(randomChannel);

    // new channel should be visible in channel selector
    cy.visit(urlList.homePage)
      .get(HEADER_SELECTORS.channelSelect)
      .click()
      .get(HEADER_SELECTORS.channelSelectList)
      .contains(randomChannel)
      .click();

    // new channel should be visible at product availability form
    cy.clearSessionData().loginUserViaRequest();
    cy.addAliasToGraphRequest("InitialProductFilterAttributes");
    cy.visit(urlList.products);
    cy.wait("@InitialProductFilterAttributes");
    cy.get(SHARED_ELEMENTS.progressBar).should("not.exist");
    cy.get(PRODUCTS_LIST.emptyProductRow).should("not.exist");
    cy.get(PRODUCTS_LIST.productsList)
      .first()
      .click()
      .get(AVAILABLE_CHANNELS_FORM.menageChannelsButton)
      .click()
      .get(SELECT_CHANNELS_TO_ASSIGN.listOfChannels)
      .contains(randomChannel);
  });

  it("should create channel with shippingZone", () => {
    // remove login after fixing SALEOR-3162
    cy.clearSessionData().loginUserViaRequest();

    const randomChannel = `${channelStartsWith} ${faker.datatype.number()}`;
    cy.addAliasToGraphRequest("Channels");
    cy.visit(urlList.channels);
    cy.wait("@Channels");
    createChannelByView({
      name: randomChannel,
      currency,
      shippingZone: shippingZone.name
    });
    cy.wait("@Channel");
    getShippingZone(shippingZone.id).then(shippingZoneResp => {
      const assignedChannel = shippingZoneResp.channels.find(
        channel => channel.name === randomChannel
      );
      expect(assignedChannel).to.be.ok;
    });
  });

  it("should validate slug name", () => {
    const randomChannel = `${channelStartsWith} ${faker.datatype.number()}`;
    createChannel({
      isActive: false,
      name: randomChannel,
      slug: randomChannel,
      currencyCode: currency
    });
    cy.visit(urlList.channels);
    createChannelByView({ name: randomChannel, currency });
    cy.get(ADD_CHANNEL_FORM_SELECTORS.slugValidationMessage).should(
      "be.visible"
    );
  });

  it("should validate duplicated currency", () => {
    const randomChannel = `${channelStartsWith} ${faker.datatype.number()}`;
    cy.visit(urlList.channels);
    createChannelByView({
      name: randomChannel,
      currency: "notExistingCurrency"
    });
    cy.get(ADD_CHANNEL_FORM_SELECTORS.currencyValidationMessage).should(
      "be.visible"
    );
  });

  it("should delete channel", () => {
    const randomChannelToDelete = `${channelStartsWith} ${faker.datatype.number()}`;
    createChannel({
      isActive: false,
      name: randomChannelToDelete,
      slug: randomChannelToDelete,
      currencyCode: currency
    });
    cy.addAliasToGraphRequest("Channels");
    cy.visit(urlList.channels);
    cy.wait("@Channels");
    cy.contains(CHANNELS_SELECTORS.channelName, randomChannelToDelete)
      .parentsUntil(CHANNELS_SELECTORS.channelsTable)
      .find("button")
      .click();
    cy.addAliasToGraphRequest("Channels");
    cy.get(BUTTON_SELECTORS.submit).click();
    cy.wait("@Channels");

    cy.get(CHANNELS_SELECTORS.channelName)
      .contains(randomChannelToDelete)
      .should("not.exist");
  });
});
