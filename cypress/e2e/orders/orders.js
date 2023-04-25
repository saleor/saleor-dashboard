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
import {
  getDefaultTaxClass,
  updateTaxConfigurationForChannel,
} from "../../support/api/utils/taxesUtils";
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
  let taxClass;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteCustomersStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    productsUtils.deleteProductsStartsWith(startsWith);

    updateOrdersSettings();
    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        updateTaxConfigurationForChannel({ channelSlug: defaultChannel.slug });
        getDefaultTaxClass();
      })
      .then(resp => {
        taxClass = resp;
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
          taxClassId: taxClass.id,
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
            taxClassId: taxClass.id,
          });
        },
      )
      .then(({ variantsList: variantsResp }) => {
        variantsList = variantsResp;
        cy.checkIfDataAreNotNull({
          customer,
          defaultChannel,
          warehouse,
          shippingMethod,
          variantsList,
          address,
        });
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
    { tags: ["@orders", "@allEnv", "@stable", "@oldRelease"] },
    () => {
      cy.visit(urlList.orders).get(ORDERS_SELECTORS.createOrderButton).click();
      selectChannelInPicker(defaultChannel.name);
      finalizeDraftOrder(randomName, address);
    },
  );

  it(
    "should not be possible to change channel in order. TC: SALEOR_2105",
    { tags: ["@orders", "@allEnv", "@stable", "@oldRelease"] },
    () => {
      createOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
      }).then(order => {
        cy.visit(urlList.orders + `${order.id}`);
        cy.get(ORDERS_SELECTORS.salesChannel)
          .find("[button]")
          .should("not.exist");
      });
    },
  );

  it(
    "should cancel fulfillment. TC: SALEOR_2106",
    { tags: ["@orders", "@allEnv", "@stable", "@oldRelease"] },
    () => {
      let order;
      createFulfilledOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
        warehouse: warehouse.id,
      })
        .then(({ order: orderResp }) => {
          order = orderResp;
          cy.visit(urlList.orders + `${order.id}`);
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
    { tags: ["@orders", "@allEnv", "@stable", "@oldRelease"] },
    () => {
      let order;
      createReadyToFulfillOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
      })
        .then(({ order: orderResp }) => {
          order = orderResp;
          cy.visit(urlList.orders + `${order.id}`);
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
