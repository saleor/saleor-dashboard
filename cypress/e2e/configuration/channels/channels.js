/// <reference types="cypress"/>
/// <reference types="../../../support"/>
import faker from "faker";

import {
  ADD_CHANNEL_FORM_SELECTORS,
} from "../../../elements/channels/add-channel-form-selectors";
import {
  AVAILABLE_CHANNELS_FORM,
} from "../../../elements/channels/available-channels-form";
import {
  CHANNELS_SELECTORS,
} from "../../../elements/channels/channels-selectors";
import {
  SELECT_CHANNELS_TO_ASSIGN,
} from "../../../elements/channels/select-channels-to-assign";
import { HEADER_SELECTORS } from "../../../elements/header/header-selectors";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { MESSAGES } from "../../../fixtures/";
import {
  productDetailsUrl,
  urlList,
} from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { createChannel } from "../../../support/api/requests/Channels";
import { getFirstProducts } from "../../../support/api/requests/Product";
import {
  createShippingZoneWithoutWarehouse,
  getShippingZone,
} from "../../../support/api/requests/ShippingMethod";
import {
  createWarehouse as createWarehouseViaApi,
} from "../../../support/api/requests/Warehouse";
import {
  createChannelByView,
  setChannelRequiredFields,
  typeExpirationDays,
} from "../../../support/pages/channelsPage";

