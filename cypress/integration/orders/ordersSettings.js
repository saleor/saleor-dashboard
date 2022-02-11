// / <reference types="cypress"/>
// / <reference types="../../support"/>

import faker from "faker";

import { ONE_PERMISSION_USERS } from "../../fixtures/users";
import {
  createCustomer,
  deleteCustomersStartsWith
} from "../../support/api/requests/Customer";
import {
  getOrder,
  updateOrdersSettings
} from "../../support/api/requests/Order";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import { createWaitingForCaptureOrder } from "../../support/api/utils/ordersUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../support/api/utils/shippingUtils";
import filterTests from "../../support/filterTests";
import { selectAutomaticcallyConfirmAllOrdersAndSave } from "../../support/pages/orders/ordersSettingsPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("As an admin I want to automatically confirm orders", () => {
    const startsWith = "CyOrders-";
    const randomName = startsWith + faker.datatype.number();

    let customer;
    let defaultChannel;
    let warehouse;
    let shippingMethod;
    let address;
    let dataFofCheckout;

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
        .then(({ variantsList }) => {
          dataFofCheckout = {
            channelSlug: defaultChannel.slug,
            email: "example@example.com",
            shippingMethodName: shippingMethod.name,
            variantsList,
            address
          };
        });
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest(
        "auth",
        ONE_PERMISSION_USERS.order
      );
    });

    it("should be able to set orders to not be automatically confirmed. TC: SALEOR_0412", () => {
      updateOrdersSettings(true)
        .then(() => {
          selectAutomaticcallyConfirmAllOrdersAndSave();
          createWaitingForCaptureOrder(dataFofCheckout);
        })
        .then(({ order }) => {
          getOrder(order.id);
        })
        .then(order => {
          expect(order.status).to.eq("UNCONFIRMED");
        });
    });

    it("should be able to set orders to be automatically confirmed. TC: SALEOR_0411", () => {
      updateOrdersSettings(false)
        .then(() => {
          selectAutomaticcallyConfirmAllOrdersAndSave();
          createWaitingForCaptureOrder(dataFofCheckout);
        })
        .then(({ order }) => {
          getOrder(order.id);
        })
        .then(order => {
          expect(order.status).to.eq("UNFULFILLED");
        });
    });
  });
});
