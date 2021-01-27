import faker from "faker";

import Customer from "../api/Customer";
import Order from "../api/Order";
import Product from "../api/Product";
import ShippingMethod from "../api/ShippingMethod";
import { DASHBOARD_SELECTORS } from "../elements/dashboard/dashboard-selectors";

// <reference types="cypress" />
describe("User authorization", () => {
  const startsWith = "Cy-";

  const customer = new Customer();
  const product = new Product();
  const order = new Order();
  const shippingMethod = new ShippingMethod();

  before(() => {
    customer.deleteCustomers(startsWith);
    shippingMethod.deleteShippingZones(startsWith);
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
    faker = require("faker");
    const randomName = startsWith + faker.random.number();
    const randomEmail = randomName + "@example.com";
    product.getFirstProducts(3).then(productsResp => {
      const productsList = productsResp.body.data.products.edges;
      productsList.forEach(productElement => {
        product.updateChannelInProduct(
          "Q2hhbm5lbDoxNzk=",
          productElement.node.id
        );
        const variants = productElement.node.variants;
        variants.forEach(variant => {
          product.updateChannelPriceInVariant(variant.id, "Q2hhbm5lbDoxNzk=");
        });
      });
      cy.fixture("addresses").then(json => {
        customer
          .createCustomer(randomEmail, randomName, json.plAddress)
          .as("createCustomerResponse")
          .then(resp => {
            const customerId = resp.body.data.customerCreate.user.id;
            shippingMethod
              .createShippingZone(randomName, "PL")
              .then(shippingZoneResp => {
                shippingMethod
                  .createShippingRate(
                    randomName,
                    shippingZoneResp.body.data.shippingZoneCreate.shippingZone
                      .id
                  )
                  .then(rateResp => {
                    const shippingMethodId =
                      rateResp.body.data.shippingPriceCreate.shippingMethod.id;
                    shippingMethod
                      .addChannelToShippingMethod(
                        shippingMethodId,
                        "Q2hhbm5lbDoxNzk="
                      )
                      .then(shippingMethodResp => {
                        createReadyToFullfillOrder(
                          customerId,
                          shippingMethodId,
                          "Q2hhbm5lbDoxNzk=",
                          productsList
                        );
                      });
                  });
              });
          });
      });
    });
    cy.visit("/");
    softAssertMatch(DASHBOARD_SELECTORS.orders, /^0/);
    softAssertMatch(DASHBOARD_SELECTORS.ordersReadyToFulfill, /^Brak/);
    softAssertMatch(DASHBOARD_SELECTORS.paymentsWaitingForCapture, /^Brak/);
    softAssertMatch(DASHBOARD_SELECTORS.productsOutOfStock, /^Brak/);
  });

  function createReadyToFullfillOrder(
    customerId,
    shippingMethodId,
    channelId,
    productsList
  ) {
    order
      .createDraftOrder(customerId, shippingMethodId, channelId)
      .then(draftOrderResp => {
        const orderId = draftOrderResp.body.data.draftOrderCreate.order.id;
        productsList.forEach(productElement => {
          productElement.node.variants.forEach(variantElement => {
            order.addProductToOrder(orderId, variantElement.id);
          });
        });
        order.markOrderAsPaid(orderId);
        order.completeOrder(orderId);
      });
  }

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