describe("Channels", () => {
  const channelStartsWith = `CyChannels`;
  const randomName = `${channelStartsWith}${faker.datatype.number()}`;
  const currency = "PLN";
  let shippingZone;
  let usAddress;

  before(() => {
    cy.loginUserViaRequest();
    createShippingZoneWithoutWarehouse(randomName, "US").then(
      shippingZoneResp => {
        shippingZone = shippingZoneResp;
      },
    );
    cy.fixture("addresses")
      .then(addresses => {
        usAddress = addresses.usAddress;
        createWarehouseViaApi({
          name: randomName,
          address: usAddress,
        });
      })
      .then(warehouse => {
        cy.checkIfDataAreNotNull({ shippingZone, usAddress, warehouse });
      });
  });

  beforeEach(() => {
    cy.loginUserViaRequest("auth", ONE_PERMISSION_USERS.channel);
  });

  it(
    "should create new channel. TC: SALEOR_0701",
    { tags: ["@channel", "@allEnv", "@stable"] },
    () => {
      const randomChannel = `${channelStartsWith} ${faker.datatype.number()}`;
      cy.addAliasToGraphRequest("Channels");
      cy.visit(urlList.channels);
      cy.expectSkeletonIsVisible();
      cy.waitForRequestAndCheckIfNoErrors("@Channels");
      createChannelByView({ name: randomChannel, currency });
      cy.waitForRequestAndCheckIfNoErrors("@Channel");

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
      getFirstProducts(1).then(resp => {
        const product = resp[0].node;
        cy.visit(productDetailsUrl(product.id))
          .get(AVAILABLE_CHANNELS_FORM.manageChannelsButton)
          .click()
          .get(SELECT_CHANNELS_TO_ASSIGN.listOfChannels)
          .contains(randomChannel);
      });
    },
  );
  it(
    "should create new channel with expired orders functionality set. TC: SALEOR_0713",
    { tags: ["@channel", "@allEnv", "@stable"] },
    () => {
      const randomChannel = `${channelStartsWith} ${faker.datatype.number()}`;
      const orderExpiresAfter = 120;
      cy.addAliasToGraphRequest("Channels");
      cy.addAliasToGraphRequest("ChannelCreate");
      cy.visit(urlList.channels);
      cy.waitForRequestAndCheckIfNoErrors("@Channels");
      setChannelRequiredFields({ name: randomChannel, currency });
      typeExpirationDays(orderExpiresAfter);
      cy.clickConfirmButton();
      cy.waitForRequestAndCheckIfNoErrors("@ChannelCreate").then(
        channelCreate => {
          expect(
            channelCreate.response.body.data.channelCreate.channel
              .orderSettings,
          ).to.have.property("deleteExpiredOrdersAfter", orderExpiresAfter);
          cy.get(CHANNELS_SELECTORS.orderExpirationInput)
            .invoke("val")
            .should("contain", orderExpiresAfter.toString());
        },
      );
    },
  );
  it(
    "should not be able to create new channel with expired orders functionality with values outside boundary conditions. TC: SALEOR_0714",
    { tags: ["@channel", "@allEnv"] },
    () => {
      const randomChannel = `${channelStartsWith} ${faker.datatype.number()}`;
      const underBoundaryConditions = 0;
      const overBoundaryConditions = 121;
      cy.addAliasToGraphRequest("Channels");
      cy.addAliasToGraphRequest("ChannelCreate");
      cy.visit(urlList.channels);
      cy.waitForRequestAndCheckIfNoErrors("@Channels");
      setChannelRequiredFields({ name: randomChannel, currency });
      typeExpirationDays(underBoundaryConditions);

      cy.clickConfirmButton();
      cy.wait("@ChannelCreate").then(createChannelResponse => {
        cy.log(createChannelResponse);
        expect(
          createChannelResponse.response.body.data.channelCreate.errors.length,
        ).to.eq(1);
        cy.confirmationErrorMessageShouldAppear();
      });
      typeExpirationDays(overBoundaryConditions);
      cy.clickConfirmButton();
      cy.wait("@ChannelCreate").then(createChannelResponse => {
        cy.log(createChannelResponse);
        expect(
          createChannelResponse.response.body.data.channelCreate.errors.length,
        ).to.eq(1);
        cy.confirmationErrorMessageShouldAppear();
      });
    },
  );
  it(
    "should create channel with shippingZone and warehouse TC: SALEOR_0712",
    { tags: ["@channel", "@allEnv"] },
    () => {
      // remove login after fixing SALEOR-3162
      cy.clearSessionData().loginUserViaRequest();

      const randomChannel = `${channelStartsWith} ${faker.datatype.number()}`;
      cy.addAliasToGraphRequest("Channels");
      cy.visit(urlList.channels);
      cy.wait("@Channels");
      createChannelByView({
        name: randomChannel,
        currency,
        shippingZone: shippingZone.name,
        warehouse: randomName,
      });
      cy.waitForRequestAndCheckIfNoErrors("@Channel");
      getShippingZone(shippingZone.id).then(shippingZoneResp => {
        const assignedChannel = shippingZoneResp.channels.find(
          channel => channel.name === randomChannel,
        );
        expect(assignedChannel).to.be.ok;
      });
    },
  );

  it(
    "should validate that creating channels with same slug name as other is not possible. TC: SALEOR_0703",
    { tags: ["@channel", "@allEnv", "@stable"] },
    () => {
      const randomChannel = `${channelStartsWith} ${faker.datatype.number()}`;
      createChannel({
        isActive: false,
        name: randomChannel,
        slug: randomChannel,
        currencyCode: currency,
      });
      cy.visit(urlList.channels);
      cy.expectSkeletonIsVisible();
      createChannelByView({ name: randomChannel, currency });
      cy.confirmationErrorMessageShouldAppear();
      cy.get(ADD_CHANNEL_FORM_SELECTORS.generalInformationSection).should(
        "contain.text",
        MESSAGES.slugMustBeUnique,
      );
    },
  );

  it(
    "should validate not existing currency. TC: SALEOR_0704",
    { tags: ["@channel", "@allEnv", "@stable"] },
    () => {
      const randomChannel = `${channelStartsWith} ${faker.datatype.number()}`;
      cy.visit(urlList.channels);
      cy.expectSkeletonIsVisible();
      createChannelByView({
        name: randomChannel,
        currency: "notExistingCurrency",
      });
      cy.get(ADD_CHANNEL_FORM_SELECTORS.currencyValidationMessage).should(
        "be.visible",
      );
    },
  );

  it(
    "should delete channel. TC: SALEOR_0705",
    { tags: ["@channel", "@allEnv", "@stable"] },
    () => {
      const randomChannelToDelete = `${channelStartsWith} ${faker.datatype.number()}`;
      createChannel({
        isActive: false,
        name: randomChannelToDelete,
        slug: randomChannelToDelete,
        currencyCode: currency,
      });
      cy.addAliasToGraphRequest("Channels");
      cy.visit(urlList.channels);
      cy.expectSkeletonIsVisible();
      cy.wait("@Channels");
      cy.contains(CHANNELS_SELECTORS.channelName, randomChannelToDelete)
        .parentsUntil(CHANNELS_SELECTORS.channelsTable)
        .find("button")
        .click();
      cy.addAliasToGraphRequest("Channels");
      cy.get(BUTTON_SELECTORS.submit).click();
      cy.waitForRequestAndCheckIfNoErrors("@Channels");

      cy.get(CHANNELS_SELECTORS.channelName)
        .contains(randomChannelToDelete)
        .should("not.exist");
    },
  );
});
