import faker from "faker";

import Channels from "../apiRequests/Channels";
import Customer from "../apiRequests/Customer";
import { DASHBOARD_SELECTORS } from "../elements/dashboard/dashboard-selectors";
import { HEADER_SELECTORS } from "../elements/header/header-selectors";
import OrdersUtils from "../utils/ordersUtils";
import ProductsUtils from "../utils/productsUtils";
import ShippingUtils from "../utils/shippingUtils";

// <reference types="cypress" />
describe("User authorization", () => {
  const startsWith = "Cy-";

  const customer = new Customer();
  const channels = new Channels();
  const productsUtils = new ProductsUtils();
  const shippingUtils = new ShippingUtils();
  const ordersUtils = new OrdersUtils();

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    customer.deleteCustomers(startsWith);
    shippingUtils.deleteShipping(startsWith);
    productsUtils.deleteProducts(startsWith);
    channels.deleteTestChannels(startsWith);
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  xit("should all elements be visible on the dashboard", () => {
    cy.visit("/");
    softAssertVisibility(DASHBOARD_SELECTORS.sales);
    softAssertVisibility(DASHBOARD_SELECTORS.orders);
    softAssertVisibility(DASHBOARD_SELECTORS.activity);
    softAssertVisibility(DASHBOARD_SELECTORS.topProducts);
    softAssertVisibility(DASHBOARD_SELECTORS.ordersReadyToFulfill);
    softAssertVisibility(DASHBOARD_SELECTORS.paymentsWaitingForCapture);
    softAssertVisibility(DASHBOARD_SELECTORS.productsOutOfStock);
  });

  it("should correct amount of orders be displayed", () => {
    const randomName = startsWith + faker.random.number();
    const randomEmail = randomName + "@example.com";
    const randomNameProductOutOfStock = `${startsWith}${faker.random.number()}`;
    const shippingPrice = 12;
    const productPrice = 22;
    cy.fixture("addresses").then(json => {
      channels
        .createChannel(true, randomName, randomName, json.plAddress.currency)
        .then(channelsResp => {
          const channelId = channelsResp.body.data.channelCreate.channel.id;
          const channelSlug = channelsResp.body.data.channelCreate.channel.slug;
          customer
            .createCustomer(randomEmail, randomName, json.plAddress)
            .then(resp => {
              const customerId = resp.body.data.customerCreate.user.id;
              const customerEmail = resp.body.data.customerCreate.user.email;
              shippingUtils
                .createShipping(
                  channelId,
                  randomName,
                  json.plAddress,
                  shippingPrice
                )
                .then(() => {
                  const shippingId = shippingUtils.getShippingMethodId();
                  const warehouseId = shippingUtils.getWarehouseId();
                  productsUtils
                    .createTypeAttributeAndCategoryForProduct(randomName)
                    .then(() => {
                      const productTypeId = productsUtils.getProductTypeId();
                      const attributeId = productsUtils.getAttributeId();
                      const categoryId = productsUtils.getCategoryId();
                      productsUtils
                        .createProductInChannel(
                          randomName,
                          channelId,
                          warehouseId,
                          10,
                          productTypeId,
                          attributeId,
                          categoryId,
                          productPrice
                        )
                        .then(() => {
                          const variantsList = productsUtils.getCreatedVariants();
                          ordersUtils.createReadyToFullfillOrder(
                            customerId,
                            shippingId,
                            channelId,
                            variantsList
                          );
                          ordersUtils.createWaitingForCaptureOrder(
                            channelSlug,
                            customerEmail,
                            variantsList,
                            shippingId
                          );
                        });
                      productsUtils.createProductInChannel(
                        randomNameProductOutOfStock,
                        channelId,
                        warehouseId,
                        0,
                        productTypeId,
                        attributeId,
                        categoryId,
                        productPrice
                      );
                    });
                });
            });
        });
    });
    cy.visit("/");
    cy.get(HEADER_SELECTORS.channelSelect)
      .click()
      .get(HEADER_SELECTORS.channelSelectList)
      .contains(randomName)
      .click();
  });

  function softAssertVisibility(selector) {
    cy.get(selector).then(element => chai.softExpect(element).to.be.visible);
  }

  function softAssertMatch(selector, regexp) {
    cy.get(selector)
      .invoke("text")
      .then(text =>
        chai.softExpect(assert.match(text, regexp, "regexp matches"))
      );
  }
});
