// <reference types="cypress" />
import faker from "faker";

import {
  createCustomer,
  deleteCustomersStartsWith
} from "../../../apiRequests/Customer";
import { getOrder } from "../../../apiRequests/Order";
import { ONE_PERMISSION_USERS } from "../../../Data/users";
import { ORDER_REFUND } from "../../../elements/orders/order-refund";
import { ORDERS_SELECTORS } from "../../../elements/orders/orders-selectors";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { selectChannelInPicker } from "../../../steps/channelsSteps";
import { finalizeDraftOrder } from "../../../steps/draftOrderSteps";
import { fillAutocompleteSelect } from "../../../steps/shared/autocompleteSelect";
import { urlList } from "../../../url/urlList";
import { getDefaultChannel } from "../../../utils/channelsUtils";
import {
  createFulfilledOrder,
  createOrder,
  createReadyToFulfillOrder
} from "../../../utils/ordersUtils";
import * as productsUtils from "../../../utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../../utils/shippingUtils";

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
        customer = customerResp.body.data.customerCreate.user;
        createShipping({
          channelId: defaultChannel.id,
          name: randomName,
          address
        });
      })
      .then(
        ({ warehouse: warehouseResp, shippingMethod: shippingMethodResp }) => {
          shippingMethod = shippingMethodResp;
          warehouse = warehouseResp;
          productsUtils.createTypeAttributeAndCategoryForProduct(randomName);
        }
      )
      .then(
        ({
          productType: productTypeResp,
          attribute: attributeResp,
          category: categoryResp
        }) => {
          productsUtils.createProductInChannel({
            name: randomName,
            channelId: defaultChannel.id,
            warehouseId: warehouse.id,
            productTypeId: productTypeResp.id,
            attributeId: attributeResp.id,
            categoryId: categoryResp.id
          });
        }
      )
      .then(({ variantsList: variantsResp }) => {
        variantsList = variantsResp;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest(
      "auth",
      ONE_PERMISSION_USERS.order
    );
  });

  it("should create order with selected channel", () => {
    // Remove login as admin after fixing SALEOR-3154
    cy.clearSessionData().loginUserViaRequest();
    cy.visit(urlList.orders)
      .get(ORDERS_SELECTORS.createOrder)
      .click();
    selectChannelInPicker(defaultChannel.name);
    finalizeDraftOrder(randomName, address).then(draftOrderNumber => {
      cy.visit(urlList.orders);
      cy.contains(ORDERS_SELECTORS.orderRow, draftOrderNumber).click();
      cy.contains(ORDERS_SELECTORS.salesChannel, defaultChannel.name).should(
        "be.visible"
      );
    });
  });

  // This test will pass after fixing SALEOR-3154
  it("should not be possible to change channel in order", () => {
    createOrder({
      customerId: customer.id,
      channelId: defaultChannel.id,
      shippingMethodId: shippingMethod.id,
      variantsList,
      address
    }).then(order => {
      cy.visit(urlList.orders);
      cy.contains(ORDERS_SELECTORS.orderRow, order.number).click();
      cy.get(ORDERS_SELECTORS.salesChannel)
        .find("[button]")
        .should("not.exist");
    });
  });

  it("should cancel fulfillment", () => {
    let order;
    createFulfilledOrder({
      customerId: customer.id,
      channelId: defaultChannel.id,
      shippingMethodId: shippingMethod.id,
      variantsList,
      address,
      warehouse: warehouse.id
    })
      .then(({ order: orderResp }) => {
        order = orderResp;
        cy.visit(urlList.orders);
        cy.contains(ORDERS_SELECTORS.orderRow, order.number).click();
        cy.get(SHARED_ELEMENTS.skeleton)
          .should("not.exist")
          .get(ORDERS_SELECTORS.orderFulfillmentFrame)
          .find(BUTTON_SELECTORS.showMoreButton)
          .click()
          .get(ORDERS_SELECTORS.cancelFulfillment)
          .click();
      })
      .then(() => {
        fillAutocompleteSelect(
          ORDERS_SELECTORS.cancelFulfillmentSelectField,
          warehouse.name
        );
        cy.addAliasToGraphRequest("OrderFulfillmentCancel");
        cy.get(BUTTON_SELECTORS.submit).click();
        cy.wait("@OrderFulfillmentCancel");
        getOrder(order.id);
      })
      .then(orderResp => {
        expect(orderResp.status).to.be.eq("UNFULFILLED");
      });
  });

  it("should make a refund", () => {
    let order;
    createReadyToFulfillOrder({
      customerId: customer.id,
      channelId: defaultChannel.id,
      shippingMethodId: shippingMethod.id,
      variantsList,
      address
    })
      .then(({ order: orderResp }) => {
        order = orderResp;
        cy.visit(urlList.orders);
        cy.contains(ORDERS_SELECTORS.orderRow, order.number).click();
        cy.get(ORDERS_SELECTORS.refundButton)
          .click()
          .get(ORDER_REFUND.productsQuantityInput)
          .type("1")
          .addAliasToGraphRequest("OrderFulfillmentRefundProducts");
        cy.get(BUTTON_SELECTORS.submit)
          .click()
          .wait("@OrderFulfillmentRefundProducts");
        getOrder(order.id);
      })
      .then(orderResp => {
        expect(orderResp.paymentStatus).to.be.eq("FULLY_REFUNDED");
      });
  });
});
