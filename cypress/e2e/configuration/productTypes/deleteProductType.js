/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { productTypeDetailsUrl } from "../../../fixtures/urlList";
import { createAttribute } from "../../../support/api/requests/Attribute";
import { createCategory } from "../../../support/api/requests/Category";
import {
  createTypeProduct,
  getProductType,
} from "../../../support/api/requests/ProductType";
import { getProductDetails } from "../../../support/api/requests/storeFront/ProductDetails";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import {
  createProductInChannel,
  deleteProductsStartsWith,
} from "../../../support/api/utils/products/productsUtils";

describe("As an admin I want to manage product types", () => {
  const startsWith = "delProdType";
  let category;
  let channel;
  let attribute;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteProductsStartsWith(startsWith);
    createAttribute({ name: startsWith }).then(resp => (attribute = resp));
    createCategory({ name: startsWith }).then(resp => (category = resp));
    getDefaultChannel().then(resp => (channel = resp));
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should be able to delete product type. TC: SALEOR_1505",
    { tags: ["@productType", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      createTypeProduct({ name, hasVariants: false }).then(productType => {
        cy.visitAndWaitForProgressBarToDisappear(
          productTypeDetailsUrl(productType.id),
        )
          .get(BUTTON_SELECTORS.deleteButton)
          .click()
          .addAliasToGraphRequest("ProductTypeDelete")
          .get(BUTTON_SELECTORS.confirmDeleteButton)
          .click()
          .waitForRequestAndCheckIfNoErrors("@ProductTypeDelete");
        getProductType(productType.id).should("be.null");
      });
    },
  );

  it(
    "should be able to delete product type with assigned product. TC: SALEOR_1509",
    { tags: ["@productType", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let productType;

      createTypeProduct({ name, hasVariants: false })
        .then(productTypeResp => {
          productType = productTypeResp;
          createProductInChannel({
            name,
            channelId: channel.id,
            categoryId: category.id,
            productTypeId: productType.id,
          });
        })
        .then(({ product }) => {
          cy.visitAndWaitForProgressBarToDisappear(
            productTypeDetailsUrl(productType.id),
          )
            .get(BUTTON_SELECTORS.deleteButton)
            .click()
            .addAliasToGraphRequest("ProductTypeDelete")
            .get(BUTTON_SELECTORS.confirmDeleteButton)
            .should("not.be.enabled")
            .get(BUTTON_SELECTORS.deleteAssignedItemsConsentCheckbox)
            .click()
            .get(BUTTON_SELECTORS.confirmDeleteButton)
            .click()
            .waitForRequestAndCheckIfNoErrors("@ProductTypeDelete");
          getProductType(productType.id).should("be.null");
          getProductDetails(product.id)
            .its("body.data.product")
            .should("be.null");
        });
    },
  );
});
