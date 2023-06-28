/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import {
  BUTTON_SELECTORS,
  DRAFT_ORDERS_LIST_SELECTORS,
  ORDERS_SELECTORS,
  SHARED_ELEMENTS,
} from "../../elements/";
import { urlList } from "../../fixtures/urlList";
import {
  createCustomer,
  updateOrdersSettings,
} from "../../support/api/requests/";
import { createShipping, getDefaultChannel } from "../../support/api/utils/";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import {
  finalizeDraftOrder,
  selectChannelInPicker,
} from "../../support/pages/";

describe("Draft orders", () => {
  const startsWith = "CyDraftOrders-";
  const randomName = startsWith + faker.datatype.number();

  let defaultChannel;
  let warehouse;
  let address;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
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
        cy.checkIfDataAreNotNull({ defaultChannel, warehouse, address }),
      );
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should move draft order to orders. TC: SALEOR_2103",
    { tags: ["@orders", "@allEnv"] },
    () => {
      let draftOrderNumber;
      cy.addAliasToGraphRequest("OrderDraftFinalize");
      cy.addAliasToGraphRequest("OrderList");

      cy.visit(urlList.orders);
      cy.get(ORDERS_SELECTORS.createOrderButton).click();
      selectChannelInPicker(defaultChannel.name);
      finalizeDraftOrder(randomName, address)
        .wait("@OrderDraftFinalize")
        .then(finalizedDraftOrderResponse => {
          cy.log(finalizedDraftOrderResponse);
          draftOrderNumber =
            finalizedDraftOrderResponse.response.body.data.draftOrderComplete
              .order.number;
          cy.get(SHARED_ELEMENTS.pageHeader).should(
            "contain.text",
            draftOrderNumber,
          );
          cy.get(BUTTON_SELECTORS.back)
            .click()
            .waitForRequestAndCheckIfNoErrors("@OrderList");
          cy.visit(urlList.draftOrders).then(() => {
            cy.get(DRAFT_ORDERS_LIST_SELECTORS.draftOrderRow).should(
              "have.length.greaterThan",
              5,
            );
            cy.contains(draftOrderNumber).should("not.exist");
          });
        });
    },
  );
});
