import faker from "faker";

import Customer from "../apiRequests/Customer";
import { HOMEPAGE_SELECTORS } from "../elements/homePage/homePage-selectors";
import HomePageSteps from "../steps/homePageSteps";
import { urlList } from "../url/urlList";
import ChannelsUtils from "../utils/channelsUtils";
import HomePageUtils from "../utils/homePageUtils";
import OrdersUtils from "../utils/ordersUtils";
import ProductsUtils from "../utils/productsUtils";
import ShippingUtils from "../utils/shippingUtils";

// <reference types="cypress" />
describe("Homepage analytics", () => {
  const startsWith = "Cy-";

  const customer = new Customer();
  const productsUtils = new ProductsUtils();
  const shippingUtils = new ShippingUtils();
  const ordersUtils = new OrdersUtils();
  const channelsUtils = new ChannelsUtils();
  const homePageUtils = new HomePageUtils();
  const homePageSteps = new HomePageSteps();

  let customerId;
  let defaultChannel;
  const productPrice = 22;
  const shippingPrice = 12;
  const randomName = startsWith + faker.random.number();
  const randomEmail = randomName + "@example.com";

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProperProducts(startsWith);
    customer.deleteCustomers(startsWith);
    shippingUtils.deleteShipping(startsWith);
    let addresses;

    channelsUtils
      .getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        cy.fixture("addresses");
      })
      .then(addressesFixture => (addresses = addressesFixture))
      .then(() =>
        customer.createCustomer(randomEmail, randomName, addresses.plAddress)
      )
      .then(resp => {
        customerId = resp.body.data.customerCreate.user.id;
        shippingUtils.createShipping({
          channelId: defaultChannel.id,
          name: randomName,
          address: addresses.plAddress,
          price: shippingPrice
        });
      })
      .then(() => {
        productsUtils.createTypeAttributeAndCategoryForProduct(randomName);
      })
      .then(() => {
        const warehouse = shippingUtils.getWarehouse();
        const productType = productsUtils.getProductType();
        const attribute = productsUtils.getAttribute();
        const category = productsUtils.getCategory();
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

    ordersUtils.createReadyToFulfillOrder(
      customerId,
      shippingUtils.getShippingMethod().id,
      defaultChannel.id,
      productsUtils.getCreatedVariants()
    );
    cy.get("@ordersReadyToFulfill").then(ordersReadyToFulfillBefore => {
      const allOrdersReadyToFulfill = ordersReadyToFulfillBefore + 1;
      const notANumberRegex = "\\D*";
      const ordersReadyToFulfillRegexp = new RegExp(
        `${notANumberRegex}${allOrdersReadyToFulfill}${notANumberRegex}`
      );
      cy.visit(urlList.homePage);
      homePageSteps.changeChannel(defaultChannel.name);
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
    const variantsList = productsUtils.getCreatedVariants();

    ordersUtils.createWaitingForCaptureOrder(
      defaultChannel.slug,
      randomEmail,
      variantsList,
      shippingUtils.getShippingMethod().id
    );

    cy.get("@ordersReadyForCapture").then(ordersReadyForCaptureBefore => {
      const allOrdersReadyForCapture = ordersReadyForCaptureBefore + 1;
      const notANumberRegex = "\\D*";
      const ordersReadyForCaptureRegexp = new RegExp(
        `${notANumberRegex}${allOrdersReadyForCapture}${notANumberRegex}`
      );
      cy.visit(urlList.homePage);
      homePageSteps.changeChannel(defaultChannel.name);
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
    const productOutOfStockRandomName = startsWith + faker.random.number();
    const productsOutOfStockUtils = new ProductsUtils();
    const warehouse = shippingUtils.getWarehouse();
    const productType = productsUtils.getProductType();
    const attribute = productsUtils.getAttribute();
    const category = productsUtils.getCategory();

    productsOutOfStockUtils.createProductInChannel({
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
      homePageSteps.changeChannel(defaultChannel.name);
      cy.contains(
        HOMEPAGE_SELECTORS.productsOutOfStock,
        productsOutOfStockRegexp
      ).should("be.visible");
    });
  });
  it("should correct amount of sales be displayed", () => {
    homePageUtils.getSalesAmount(defaultChannel.slug).as("salesAmount");

    ordersUtils.createReadyToFulfillOrder(
      customerId,
      shippingUtils.getShippingMethod().id,
      defaultChannel.id,
      productsUtils.getCreatedVariants()
    );

    cy.get("@salesAmount").then(salesAmount => {
      const totalAmount = salesAmount + productPrice;
      const totalAmountString = totalAmount.toFixed(2);
      const totalAmountIntegerValue = totalAmountString.split(".")[0];
      const totalAmountDecimalValue = totalAmountString.split(".")[1];
      const decimalSeparator = "[,.]";
      const totalAmountIntegerWithThousandsSeparator = totalAmountIntegerValue.replace(
        /(\d)(?=(\d{3})+(?!\d))/g,
        "1[,.]*"
      );
      const totalAmountWithSeparators = `${totalAmountIntegerWithThousandsSeparator}${decimalSeparator}${totalAmountDecimalValue}`;
      const notANumberRegex = "\\D*";
      const salesAmountRegexp = new RegExp(
        `${notANumberRegex}${totalAmountWithSeparators}${notANumberRegex}`
      );
      cy.visit(urlList.homePage);
      homePageSteps.changeChannel(defaultChannel.name);
      cy.contains(HOMEPAGE_SELECTORS.sales, salesAmountRegexp).should(
        "be.visible"
      );
    });
  });
  it("should correct amount of orders be displayed", () => {
    homePageUtils.getTodaysOrders(defaultChannel.slug).as("todaysOrders");

    ordersUtils.createReadyToFulfillOrder(
      customerId,
      shippingUtils.getShippingMethod().id,
      defaultChannel.id,
      productsUtils.getCreatedVariants()
    );

    cy.get("@todaysOrders").then(ordersBefore => {
      const allOrders = ordersBefore + 1;
      const notANumberRegex = "\\D*";
      const ordersRegexp = new RegExp(
        `${notANumberRegex}${allOrders}${notANumberRegex}`
      );
      cy.visit(urlList.homePage);
      homePageSteps.changeChannel(defaultChannel.name);
      cy.contains(HOMEPAGE_SELECTORS.orders, ordersRegexp).should("be.visible");
    });
  });
});
