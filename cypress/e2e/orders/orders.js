/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { ORDER_REFUND } from "../../elements/orders/order-refund";
import { ORDERS_SELECTORS } from "../../elements/orders/orders-selectors";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { urlList } from "../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../fixtures/users";
import {
  createCustomer,
  deleteCustomersStartsWith,
} from "../../support/api/requests/Customer";
import {
  getOrder,
  updateOrdersSettings,
} from "../../support/api/requests/Order";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import {
  createFulfilledOrder,
  createOrder,
  createReadyToFulfillOrder,
} from "../../support/api/utils/ordersUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith,
} from "../../support/api/utils/shippingUtils";
import { selectChannelInPicker } from "../../support/pages/channelsPage";
import { finalizeDraftOrder } from "../../support/pages/draftOrderPage";

describe("Orders", () => {
  const startsWith = "CyOrders-";
  const randomName = startsWith + faker.datatype.number();

  let customer;
  let defaultChannel;
  let warehouse;
  let shippingMethod;
  let variantsList;
  let address;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteCustomersStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    productsUtils.deleteProductsStartsWith(startsWith);

    updateOrdersSettings();
    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
      })
      .then(() => {
        cy.fixture("addresses");
      })
      .then(addresses => {
        address = addresses.plAddress;
        createCustomer(`${randomName}@example.com`, randomName, address, true);
      })
      .then(customerResp => {
        customer = customerResp.user;
        createShipping({
          channelId: defaultChannel.id,
          name: randomName,
          address,
        });
      })
      .then(
        ({ warehouse: warehouseResp, shippingMethod: shippingMethodResp }) => {
          shippingMethod = shippingMethodResp;
          warehouse = warehouseResp;
          productsUtils.createTypeAttributeAndCategoryForProduct({
            name: randomName,
          });
        },
      )
      .then(
        ({
          productType: productTypeResp,
          attribute: attributeResp,
          category: categoryResp,
        }) => {
          productsUtils.createProductInChannel({
            name: randomName,
            channelId: defaultChannel.id,
            warehouseId: warehouse.id,
            productTypeId: productTypeResp.id,
            attributeId: attributeResp.id,
            categoryId: categoryResp.id,
          });
        },
      )
      .then(({ variantsList: variantsResp }) => {
        variantsList = variantsResp;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest(
      "auth",
      ONE_PERMISSION_USERS.order,
    );
  });

  it(
    "should create order with selected channel. TC: SALEOR_2104",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      cy.visit(urlList.orders)
        .get(ORDERS_SELECTORS.createOrder)
        .click();
      selectChannelInPicker(defaultChannel.name);
      finalizeDraftOrder(randomName, address).then(draftOrderNumber => {
        cy.visit(urlList.orders);
        cy.contains(ORDERS_SELECTORS.orderRow, draftOrderNumber).click();
        cy.contains(ORDERS_SELECTORS.salesChannel, defaultChannel.name).should(
          "be.visible",
        );
      });
    },
  );

  it(
    "should not be possible to change channel in order. TC: SALEOR_2105",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      createOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethodId: shippingMethod.id,
        variantsList,
        address,
      }).then(order => {
        cy.visit(urlList.orders);
        cy.contains(ORDERS_SELECTORS.orderRow, order.number).click();
        cy.get(ORDERS_SELECTORS.salesChannel)
          .find("[button]")
          .should("not.exist");
      });
    },
  );

  it(
    "should cancel fulfillment. TC: SALEOR_2106",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      let order;
      createFulfilledOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethodId: shippingMethod.id,
        variantsList,
        address,
        warehouse: warehouse.id,
      })
        .then(({ order: orderResp }) => {
          order = orderResp;
          cy.visit(urlList.orders);
          cy.expectSkeletonIsVisible();
          cy.contains(ORDERS_SELECTORS.orderRow, order.number).click();
          cy.get(SHARED_ELEMENTS.skeleton)
            .should("not.exist")
            .get(ORDERS_SELECTORS.cancelFulfillment)
            .click()
            .get(ORDERS_SELECTORS.cancelFulfillmentSelectField)
            .click()
            .get(BUTTON_SELECTORS.selectOption)
            .first()
            .click()
            .addAliasToGraphRequest("OrderFulfillmentCancel")
            .get(BUTTON_SELECTORS.submit)
            .click()
            .waitForRequestAndCheckIfNoErrors("@OrderFulfillmentCancel");
          getOrder(order.id);
        })
        .then(orderResp => {
          expect(orderResp.status).to.be.eq("UNFULFILLED");
        });
    },
  );

  it(
    "should make a refund. TC: 2107",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      let order;
      createReadyToFulfillOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethodId: shippingMethod.id,
        variantsList,
        address,
      })
        .then(({ order: orderResp }) => {
          order = orderResp;
          cy.visit(urlList.orders);
          cy.expectSkeletonIsVisible();
          cy.contains(ORDERS_SELECTORS.orderRow, order.number).click();
          cy.get(ORDERS_SELECTORS.refundButton)
            .click()
            .get(ORDER_REFUND.productsQuantityInput)
            .type("1")
            .addAliasToGraphRequest("OrderFulfillmentRefundProducts");
          cy.get(BUTTON_SELECTORS.submit)
            .click()
            .waitForRequestAndCheckIfNoErrors(
              "@OrderFulfillmentRefundProducts",
            );
          getOrder(order.id);
        })
        .then(orderResp => {
          expect(orderResp.paymentStatus).to.be.eq("PARTIALLY_REFUNDED");
        });
    },
  );
});
