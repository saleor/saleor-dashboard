// <reference types="cypress" />
import faker from "faker";

import {
  addChannelToShippingMethod,
  addChannelToShippingZone
} from "../../apiRequests/ShippingMethod";
import { SHIPPING_ZONE_DETAILS } from "../../elements/shipping/shipping-zone-details";
import { selectChannelInHeader } from "../../steps/channelsSteps";
import {
  createShippingRate,
  createShippingZone,
  rateOptions
} from "../../steps/shippingMethodSteps";
import { getFormattedCurrencyAmount } from "../../support/format/formatCurrencyAmount";
import { urlList } from "../../url/urlList";
import * as channelsUtils from "../../utils/channelsUtils";
import { createCheckout } from "../../utils/ordersUtils";
import * as productsUtils from "../../utils/products/productsUtils";
import * as shippingUtils from "../../utils/shippingUtils";
import { isShippingAvailableInCheckout } from "../../utils/storeFront/checkoutUtils";

describe("Shipping methods", () => {
  const startsWith = "CyShippingMethods-";
  const name = `${startsWith}${faker.random.number()}`;
  const price = 8;
  let defaultChannel;
  let plAddress;
  let variantsList;
  let warehouse;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProductsStartsWith(startsWith);
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
        shippingUtils.createWarehouse({ name, address: plAddress });
      })
      .then(warehouseResp => {
        warehouse = warehouseResp;
        productsUtils.createTypeAttributeAndCategoryForProduct(startsWith);
      })
      .then(
        ({
          productType: productTypeResp,
          category: categoryResp,
          attribute: attributeResp
        }) => {
          productsUtils.createProductInChannel({
            name,
            channelId: defaultChannel.id,
            productTypeId: productTypeResp.id,
            attributeId: attributeResp.id,
            categoryId: categoryResp.id,
            warehouseId: warehouse.id,
            quantityInWarehouse: 10
          });
        }
      )
      .then(({ variants: variantsListResp }) => {
        variantsList = variantsListResp;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
    cy.visit(urlList.shippingMethods);
  });

  it("should display different price for each channel", () => {
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
        cy.addAliasToGraphRequest("ShippingZone");
        cy.contains(shippingZone.name).click();
        cy.wait("@ShippingZone");
        selectChannelInHeader(defaultChannel.name);
        cy.getTextFromElement(SHIPPING_ZONE_DETAILS.shippingRatePriceTableCell)
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
  it("should create price based shipping method", () => {
    const shippingName = `${startsWith}${faker.random.number()}`;

    createShippingZone(
      shippingName,
      warehouse.name,
      plAddress.countryFullName,
      defaultChannel.name
    );
    createShippingRate(shippingName, price, rateOptions.PRICE_OPTION);

    createCheckout({
      channelSlug: defaultChannel.slug,
      email: "test@example.com",
      variantsList,
      address: plAddress,
      auth: "token"
    }).then(checkout => {
      const isShippingAvailable = isShippingAvailableInCheckout(
        checkout,
        shippingName
      );
      expect(isShippingAvailable).to.be.true;
    });
  });

  it("should create weight based shipping method", () => {
    const shippingName = `${startsWith}${faker.random.number()}`;

    createShippingZone(
      shippingName,
      warehouse.name,
      plAddress.countryFullName,
      defaultChannel.name
    );
    createShippingRate(shippingName, price, rateOptions.WEIGHT_OPTION);
    createCheckout({
      channelSlug: defaultChannel.slug,
      email: "test@example.com",
      variantsList,
      address: plAddress,
      auth: "token"
    }).then(checkout => {
      const isShippingAvailable = isShippingAvailableInCheckout(
        checkout,
        shippingName
      );
      expect(isShippingAvailable).to.be.true;
    });
  });
});
