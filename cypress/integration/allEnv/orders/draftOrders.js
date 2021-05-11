// <reference types="cypress" />
import faker from "faker";

import {
  createCustomer,
  deleteCustomersStartsWith
} from "../../../apiRequests/Customer";
import { DRAFT_ORDERS_LIST_SELECTORS } from "../../../elements/orders/draft-orders-list-selectors";
import { ORDERS_SELECTORS } from "../../../elements/orders/orders-selectors";
import { selectChannelInPicker } from "../../../steps/channelsSteps";
import { finalizeDraftOrder } from "../../../steps/draftOrderSteps";
import { urlList } from "../../../url/urlList";
import { getDefaultChannel } from "../../../utils/channelsUtils";
import * as productsUtils from "../../../utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../../utils/shippingUtils";

describe("Draft orders", () => {
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
          true
        );
        createShipping({
          channelId: defaultChannel.id,
          name: randomName,
          address: addresses.plAddress
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
        productsUtils.createTypeAttributeAndCategoryForProduct(randomName);
      })
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
      );
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should move draft order to orders", () => {
    cy.visit(urlList.orders)
      .get(ORDERS_SELECTORS.createOrder)
      .click();
    selectChannelInPicker(defaultChannel.name);
    finalizeDraftOrder(randomName, address).then(draftOrderNumber => {
      cy.visit(urlList.orders);
      cy.contains(ORDERS_SELECTORS.orderRow, draftOrderNumber).should(
        $order => {
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
