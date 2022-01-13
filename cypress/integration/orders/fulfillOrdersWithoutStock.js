// / <reference types="cypress"/>
// / <reference types="../../support"/>

import faker from "faker";

import { orderDetailsUrl } from "../../fixtures/urlList";
import {
  createCustomer,
  deleteCustomersStartsWith
} from "../../support/api/requests/Customer";
import {
  fulfillOrder as fulfillOrderRequest,
  getOrder,
  updateOrdersSettings
} from "../../support/api/requests/Order";
import {
  getVariant,
  updateVariantStock
} from "../../support/api/requests/Product";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import { createReadyToFulfillOrder } from "../../support/api/utils/ordersUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../support/api/utils/shippingUtils";
import filterTests from "../../support/filterTests";
import {
  fulfillOrder,
  fulfillOrderWithInsufficientStock
} from "../../support/pages/orderPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Orders", () => {
    const startsWith = "CyOrders-";
    const randomName = startsWith + faker.datatype.number();

    let customer;
    let defaultChannel;
    let warehouse;
    let shippingMethod;
    let variantsList;
    let address;
    let productType;
    let attribute;
    let category;

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
          createCustomer(
            `${randomName}@example.com`,
            randomName,
            address,
            true
          );
        })
        .then(customerResp => {
          customer = customerResp.user;
          createShipping({
            channelId: defaultChannel.id,
            name: randomName,
            address
          });
        })
        .then(
          ({
            warehouse: warehouseResp,
            shippingMethod: shippingMethodResp
          }) => {
            shippingMethod = shippingMethodResp;
            warehouse = warehouseResp;
            productsUtils.createTypeAttributeAndCategoryForProduct({
              name: randomName
            });
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
          }
        );
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
      productsUtils
        .createProductInChannel({
          name: startsWith + faker.datatype.number(),
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          quantityInWarehouse: 1,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id
        })
        .then(({ variantsList: variantsResp }) => {
          variantsList = variantsResp;
        });
    });

    it("should fulfill order with variant which has insufficient stock", () => {
      createReadyToFulfillOrder({
        address,
        channelId: defaultChannel.id,
        customerId: customer.id,
        shippingMethodId: shippingMethod.id,
        variantsList
      })
        .then(({ order }) => {
          cy.visit(orderDetailsUrl(order.id));
          updateVariantStock({
            variantId: variantsList[0].id,
            warehouseId: warehouse.id,
            quantityInWarehouse: 0
          });
        })
        .then(() => {
          fulfillOrderWithInsufficientStock();
        })
        .then(orderFulfilledResp => {
          expect(orderFulfilledResp.errors).to.be.empty;
          getOrder(orderFulfilledResp.order.id);
        })
        .then(order => {
          expect(order.status).to.eq("FULFILLED");
          getVariant(variantsList[0].id, defaultChannel.slug);
        })
        .then(variantResp => {
          expect(variantResp.stocks[0].quantity).to.eq(-1);
          getVariant(variantsList[0].id, defaultChannel.slug, "token");
        })
        .then(variantResp => expect(variantResp.quantityAvailable).to.eq(0));
    });

    it("should fulfill order with variant which has increased stock", () => {
      let orderWithInsufficientStock;

      createReadyToFulfillOrder({
        address,
        channelId: defaultChannel.id,
        customerId: customer.id,
        shippingMethodId: shippingMethod.id,
        variantsList
      })
        .then(({ order }) => {
          orderWithInsufficientStock = order;
          updateVariantStock({
            variantId: variantsList[0].id,
            warehouseId: warehouse.id,
            quantityInWarehouse: 0
          });
        })
        .then(() => {
          fulfillOrderRequest({
            orderId: orderWithInsufficientStock.id,
            quantity: 1,
            warehouse: warehouse.id,
            linesId: orderWithInsufficientStock.lines,
            allowStockToBeExceeded: true
          });
        })
        .then(orderFulfilledResp => {
          expect(orderFulfilledResp.errors).to.be.empty;
          updateVariantStock({
            variantId: variantsList[0].id,
            warehouseId: warehouse.id,
            quantityInWarehouse: 1
          });
        })
        .then(() => {
          createReadyToFulfillOrder({
            address,
            channelId: defaultChannel.id,
            customerId: customer.id,
            shippingMethodId: shippingMethod.id,
            variantsList
          });
        })
        .then(({ order }) => {
          cy.visit(orderDetailsUrl(order.id));
          fulfillOrder();
          cy.wait("@FulfillOrder").its(
            "response.body.data.orderFulfill.errors"
          );
        })
        .then(errors => expect(errors).to.be.empty);
    });
  });
});
