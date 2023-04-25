/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { ORDER_GRANT_REFUND } from "../../elements/orders/order-grant-refund";
import { ORDERS_SELECTORS } from "../../elements/orders/orders-selectors";
import { ORDER_TRANSACTION_CREATE } from "../../elements/orders/transaction-selectoris";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { urlList } from "../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../fixtures/users";
import {
  createChannel,
  updateChannelOrderSettings,
} from "../../support/api/requests/Channels";
import {
  createCustomer,
  deleteCustomersStartsWith,
} from "../../support/api/requests/Customer";
import { getOrder } from "../../support/api/requests/Order";
import { deleteChannelsStartsWith } from "../../support/api/utils/channelsUtils";
import {
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

describe("Orders", () => {
  const startsWith = "CyOrders-";
  const randomName = startsWith + faker.datatype.number();

  let customer;
  let channel;
  let warehouse;
  let shippingMethod;
  let variantsList;
  let address;
  let taxClass;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteChannelsStartsWith(startsWith);
    deleteCustomersStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    productsUtils.deleteProductsStartsWith(startsWith);

    createChannel({ name: randomName })
      .then(channelResp => {
        channel = channelResp;

        updateChannelOrderSettings({
          channelId: channel.id,
          markAsPaidStrategy: "TRANSACTION_FLOW",
        });
        updateTaxConfigurationForChannel({ channelSlug: channel.slug });
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
          channelId: channel.id,
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
            channelId: channel.id,
            warehouseId: warehouse.id,
            productTypeId: productTypeResp.id,
            attributeId: attributeResp.id,
            categoryId: categoryResp.id,
            taxClassId: taxClass.id,
            price: 10,
          });
        },
      )
      .then(({ variantsList: variantsResp }) => {
        variantsList = variantsResp;
        cy.checkIfDataAreNotNull({
          customer,
          channel,
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
    "should capture manual transaction. TC: 3901",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      createOrder({
        customerId: customer.id,
        shippingMethod,
        channelId: channel.id,
        variantsList,
        address,
      })
        .then(order => {
          cy.visit(urlList.orders + `${order.id}`);
          cy.addAliasToGraphRequest("OrderMarkAsPaid");
          cy.get(SHARED_ELEMENTS.skeleton).should("not.exist");
          cy.get(ORDERS_SELECTORS.markAsPaidButton).click();
          cy.get(ORDERS_SELECTORS.transactionReferenceInput).type(
            `ref_${randomName}`,
          );
          cy.get(BUTTON_SELECTORS.submit)
            .click()
            .waitForRequestAndCheckIfNoErrors("@OrderMarkAsPaid");
          cy.get(ORDERS_SELECTORS.orderTransactionsList).should("be.visible");
          getOrder(order.id);
        })
        .then(orderResp => {
          expect(orderResp.paymentStatus).to.be.eq("FULLY_CHARGED");
          expect(orderResp.transactions).to.be.not.null;
        });
    },
  );

  it(
    "should be able to grant and send refund TC: 3902",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      let order;

      createReadyToFulfillOrder({
        customerId: customer.id,
        shippingMethod,
        channelId: channel.id,
        variantsList,
        address,
      })
        .then(({ order: orderResp }) => {
          order = orderResp;
          const total = order.total.gross.amount;

          cy.visit(urlList.orders + `${order.id}`);
          cy.addAliasToGraphRequest("OrderDetailsGrantRefund");
          cy.get(SHARED_ELEMENTS.skeleton).should("not.exist");
          cy.get(ORDERS_SELECTORS.markAsPaidButton).should("not.exist");
          cy.get(ORDERS_SELECTORS.grantRefundButton).click();
          cy.waitForRequestAndCheckIfNoErrors("@OrderDetailsGrantRefund");
          cy.get(SHARED_ELEMENTS.skeleton).should("not.exist");
          cy.get(ORDER_GRANT_REFUND.setMaxQuantityButton).click();
          cy.get(ORDER_GRANT_REFUND.refundReasonInput).type(
            `reason_${randomName}`,
          );
          cy.get(ORDER_GRANT_REFUND.refundShippingCheckbox).click();
          cy.get(ORDER_GRANT_REFUND.applySelectedRefundButton).click();
          cy.get(ORDER_GRANT_REFUND.refundAmountInput).should(
            "contain.value",
            total,
          );
          cy.get(ORDER_GRANT_REFUND.grantRefundButton)
            .should("be.enabled")
            .click()
            .confirmationMessageShouldAppear();

          cy.get(ORDERS_SELECTORS.refundButton).click();
          cy.get(ORDER_TRANSACTION_CREATE.transactionDescription).type(
            `desc_${randomName}`,
          );
          cy.get(ORDER_TRANSACTION_CREATE.transactionPspReference).type(
            `psp_${randomName}`,
          );
          cy.get(ORDER_TRANSACTION_CREATE.transactAmountInput).type(total);
          cy.get(ORDER_TRANSACTION_CREATE.manualTransactionSubmit)
            .click()
            .confirmationMessageShouldAppear();
          getOrder(order.id);
        })
        .then(orderResp => {
          expect(orderResp.paymentStatus).to.be.eq("FULLY_REFUNDED");
          expect(orderResp.transactions).to.be.not.null;
        });
    },
  );

  it(
    "should be able to capture manual transaction for partial amount TC: 3903",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      createOrder({
        customerId: customer.id,
        shippingMethod,
        channelId: channel.id,
        variantsList,
        address,
      })
        .then(order => {
          let total = order.total.gross.amount;
          total = total - 1;

          cy.visit(urlList.orders + `${order.id}`);
          cy.get(SHARED_ELEMENTS.skeleton).should("not.exist");
          cy.get(ORDERS_SELECTORS.captureManualTransactionButton).click();
          cy.get(ORDER_TRANSACTION_CREATE.transactionDescription).type(
            `desc_${randomName}`,
          );
          cy.get(ORDER_TRANSACTION_CREATE.transactionPspReference).type(
            `psp_${randomName}`,
          );
          cy.get(ORDER_TRANSACTION_CREATE.transactAmountInput).type(total);
          cy.get(ORDER_TRANSACTION_CREATE.manualTransactionSubmit)
            .click()
            .confirmationMessageShouldAppear();
          getOrder(order.id);
        })
        .then(orderResp => {
          expect(orderResp.paymentStatus).to.be.eq("PARTIALLY_CHARGED");
          expect(orderResp.transactions).to.be.not.null;
        });
    },
  );
});
