// / <reference types="cypress"/>
// / <reference types="../../support"/>

import faker from "faker";

import { ORDERS_SELECTORS } from "../../elements/orders/orders-selectors";
import { urlList } from "../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../fixtures/users";
import {
  createCustomer,
  deleteCustomersStartsWith
} from "../../support/api/requests/Customer";
import { updateOrdersSettings } from "../../support/api/requests/Order";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../support/api/utils/shippingUtils";
import filterTests from "../../support/filterTests";
import { selectChannelInPicker } from "../../support/pages/channelsPage";

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
          customer = customerResp.body.data.customerCreate.user;
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
              quantityInWarehouse: 0,
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
      cy.clearSessionData().loginUserViaRequest();
      cy.visit(urlList.orders)
        .get(ORDERS_SELECTORS.createOrder)
        .click();
      selectChannelInPicker(defaultChannel.name);
      cy.pause();
    });
  });
});
