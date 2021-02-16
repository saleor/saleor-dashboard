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
describe("User authorization", () => {
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

    channelsUtils.getDefaultChannel().then(channel => {
      defaultChannel = channel;
      cy.fixture("addresses").then(addressesFixture => {
        customer
          .createCustomer(randomEmail, randomName, addressesFixture.plAddress)
          .then(resp => {
            customerId = resp.body.data.customerCreate.user.id;
            shippingUtils
              .createShipping(
                defaultChannel.id,
                randomName,
                addressesFixture.plAddress,
                shippingPrice
              )
              .then(() => {
                const warehouse = shippingUtils.getWarehouse();
                productsUtils
                  .createTypeAttributeAndCategoryForProduct(randomName)
                  .then(() => {
                    const productType = productsUtils.getProductType();
                    const attribute = productsUtils.getAttribute();
                    const category = productsUtils.getCategory();
                    productsUtils.createProductInChannel(
                      randomName,
                      defaultChannel.id,
                      warehouse.id,
                      20,
                      productType.id,
                      attribute.id,
                      category.id,
                      productPrice
                    );
                  });
              });
          });
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
    cy.get("@ordersReadyToFulfill").then(ordersReadyToFulfill => {
      const regexp = new RegExp(`^${ordersReadyToFulfill + 1}\D*`);
      cy.visit(urlList.homePage);
      homePageSteps.changeChannel(defaultChannel.name);
      cy.contains(HOMEPAGE_SELECTORS.ordersReadyToFulfill, regexp).should(
        "be.visible"
      );
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

    cy.get("@ordersReadyForCapture").then(ordersReadyForCapture => {
      const regexp = new RegExp(`^${ordersReadyForCapture + 1}\D*`);
      cy.visit(urlList.homePage);
      homePageSteps.changeChannel(defaultChannel.name);
      cy.contains(HOMEPAGE_SELECTORS.ordersReadyForCapture, regexp).should(
        "be.visible"
      );
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

    productsOutOfStockUtils.createProductInChannel(
      productOutOfStockRandomName,
      defaultChannel.id,
      warehouse.id,
      0,
      productType.id,
      attribute.id,
      category.id,
      productPrice
    );

    cy.get("@productsOutOfStock").then(productsOutOfStock => {
      const regexp = new RegExp(`^${productsOutOfStock + 1}\\D*`);
      cy.visit(urlList.homePage);
      homePageSteps.changeChannel(defaultChannel.name);
      cy.contains(HOMEPAGE_SELECTORS.productsOutOfStock, regexp).should(
        "be.visible"
      );
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
      let totalAmount = salesAmount + productPrice;
      totalAmount = totalAmount
        .toFixed(2)
        .toString()
        .replace(".", "[,.]");
      const regexp = new RegExp(`\\D*${totalAmount}\\D*`);
      cy.visit(urlList.homePage);
      homePageSteps.changeChannel(defaultChannel.name);
      cy.contains(HOMEPAGE_SELECTORS.sales, regexp).should("be.visible");
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

    cy.get("@todaysOrders").then(todaysOrders => {
      const regexp = new RegExp(`\\D*${todaysOrders + 1}\\D*`);
      cy.visit(urlList.homePage);
      homePageSteps.changeChannel(defaultChannel.name);
      cy.contains(HOMEPAGE_SELECTORS.orders, regexp).should("be.visible");
    });
  });
});
