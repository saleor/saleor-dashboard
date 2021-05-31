import faker from "faker";

import {
  createCustomer,
  deleteCustomersStartsWith
} from "../../../apiRequests/Customer";
import { HOMEPAGE_SELECTORS } from "../../../elements/homePage/homePage-selectors";
import { changeChannel } from "../../../steps/homePageSteps";
import { urlList } from "../../../url/urlList";
import { getDefaultChannel } from "../../../utils/channelsUtils";
import * as homePageUtils from "../../../utils/homePageUtils";
import {
  createReadyToFulfillOrder,
  createWaitingForCaptureOrder
} from "../../../utils/ordersUtils";
import * as productsUtils from "../../../utils/products/productsUtils";
import * as shippingUtils from "../../../utils/shippingUtils";

// <reference types="cypress" />
describe("Homepage analytics", () => {
  const startsWith = "CyHomeAnalytics";

  let customerId;
  let defaultChannel;
  let createdVariants;
  let productType;
  let attribute;
  let category;
  let warehouse;
  let shippingMethod;
  let addresses;

  const productPrice = 22;
  const shippingPrice = 12;
  const randomName = startsWith + faker.datatype.number();
  const randomEmail = `${startsWith}${randomName}@example.com`;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProductsStartsWith(startsWith);
    deleteCustomersStartsWith(startsWith);
    shippingUtils.deleteShippingStartsWith(startsWith);

    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        cy.fixture("addresses");
      })
      .then(addressesFixture => (addresses = addressesFixture))
      .then(() => createCustomer(randomEmail, randomName, addresses.plAddress))
      .then(resp => {
        customerId = resp.body.data.customerCreate.user.id;
        shippingUtils.createShipping({
          channelId: defaultChannel.id,
          name: randomName,
          address: addresses.plAddress,
          price: shippingPrice
        });
      })
      .then(
        ({ warehouse: warehouseResp, shippingMethod: shippingMethodResp }) => {
          warehouse = warehouseResp;
          shippingMethod = shippingMethodResp;
          productsUtils.createTypeAttributeAndCategoryForProduct(randomName);
        }
      )
      .then(
        ({
          productType: productTypeResp,
          attribute: attributeResp,
          category: categoryResp
        }) => {
          productType = productTypeResp;
          attribute = attributeResp;
          category = categoryResp;
          productsUtils.createProductInChannel({
            name: randomName,
            channelId: defaultChannel.id,
            warehouseId: warehouse.id,
            quantityInWarehouse: 20,
            productTypeId: productType.id,
            attributeId: attribute.id,
            categoryId: category.id,
            price: productPrice
          });
        }
      )
      .then(({ variantsList: variantsResp }) => {
        createdVariants = variantsResp;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should all elements be visible on the dashboard", () => {
    cy.visit(urlList.homePage)
      .softAssertVisibility(HOMEPAGE_SELECTORS.sales)
      .softAssertVisibility(HOMEPAGE_SELECTORS.orders)
      .softAssertVisibility(HOMEPAGE_SELECTORS.activity)
      .softAssertVisibility(HOMEPAGE_SELECTORS.topProducts)
      .softAssertVisibility(HOMEPAGE_SELECTORS.ordersReadyToFulfill)
      .softAssertVisibility(HOMEPAGE_SELECTORS.paymentsWaitingForCapture)
      .softAssertVisibility(HOMEPAGE_SELECTORS.productsOutOfStock);
  });

  it("should correct amount of ready to fullfil orders be displayed", () => {
    homePageUtils
      .getOrdersReadyToFulfill(defaultChannel.slug)
      .as("ordersReadyToFulfill");
    createReadyToFulfillOrder({
      customerId,
      shippingMethodId: shippingMethod.id,
      channelId: defaultChannel.id,
      variantsList: createdVariants,
      address: addresses.plAddress
    });
    cy.get("@ordersReadyToFulfill").then(ordersReadyToFulfillBefore => {
      const allOrdersReadyToFulfill = ordersReadyToFulfillBefore + 1;
      const notANumberRegex = "\\D*";
      const ordersReadyToFulfillRegexp = new RegExp(
        `${notANumberRegex}${allOrdersReadyToFulfill}${notANumberRegex}`
      );
      cy.visit(urlList.homePage);
      changeChannel(defaultChannel.name);
      cy.contains(
        HOMEPAGE_SELECTORS.ordersReadyToFulfill,
        ordersReadyToFulfillRegexp
      ).should("be.visible");
    });
  });

  it("should correct amount of payments waiting for capture be displayed", () => {
    homePageUtils
      .getOrdersReadyForCapture(defaultChannel.slug)
      .as("ordersReadyForCapture");

    createWaitingForCaptureOrder(
      defaultChannel.slug,
      randomEmail,
      createdVariants,
      shippingMethod.id,
      addresses.plAddress
    );

    cy.get("@ordersReadyForCapture").then(ordersReadyForCaptureBefore => {
      const allOrdersReadyForCapture = ordersReadyForCaptureBefore + 1;
      const notANumberRegex = "\\D*";
      const ordersReadyForCaptureRegexp = new RegExp(
        `${notANumberRegex}${allOrdersReadyForCapture}${notANumberRegex}`
      );
      cy.visit(urlList.homePage);
      changeChannel(defaultChannel.name);
      cy.contains(
        HOMEPAGE_SELECTORS.ordersReadyForCapture,
        ordersReadyForCaptureRegexp
      ).should("be.visible");
    });
  });

  it("should correct amount of products out of stock be displayed", () => {
    homePageUtils
      .getProductsOutOfStock(defaultChannel.slug)
      .as("productsOutOfStock");
    const productOutOfStockRandomName = startsWith + faker.datatype.number();

    productsUtils.createProductInChannel({
      name: productOutOfStockRandomName,
      channelId: defaultChannel.id,
      warehouseId: warehouse.id,
      quantityInWarehouse: 0,
      productTypeId: productType.id,
      attributeId: attribute.id,
      categoryId: category.id,
      price: productPrice
    });

    cy.get("@productsOutOfStock").then(productsOutOfStockBefore => {
      const allProductsOutOfStock = productsOutOfStockBefore + 1;
      const notANumberRegex = "\\D*";
      const productsOutOfStockRegexp = new RegExp(
        `${notANumberRegex}${allProductsOutOfStock}${notANumberRegex}`
      );
      cy.visit(urlList.homePage);
      changeChannel(defaultChannel.name);
      cy.contains(
        HOMEPAGE_SELECTORS.productsOutOfStock,
        productsOutOfStockRegexp
      ).should("be.visible");
    });
  });

  it("should correct amount of sales be displayed", () => {
    homePageUtils.getSalesAmount(defaultChannel.slug).as("salesAmount");

    createReadyToFulfillOrder({
      customerId,
      shippingMethodId: shippingMethod.id,
      channelId: defaultChannel.id,
      variantsList: createdVariants,
      address: addresses.plAddress
    });

    cy.get("@salesAmount").then(salesAmount => {
      const totalAmount = salesAmount + productPrice;
      const totalAmountString = totalAmount.toFixed(2);
      const totalAmountIntegerValue = totalAmountString.split(".")[0];
      const totalAmountDecimalValue = totalAmountString.split(".")[1];
      const decimalSeparator = "[,.]";
      const totalAmountIntegerWithThousandsSeparator = new Intl.NumberFormat(
        "en"
      )
        .format(totalAmountIntegerValue)
        .replaceAll(",", "[,.]*");
      const totalAmountWithSeparators = `${totalAmountIntegerWithThousandsSeparator}${decimalSeparator}${totalAmountDecimalValue}`;
      const notANumberRegex = "\\D*";
      const salesAmountRegexp = new RegExp(
        `${notANumberRegex}${totalAmountWithSeparators}${notANumberRegex}`
      );
      cy.visit(urlList.homePage);
      changeChannel(defaultChannel.name);
      cy.contains(HOMEPAGE_SELECTORS.sales, salesAmountRegexp).should(
        "be.visible"
      );
    });
  });

  it("should correct amount of orders be displayed", () => {
    homePageUtils.getTodaysOrders(defaultChannel.slug).as("todaysOrders");

    createReadyToFulfillOrder({
      customerId,
      shippingMethodId: shippingMethod.id,
      channelId: defaultChannel.id,
      variantsList: createdVariants,
      address: addresses.plAddress
    });

    cy.get("@todaysOrders").then(ordersBefore => {
      const allOrders = ordersBefore + 1;
      const notANumberRegex = "\\D*";
      const ordersRegexp = new RegExp(
        `${notANumberRegex}${allOrders}${notANumberRegex}`
      );
      cy.visit(urlList.homePage);
      changeChannel(defaultChannel.name);
      cy.contains(HOMEPAGE_SELECTORS.orders, ordersRegexp).should("be.visible");
    });
  });
});
