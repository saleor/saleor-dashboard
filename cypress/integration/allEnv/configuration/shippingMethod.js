// <reference types="cypress" />
import faker from "faker";

import { createChannel } from "../../../apiRequests/Channels";
import { createCheckout } from "../../../apiRequests/Checkout";
import {
  addChannelToShippingMethod,
  addChannelToShippingZone
} from "../../../apiRequests/ShippingMethod";
import { createWarehouse } from "../../../apiRequests/Warehouse";
import { ONE_PERMISSION_USERS } from "../../../Data/users";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { SHIPPING_ZONE_DETAILS } from "../../../elements/shipping/shipping-zone-details";
import { selectChannelInHeader } from "../../../steps/channelsSteps";
import {
  createShippingRate,
  createShippingZone,
  rateOptions
} from "../../../steps/shippingMethodSteps";
import { getFormattedCurrencyAmount } from "../../../support/format/formatCurrencyAmount";
import { urlList } from "../../../url/urlList";
import * as channelsUtils from "../../../utils/channelsUtils";
import * as productsUtils from "../../../utils/products/productsUtils";
import * as shippingUtils from "../../../utils/shippingUtils";
import { isShippingAvailableInCheckout } from "../../../utils/storeFront/checkoutUtils";

describe("Shipping methods", () => {
  const startsWith = "CyShippingMethods-";
  const name = `${startsWith}${faker.datatype.number()}`;
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
        createWarehouse({ name, address: plAddress });
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
      .then(({ variantsList: variantsListResp }) => {
        variantsList = variantsListResp;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should display different price for each channel", () => {
    const shippingName = `${startsWith}${faker.datatype.number()}`;
    const defaultChannelPrice = 11;
    const createdChannelPrice = 7;
    const createdChannelCurrency = "PLN";

    let shippingMethod;
    let shippingZone;
    let createdChannel;

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
          .should("be.visible")
          .get(SHARED_ELEMENTS.progressBar)
          .should("not.exist");
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
    const shippingName = `${startsWith}${faker.datatype.number()}`;
    cy.clearSessionData().loginUserViaRequest(
      "auth",
      ONE_PERMISSION_USERS.shipping
    );
    cy.visit(urlList.shippingMethods);
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
    }).then(({ checkout }) => {
      const isShippingAvailable = isShippingAvailableInCheckout(
        checkout,
        shippingName
      );
      expect(isShippingAvailable).to.be.true;
    });
  });

  it("should create weight based shipping method", () => {
    const shippingName = `${startsWith}${faker.datatype.number()}`;
    cy.clearSessionData().loginUserViaRequest(
      "auth",
      ONE_PERMISSION_USERS.shipping
    );
    cy.visit(urlList.shippingMethods);
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
    }).then(({ checkout }) => {
      const isShippingAvailable = isShippingAvailableInCheckout(
        checkout,
        shippingName
      );
      expect(isShippingAvailable).to.be.true;
    });
  });
});
