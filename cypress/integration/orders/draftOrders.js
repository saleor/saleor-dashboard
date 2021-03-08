// <reference types="cypress" />
import faker from "faker";

import { createCustomer, deleteCustomers } from "../../apiRequests/Customer";
import { DRAFT_ORDERS_LIST_SELECTORS } from "../../elements/orders/draft-orders-list-selectors";
import { ORDERS_SELECTORS } from "../../elements/orders/orders-selectors";
import { selectChannelInPicker } from "../../steps/channelsSteps";
import { finalizeDraftOrder } from "../../steps/draftOrderSteps";
import { urlList } from "../../url/urlList";
import { getDefaultChannel } from "../../utils/channelsUtils";
import * as productsUtils from "../../utils/productsUtils";
import * as shippingUtils from "../../utils/shippingUtils";

describe("Draft orders", () => {
  const startsWith = "Cy-";
  const randomName = startsWith + faker.random.number();

  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteCustomers(startsWith);
    shippingUtils.deleteShipping(startsWith);
    productsUtils.deleteProperProducts(startsWith);

    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
      })
      .then(() => {
        cy.fixture("addresses");
      })
      .then(addresses => {
        createCustomer(
          `${randomName}@ex.pl`,
          randomName,
          addresses.plAddress,
          true
        );
        shippingUtils.createShipping({
          channelId: defaultChannel.id,
          name: randomName,
          address: addresses.plAddress
        });
      })
      .then(() => {
        productsUtils.createTypeAttributeAndCategoryForProduct(randomName);
      })
      .then(() => {
        productsUtils.createProductInChannel({
          name: randomName,
          channelId: defaultChannel.id,
          warehouseId: shippingUtils.getWarehouse().id,
          productTypeId: productsUtils.getProductType().id,
          attributeId: productsUtils.getAttribute().id,
          categoryId: productsUtils.getCategory().id
        });
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should move draft order to orders", () => {
    cy.visit(urlList.orders)
      .get(ORDERS_SELECTORS.createOrder)
      .click();
    selectChannelInPicker(defaultChannel.name);
    finalizeDraftOrder(randomName).then(draftOrderNumber => {
      cy.visit(urlList.orders);
      cy.contains(ORDERS_SELECTORS.orderRow, draftOrderNumber).should(
        $order => {
          /* eslint-disable no-unused-expressions */
          expect($order).to.be.visible;
        }
      );
      cy.visit(urlList.draftOrders);
      cy.contains(
        DRAFT_ORDERS_LIST_SELECTORS.draftOrderRow,
        draftOrderNumber
      ).should($draftOrder => {
        expect($draftOrder).to.not.exist;
      });
    });
  });
});
