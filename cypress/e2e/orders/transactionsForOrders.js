/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { ORDERS_SELECTORS } from "../../elements/orders/orders-selectors";
import {
  ONE_PERMISSION_USERS,
  urlList,
} from "../../fixtures";
import {
  createChannel,
  createCustomer,
  getOrder,
  updateChannelOrderSettings,
} from "../../support/api/requests";
import {
  createOrder,
  createShipping,
  getDefaultTaxClass,
  productsUtils,
} from "../../support/api/utils";
import { transactionsOrderUtils } from "../../support/pages/";

describe("Orders", () => {
  const startsWith = "CyOrders-";
  const randomName = startsWith + faker.datatype.number();
  const randomRefNumber = startsWith + faker.datatype.number();
  const randomPSPNumber = startsWith + faker.datatype.number();

  let customer;
  let channel;
  let warehouse;
  let shippingMethod;
  let variantsList;
  let address;
  let taxClass;

  before(() => {
    cy.loginUserViaRequest();
    createChannel({ name: randomName })
      .then(channelResp => {
        channel = channelResp;

        updateChannelOrderSettings({
          channelId: channel.id,
          markAsPaidStrategy: "TRANSACTION_FLOW",
        });
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
    cy.loginUserViaRequest("auth", ONE_PERMISSION_USERS.order).then(() => {
      // set notifiedAboutNavigator to make navigator banner gone from the start - banner was covering needed elements during test
      window.localStorage.setItem("notifiedAboutNavigator", "true");
    });
  });

  it(
    "should mark order as paid. TC: 3901",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      createOrder({
        customerId: customer.id,
        shippingMethod,
        channelId: channel.id,
        variantsList,
        address,
      }).then(order => {
        cy.visit(urlList.orders + `${order.id}`);
        transactionsOrderUtils.markAsPaidOrderWithRefNumber(randomRefNumber);
        cy.checkIfElementIsVisible(ORDERS_SELECTORS.orderTransactionsList);
        getOrder(order.id).then(orderResp => {
          expect(orderResp.paymentStatus).to.be.eq("FULLY_CHARGED");
          expect(orderResp.transactions).to.be.not.null;
        });
      });
    },
  );

  // TODO uncomment when bug: https://github.com/saleor/saleor/issues/12757 if fixed
  xit(
    "should be able to grant and send refund TC: 3902",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      createReadyToFulfillOrder({
        customerId: customer.id,
        shippingMethod,
        channelId: channel.id,
        variantsList,
        address,
      }).then(({ order: orderResp }) => {
        const orderPrice = orderResp.total.gross.amount;

        cy.visit(urlList.orders + `${orderResp.id}`);
        cy.checkIfElementNotExist(ORDERS_SELECTORS.markAsPaidButton);
        transactionsOrderUtils.grantRefundAllProductsAndShippingWithReason(
          "refund reason: wrong size",
          orderPrice,
        );
        transactionsOrderUtils.sendRefundWithDescriptionPSPAndAmount(
          "refund description",
          randomPSPNumber,
          orderPrice,
        );
        getOrder(orderResp.id).then(orderResp => {
          expect(orderResp.paymentStatus).to.be.eq("NOT_CHARGED");
          expect(orderResp.transactions).to.be.not.null;
        });
      });
    },
  );

  it.skip(
    "should be able to capture manual transaction that covers partial order price TC: 3903",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      createOrder({
        customerId: customer.id,
        shippingMethod,
        channelId: channel.id,
        variantsList,
        address,
      }).then(order => {
        const partialOrderPrice = order.total.gross.amount - 1;

        cy.visit(urlList.orders + `${order.id}`);
        transactionsOrderUtils.captureManualTransaction(
          "Manual capture description",
          randomPSPNumber,
          partialOrderPrice,
        );
        getOrder(order.id).then(orderResp => {
          expect(orderResp.paymentStatus).to.be.eq("PARTIALLY_CHARGED");
          expect(orderResp.transactions).to.be.not.null;
        });
      });
    },
  );
});
