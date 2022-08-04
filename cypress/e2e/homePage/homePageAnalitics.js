/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { HOMEPAGE_SELECTORS } from "../../elements/homePage/homePage-selectors";
import { urlList } from "../../fixtures/urlList";
import { createCustomer } from "../../support/api/requests/Customer";
import { deleteChannelsStartsWith } from "../../support/api/utils/channelsUtils";
import * as homePageUtils from "../../support/api/utils/homePageUtils";
import {
  createReadyToFulfillOrder,
  createWaitingForCaptureOrder,
} from "../../support/api/utils/ordersUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../support/api/utils/shippingUtils";
import {
  changeChannel,
  getOrdersReadyForCaptureRegex,
  getOrdersReadyToFulfillRegex,
  getProductsOutOfStockRegex,
  getSalesAmountRegex,
  getTodaysOrdersRegex,
} from "../../support/pages/homePage";

describe("As an admin I want to see correct information on dashboard home page", () => {
  const startsWith = "CyHomeAnalytics";
  const productPrice = 22;
  const shippingPrice = 12;
  const randomName = startsWith + faker.datatype.number();
  const randomEmail = `${startsWith}${randomName}@example.com`;

  let customer;
  let defaultChannel;
  let createdVariants;
  let productType;
  let attribute;
  let category;
  let warehouse;
  let shippingMethod;
  let address;
  let ordersReadyToFulfillRegexp;
  let ordersReadyForCaptureRegexp;
  let productsOutOfStockRegexp;
  let salesAmountRegexp;
  let ordersRegexp;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    deleteChannelsStartsWith(startsWith);

    productsUtils
      .createProductWithShipping({
        name: randomName,
        productPrice,
        shippingPrice,
        newChannel: true,
      })
      .then(resp => {
        createdVariants = resp.variantsList;
        address = resp.address;
        warehouse = resp.warehouse;
        defaultChannel = resp.defaultChannel;
        shippingMethod = resp.shippingMethod;
        attribute = resp.attribute;
        category = resp.category;
        productType = resp.productType;

        createCustomer(randomEmail, randomName, address).then(
          customerResp => (customer = customerResp),
        );

        homePageUtils
          .getOrdersReadyToFulfill(defaultChannel.slug)
          .then(ordersReadyToFulfillBefore => {
            ordersReadyToFulfillRegexp = getOrdersReadyToFulfillRegex(
              ordersReadyToFulfillBefore,
              1,
            );
          });

        homePageUtils
          .getOrdersReadyForCapture(defaultChannel.slug)
          .then(ordersReadyForCaptureBefore => {
            ordersReadyForCaptureRegexp = getOrdersReadyForCaptureRegex(
              ordersReadyForCaptureBefore,
              1,
            );
          });

        homePageUtils
          .getProductsOutOfStock(defaultChannel.slug)
          .then(productsOutOfStockBefore => {
            productsOutOfStockRegexp = getProductsOutOfStockRegex(
              productsOutOfStockBefore,
              1,
            );
          });

        homePageUtils.getSalesAmount(defaultChannel.slug).then(salesAmount => {
          salesAmountRegexp = getSalesAmountRegex(
            salesAmount,
            (productPrice + shippingPrice) * 2,
          );
        });

        homePageUtils
          .getTodaysOrders(defaultChannel.slug)
          .then(ordersBefore => {
            ordersRegexp = getTodaysOrdersRegex(ordersBefore, 2);
          });
      })
      .then(() => {
        createReadyToFulfillOrder({
          customerId: customer.id,
          shippingMethodId: shippingMethod.id,
          channelId: defaultChannel.id,
          variantsList: createdVariants,
          address,
        });

        createWaitingForCaptureOrder({
          channelSlug: defaultChannel.slug,
          email: randomEmail,
          variantsList: createdVariants,
          shippingMethodName: shippingMethod.name,
          address,
        });

        const productOutOfStockRandomName =
          startsWith + faker.datatype.number();

        productsUtils.createProductInChannel({
          name: productOutOfStockRandomName,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          quantityInWarehouse: 0,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
          price: productPrice,
        });
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should display correct information on dashboard home page. SALEOR_2004",
    { tags: ["@homePage", "@allEnv"] },
    () => {
      cy.visit(urlList.homePage);
      changeChannel(defaultChannel.name);
      cy.contains(HOMEPAGE_SELECTORS.orders, ordersRegexp).should("be.visible");
      cy.contains(
        HOMEPAGE_SELECTORS.ordersReadyToFulfill,
        ordersReadyToFulfillRegexp,
      ).should("be.visible");
      cy.contains(
        HOMEPAGE_SELECTORS.paymentsWaitingForCapture,
        ordersReadyForCaptureRegexp,
      ).should("be.visible");
      cy.contains(HOMEPAGE_SELECTORS.sales, salesAmountRegexp).should(
        "be.visible",
      );
      cy.contains(
        HOMEPAGE_SELECTORS.productsOutOfStock,
        productsOutOfStockRegexp,
      ).should("be.visible");
    },
  );
});
