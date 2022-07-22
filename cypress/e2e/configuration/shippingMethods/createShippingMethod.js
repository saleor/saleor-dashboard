/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { urlList } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { updateChannelWarehouses } from "../../../support/api/requests/Channels";
import { createCheckout } from "../../../support/api/requests/Checkout";
import { createVariant } from "../../../support/api/requests/Product";
import { createWarehouse } from "../../../support/api/requests/Warehouse";
import * as channelsUtils from "../../../support/api/utils/channelsUtils";
import { createWaitingForCaptureOrder } from "../../../support/api/utils/ordersUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import * as shippingUtils from "../../../support/api/utils/shippingUtils";
import { isShippingAvailableInCheckout } from "../../../support/api/utils/storeFront/checkoutUtils";
import {
  createShippingRate,
  createShippingZone,
  rateOptions,
} from "../../../support/pages/shippingMethodPage";

describe("As a staff user I want to create shipping zone and rate", () => {
  const startsWith = "CreateShippingMethods-";
  const name = `${startsWith}${faker.datatype.number()}`;
  const secondName = `${startsWith}${faker.datatype.number()}`;
  const price = 8;
  const secondVariantPrice = 2;
  const deliveryTime = { min: 2, max: 5 };
  let defaultChannel;
  let address;
  let variantsList;
  let secondVariantsList;
  let warehouse;
  let attribute;
  let category;
  let productType;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProductsStartsWith(startsWith);
    shippingUtils.deleteShippingStartsWith(startsWith);

    channelsUtils
      .getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;

        cy.fixture("addresses");
      })
      .then(addresses => {
        address = addresses.usAddress;

        createWarehouse({ name, address });
      })
      .then(warehouseResp => {
        warehouse = warehouseResp;

        updateChannelWarehouses(defaultChannel.id, warehouse.id);
        productsUtils.createTypeAttributeAndCategoryForProduct({
          name: startsWith,
        });
      })
      .then(
        ({
          productType: productTypeResp,
          category: categoryResp,
          attribute: attributeResp,
        }) => {
          attribute = attributeResp;
          category = categoryResp;
          productType = productTypeResp;

          productsUtils.createProductInChannel({
            name,
            channelId: defaultChannel.id,
            productTypeId: productTypeResp.id,
            attributeId: attributeResp.id,
            categoryId: categoryResp.id,
            warehouseId: warehouse.id,
            quantityInWarehouse: 10,
            price,
          });
        },
      )
      .then(({ variantsList: variantsListResp, product }) => {
        variantsList = variantsListResp;
        createVariant({
          productId: product.id,
          sku: secondName,
          attributeId: attribute.id,
          attributeName: "value2",
          warehouseId: warehouse.id,
          quantityInWarehouse: 10,
          channelId: defaultChannel.id,
          price: secondVariantPrice,
          weight: 10,
        });
      })
      .then(variantsListResp => {
        secondVariantsList = variantsListResp;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should be able to create price based shipping method. TC: SALEOR_0803",
    { tags: ["@shipping", "@allEnv", "@stable"] },
    () => {
      const shippingName = `${startsWith}${faker.datatype.number()}`;
      cy.clearSessionData().loginUserViaRequest(
        "auth",
        ONE_PERMISSION_USERS.shipping,
      );
      cy.visit(urlList.shippingMethods).expectSkeletonIsVisible();
      createShippingZone(
        shippingName,
        warehouse.name,
        address.countryFullName,
        defaultChannel.name,
      );
      createShippingRate({
        rateName: shippingName,
        price,
        priceLimits: { min: price, max: 100 },
        rateOption: rateOptions.PRICE_OPTION,
        deliveryTime,
      });
      createWaitingForCaptureOrder({
        channelSlug: defaultChannel.slug,
        email: "test@example.com",
        variantsList,
        address,
        shippingMethodName: shippingName,
      })
        .then(({ order }) => {
          expect(order.id).to.be.ok;
          createCheckout({
            channelSlug: defaultChannel.slug,
            email: "test@example.com",
            variantsList: secondVariantsList,
            address,
            auth: "token",
          });
        })
        .then(({ checkout }) => {
          const isShippingAvailable = isShippingAvailableInCheckout(
            checkout,
            shippingName,
          );
          expect(isShippingAvailable).to.be.false;
        });
    },
  );

  it(
    "should be able to create weight based shipping method. TC: SALEOR_0804",
    { tags: ["@shipping", "@allEnv", "@stable"] },
    () => {
      const shippingName = `${startsWith}${faker.datatype.number()}`;
      cy.clearSessionData().loginUserViaRequest(
        "auth",
        ONE_PERMISSION_USERS.shipping,
      );
      cy.visit(urlList.shippingMethods).expectSkeletonIsVisible();
      createShippingZone(
        shippingName,
        warehouse.name,
        address.countryFullName,
        defaultChannel.name,
      );
      createShippingRate({
        rateName: shippingName,
        price,
        rateOption: rateOptions.WEIGHT_OPTION,
        deliveryTime,
        weightLimits: { min: 5, max: 10 },
      });
      createWaitingForCaptureOrder({
        channelSlug: defaultChannel.slug,
        email: "test@example.com",
        variantsList: secondVariantsList,
        address,
        shippingMethodName: shippingName,
      })
        .then(({ order }) => {
          expect(order.id).to.be.ok;
          createCheckout({
            channelSlug: defaultChannel.slug,
            email: "test@example.com",
            variantsList,
            address,
            auth: "token",
          });
        })
        .then(({ checkout }) => {
          const isShippingAvailable = isShippingAvailableInCheckout(
            checkout,
            shippingName,
          );
          expect(isShippingAvailable).to.be.false;
        });
    },
  );
});
