// <reference types="cypress" />
import faker from "faker";

import {
  createCustomer,
  deleteCustomersStartsWith
} from "../../apiRequests/Customer";
import { ORDERS_SELECTORS } from "../../elements/orders/orders-selectors";
import { selectChannelInPicker } from "../../steps/channelsSteps";
import { finalizeDraftOrder } from "../../steps/draftOrderSteps";
import { urlList } from "../../url/urlList";
import { getDefaultChannel } from "../../utils/channelsUtils";
import { createOrder } from "../../utils/ordersUtils";
import * as productsUtils from "../../utils/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../utils/shippingUtils";

describe("Orders", () => {
  const startsWith = "Cy-";
  const randomName = startsWith + faker.random.number();

  let customer;
  let defaultChannel;
  let warehouse;
  let shippingMethod;
  let variantsList;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteCustomersStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    productsUtils.deleteProductsStartsWith(startsWith);

    let address;

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
      .then(({ variants: variantsResp }) => {
        variantsList = variantsResp;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should create order with selected channel", () => {
    cy.visit(urlList.orders)
      .get(ORDERS_SELECTORS.createOrder)
      .click();
    selectChannelInPicker(defaultChannel.name);
    finalizeDraftOrder(randomName).then(draftOrderNumber => {
      cy.visit(urlList.orders);
      cy.contains(ORDERS_SELECTORS.orderRow, draftOrderNumber).click();
      cy.contains(ORDERS_SELECTORS.salesChannel, defaultChannel.name).should(
        "be.visible"
      );
    });
  });
  it("should not be possible to change channel in order", () => {
    createOrder({
      customerId: customer.id,
      channelId: defaultChannel.id,
      shippingMethodId: shippingMethod.id,
      variantsList
    }).then(order => {
      cy.visit(urlList.orders);
      cy.contains(ORDERS_SELECTORS.orderRow, order.number).click();
      cy.get(ORDERS_SELECTORS.salesChannel)
        .find("[button]")
        .should("not.exist");
    });
  });
});
