// <reference types="cypress" />
import faker from "faker";

import { addChannelToShippingMethod } from "../../apiRequests/ShippingMethod";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHIPPING_RATE_DETAILS } from "../../elements/shipping/shipping-rate-details";
import { SHIPPING_ZONE_DETAILS } from "../../elements/shipping/shipping-zone-details";
import { SHIPPING_ZONES_LIST } from "../../elements/shipping/shipping-zones-list";
import { selectChannelInHeader } from "../../steps/channelsSteps";
import { urlList } from "../../url/urlList";
import * as channelsUtils from "../../utils/channelsUtils";
import * as productsUtils from "../../utils/productsUtils";
import * as shippingUtils from "../../utils/shippingUtils";

describe("Shipping methods", () => {
  const startsWith = "Cy-";
  const name = `${startsWith}${faker.random.number()}`;
  let defaultChannel;
  let plAddress;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProperProducts(startsWith);
    shippingUtils.deleteShipping(startsWith);
    channelsUtils.deleteChannels(startsWith);

    channelsUtils
      .getDefaultChannel()
      .then(channel => (defaultChannel = channel));
    productsUtils
      .createTypeAttributeAndCategoryForProduct(startsWith)
      .then(() => {
        productsUtils.createProductInChannel({
          name,
          channelId: defaultChannel.id,
          productTypeId: productsUtils.getProductType().id,
          attributeId: productsUtils.getAttribute().id,
          categoryId: productsUtils.getCategory().id
        });
        cy.fixture("addresses").then(addresses => {
          plAddress = addresses.plAddress;
          shippingUtils.createWarehouse(name, plAddress);
        });
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  xit("should display different price for each channel", () => {
    const shippingName = `${startsWith}${faker.random.number()}`;
    const defaultChannelPrice = 11;
    const createdChannelPrice = 7;
    const createdChannelCurrency = "PLN";
    let shippingMethod;
    let shippingZone;
    let createdChannel;
    channelsUtils
      .createChannel({
        name: shippingName,
        currencyCode: createdChannelCurrency
      })
      .then(() => {
        createdChannel = channelsUtils.getCreatedChannel();
      })
      .then(() => {
        shippingUtils.createShipping({
          channelId: defaultChannel.id,
          shippingName,
          address: plAddress,
          price: defaultChannelPrice
        });
      })
      .then(() => {
        shippingZone = shippingUtils.getShippingZone();
        shippingMethod = shippingUtils.getShippingMethod();
        addChannelToShippingMethod(
          shippingMethod.id,
          createdChannel.id,
          createdChannelPrice
        );
      })
      .then(() => {
        cy.visit(urlList.shippingMethods);
        cy.addAliasToGraphRequest("ShippingZone");
        cy.contains(shippingZone.name).click();
        cy.wait("@ShippingZone");
        selectChannelInHeader(defaultChannel.name);
        cy.getTextFromElement(SHIPPING_ZONE_DETAILS.shippingRatePriceTableCell)
          .then(text => {
            const language =
              window.navigator.userLanguage || window.navigator.language;
            const expectedValue = defaultChannelPrice.toLocaleString(language, {
              currency: defaultChannel.currencyCode,
              style: "currency"
            });
            expect(text).to.be.eq(expectedValue);
          })
          .then(() => {
            selectChannelInHeader(createdChannel.name);
            cy.getTextFromElement(
              SHIPPING_ZONE_DETAILS.shippingRatePriceTableCell
            );
          })
          .then(text => {
            const language =
              window.navigator.userLanguage || window.navigator.language;
            const expectedValue = createdChannelPrice.toLocaleString(language, {
              currency: createdChannelCurrency,
              style: "currency"
            });
            expect(text).to.be.eq(expectedValue);
          });
      });
  });
  it("should be possible to create price based shipping method", () => {
    const shippingName = `${startsWith}${faker.random.number()}`;
    const price = 5;
    cy.visit(urlList.shippingMethods);
    cy.get(SHIPPING_ZONES_LIST.addShippingZone)
      .click()
      .get(SHIPPING_ZONE_DETAILS.nameInput)
      .type(shippingName)
      .get(BUTTON_SELECTORS.submit)
      .click()
      .get(SHIPPING_ZONE_DETAILS.warehouseSelector)
      .click()
      .get(SHIPPING_ZONE_DETAILS.warehouseOption)
      .contains(name)
      .click();
    cy.addAliasToGraphRequest("UpdateShippingZone");
    cy.get(BUTTON_SELECTORS.submit).click();
    cy.wait("@UpdateShippingZone")
      .get(SHIPPING_ZONE_DETAILS.addPriceRateButton)
      .click()
      .get(SHIPPING_RATE_DETAILS.inputName)
      .type(shippingName)
      .get(SHIPPING_RATE_DETAILS.priceInput)
      .each($priceInput => {
        cy.wrap($priceInput).type(price);
      });
    cy.get(BUTTON_SELECTORS.submit);

    /*
        create shipping method - with price based - in view
        check available shipping methods on storefront
        */
  });

  it("should be possible to weight price based shipping method", () => {
    /*
        create shipping method - weight based - in view
        check available shipping methods on storefront
        */
  });
});
