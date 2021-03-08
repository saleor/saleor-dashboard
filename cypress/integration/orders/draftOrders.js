// <reference types="cypress" />
import faker from "faker";

import * as customerRequests from "../../apiRequests/Customer";
import { ASSIGN_PRODUCTS_SELECTORS } from "../../elements/catalog/products/assign-products-selectors";
import { DRAFT_ORDER_SELECTORS } from "../../elements/orders/draft-order-selectors";
import { DRAFT_ORDERS_LIST_SELECTORS } from "../../elements/orders/draft-orders-list-selectors";
import { ORDERS_SELECTORS } from "../../elements/orders/orders-selectors";
import { SELECT_SHIPPING_METHOD_FORM } from "../../elements/shipping/select-shipping-method-form";
import { selectChannelInPicker } from "../../steps/channelsSteps";
import { urlList } from "../../url/urlList";
import * as channelsUtils from "../../utils/channelsUtils";
import * as productsUtils from "../../utils/productsUtils";
import * as shippingUtils from "../../utils/shippingUtils";

describe("Draft orders", () => {
  const startsWith = "Cy-";
  const randomName = startsWith + faker.random.number();

  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    customerRequests.deleteCustomers(startsWith);
    shippingUtils.deleteShipping(startsWith);
    productsUtils.deleteProperProducts(startsWith);

    channelsUtils
      .getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
      })
      .then(() => {
        cy.fixture("addresses");
      })
      .then(addresses => {
        customerRequests.createCustomer(
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
    cy.get(DRAFT_ORDER_SELECTORS.addProducts)
      .click()
      .get(ASSIGN_PRODUCTS_SELECTORS.searchInput)
      .type(randomName);
    cy.contains(ASSIGN_PRODUCTS_SELECTORS.tableRow, randomName)
      .find(ASSIGN_PRODUCTS_SELECTORS.checkbox)
      .click()
      .get(ASSIGN_PRODUCTS_SELECTORS.submitButton)
      .click()
      .get(DRAFT_ORDER_SELECTORS.editCustomerButton)
      .click()
      .get(DRAFT_ORDER_SELECTORS.selectCustomer)
      .type(randomName);
    cy.contains(DRAFT_ORDER_SELECTORS.selectCustomerOption, randomName)
      .click()
      .get(DRAFT_ORDER_SELECTORS.addShippingCarrierLink)
      .click()
      .get(SELECT_SHIPPING_METHOD_FORM.selectShippingMethod)
      .click()
      .get(SELECT_SHIPPING_METHOD_FORM.shippingMethodOption)
      .first()
      .click();
    cy.addAliasToGraphRequest("OrderShippingMethodUpdate")
      .get(SELECT_SHIPPING_METHOD_FORM.submitButton)
      .click();
    cy.wait("@OrderShippingMethodUpdate");
    cy.getTextFromElement(DRAFT_ORDER_SELECTORS.pageHeader).as(
      "draftOrderNumber"
    );
    cy.addAliasToGraphRequest("OrderDraftFinalize");
    cy.get(DRAFT_ORDER_SELECTORS.finalizeButton)
      .should("be.enabled")
      .click();
    cy.wait("@OrderDraftFinalize");
    cy.get("@draftOrderNumber").then(draftOrderNumber => {
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
