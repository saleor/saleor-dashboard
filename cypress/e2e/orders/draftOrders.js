/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { DRAFT_ORDERS_LIST_SELECTORS } from "../../elements/orders/draft-orders-list-selectors";
import { ORDERS_SELECTORS } from "../../elements/orders/orders-selectors";
import { urlList } from "../../fixtures/urlList";
import {
  createCustomer,
  deleteCustomersStartsWith,
} from "../../support/api/requests/Customer";
import { updateOrdersSettings } from "../../support/api/requests/Order";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith,
} from "../../support/api/utils/shippingUtils";
import { selectChannelInPicker } from "../../support/pages/channelsPage";
import { finalizeDraftOrder } from "../../support/pages/draftOrderPage";

xdescribe("Draft orders", () => {
  const startsWith = "CyDraftOrders-";
  const randomName = startsWith + faker.datatype.number();

  let defaultChannel;
  let warehouse;
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
          addresses.plAddress,
          true,
        );
        createShipping({
          channelId: defaultChannel.id,
          name: randomName,
          address: addresses.plAddress,
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
        productsUtils.createTypeAttributeAndCategoryForProduct({
          name: randomName,
        });
      })
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
      );
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should move draft order to orders",
    { tags: ["@orders", "@allEnv"] },
    () => {
      cy.visit(urlList.orders);
      cy.expectSkeletonIsVisible();
      cy.get(ORDERS_SELECTORS.createOrder).click();
      selectChannelInPicker(defaultChannel.name);
      finalizeDraftOrder(randomName, address).then(draftOrderNumber => {
        cy.visit(urlList.orders);
        cy.contains(ORDERS_SELECTORS.orderRow, draftOrderNumber).should(
          $order => {
            expect($order).to.be.visible;
          },
        );
        cy.visit(urlList.draftOrders);
        cy.contains(
          DRAFT_ORDERS_LIST_SELECTORS.draftOrderRow,
          draftOrderNumber,
        ).should($draftOrder => {
          expect($draftOrder).to.not.exist;
        });
      });
    },
  );
});
