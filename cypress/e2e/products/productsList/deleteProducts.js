/// <reference types="cypress"/>
/// <reference types="../../../support"/>
import faker from "faker";

import { BUTTON_SELECTORS, PRODUCTS_LIST } from "../../../elements/";
import { DIALOGS_MESSAGES } from "../../../fixtures/";
import { urlList } from "../../../fixtures/urlList";
import { getDefaultChannel, productsUtils } from "../../../support/api/utils/";
import { ensureCanvasStatic } from "../../../support/customCommands/sharedElementsOperations/canvas";

describe("Test for metadata", () => {
  const startsWith = "AABulkDeleteCypress";
  const name = `${startsWith}${faker.datatype.number()}`;
  const name2 = `${startsWith}${faker.datatype.number()}`;
  let channel;
  let product;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProductsStartsWith(startsWith);
    getDefaultChannel()
      .then(channelResp => {
        channel = channelResp;
        productsUtils.createTypeAttributeAndCategoryForProduct({ name });
      })
      .then(({ attribute, category, productType }) => {
        productsUtils.createProductInChannel({
          attributeId: attribute.id,
          categoryId: category.id,
          channelId: channel.id,
          name,
          productTypeId: productType.id,
        });
        productsUtils.createProductInChannel({
          attributeId: attribute.id,
          categoryId: category.id,
          channelId: channel.id,
          name: name2,
          productTypeId: productType.id,
        });
      })
      .then(({ product: productResp }) => {
        product = productResp;
        cy.checkIfDataAreNotNull({ channel, product });
      });
  });

  it(
    "should create metadata for product",
    { tags: ["@metadata", "@allEnv", "@stable"] },
    () => {
      cy.clearSessionData().loginUserViaRequest();
      cy.visit(urlList.products);
      cy.clickGridCell(0, 0);
      cy.clickGridCell(0, 1);
      cy.get(BUTTON_SELECTORS.deleteProductsButton).click();
      cy.contains(DIALOGS_MESSAGES.confirmProductsDeletion).should(
        "be.visible",
      );
      cy.addAliasToGraphRequest("productBulkDelete")
        .clickSubmitButton()
        .waitForRequestAndCheckIfNoErrors("@productBulkDelete");
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable);
      cy.get(BUTTON_SELECTORS.submit).should("not.exist");
    },
  );
});
