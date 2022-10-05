/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { PRODUCT_TYPE_DETAILS } from "../../../elements/productTypes/productTypeDetails";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { productTypeDetailsUrl } from "../../../fixtures/urlList";
import { createAttribute } from "../../../support/api/requests/Attribute";
import { createCategory } from "../../../support/api/requests/Category";
import {
  assignAttribute,
  createTypeProduct,
  getProductType,
} from "../../../support/api/requests/ProductType";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import { deleteProductsStartsWith } from "../../../support/api/utils/products/productsUtils";

describe("As an admin I want to manage attributes in product types", () => {
  const startsWith = "attrProdType";
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
    "should be able to update product type with product attribute. TC: SALEOR_1503",
    { tags: ["@productType", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      createTypeProduct({ name })
        .then(productType => {
          cy.visitAndWaitForProgressBarToDisappear(
            productTypeDetailsUrl(productType.id),
          )
            .get(PRODUCT_TYPE_DETAILS.assignProductAttributeButton)
            .click()
            .addAliasToGraphRequest("AssignProductAttribute")
            .assignElements(startsWith, false, true)
            .confirmationMessageShouldAppear()
            .waitForRequestAndCheckIfNoErrors("@AssignProductAttribute");
          getProductType(productType.id);
        })
        .then(productType => {
          expect(productType.productAttributes[0].name).to.eq(startsWith);
        });
    },
  );

  it(
    "should be able to update product type with variant attribute. TC: SALEOR_1504",
    { tags: ["@productType", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      createTypeProduct({ name, hasVariants: false })
        .then(productType => {
          cy.visitAndWaitForProgressBarToDisappear(
            productTypeDetailsUrl(productType.id),
          )
            .get(PRODUCT_TYPE_DETAILS.hasVariantsButton)
            .should("be.enabled")
            .click({ force: true })
            .get(PRODUCT_TYPE_DETAILS.assignVariantAttributeButton)
            .click()
            .addAliasToGraphRequest("AssignProductAttribute")
            .assignElements(startsWith, false, true)
            .confirmationMessageShouldAppear()
            .wait("@AssignProductAttribute");
          getProductType(productType.id);
        })
        .then(productType => {
          expect(productType.assignedVariantAttributes[0].attribute.name).to.eq(
            startsWith,
          );
        });
    },
  );

  it(
    "should be able to remove variant attribute from product type. TC: SALEOR_1506",
    { tags: ["@productType", "@allEnv"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let productType;

      createTypeProduct({ name, hasVariants: true })
        .then(productTypeResp => {
          productType = productTypeResp;
          assignAttribute(productType.id, attribute.id);
        })
        .then(() => {
          cy.visitAndWaitForProgressBarToDisappear(
            productTypeDetailsUrl(productType.id),
          )
            .get(PRODUCT_TYPE_DETAILS.nameInput)
            .should("be.enabled")
            .get(BUTTON_SELECTORS.deleteIcon)
            .should("be.enabled")
            .click()
            .addAliasToGraphRequest("UnassignProductAttribute")
            .get(BUTTON_SELECTORS.submit)
            .click()
            .wait("@UnassignProductAttribute");
          getProductType(productType.id);
        })
        .then(productTypeResp => {
          expect(productTypeResp.assignedVariantAttributes).to.be.empty;
        });
    },
  );

  it(
    "should be able to remove product attribute from product type. TC: SALEOR_1507",
    { tags: ["@productType", "@allEnv"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let productType;

      createTypeProduct({ name, hasVariants: false })
        .then(productTypeResp => {
          productType = productTypeResp;
          assignAttribute(productType.id, attribute.id, "PRODUCT");
        })
        .then(() => {
          cy.visitAndWaitForProgressBarToDisappear(
            productTypeDetailsUrl(productType.id),
          )
            .get(PRODUCT_TYPE_DETAILS.nameInput)
            .should("be.enabled")
            .get(BUTTON_SELECTORS.deleteIcon)
            .should("be.enabled")
            .click()
            .addAliasToGraphRequest("UnassignProductAttribute")
            .get(BUTTON_SELECTORS.submit)
            .click()
            .wait("@UnassignProductAttribute");
          getProductType(productType.id);
        })
        .then(productTypeResp => {
          expect(productTypeResp.assignedVariantAttributes).to.be.empty;
        });
    },
  );

  it(
    "should be able to select attribute as variant selection. TC: SALEOR_1508",
    { tags: ["@productType", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let productType;

      createTypeProduct({ name, hasVariants: true })
        .then(productTypeResp => {
          productType = productTypeResp;
          assignAttribute(productType.id, attribute.id);
        })
        .then(() => {
          cy.visitAndWaitForProgressBarToDisappear(
            productTypeDetailsUrl(productType.id),
          )
            .get(PRODUCT_TYPE_DETAILS.variantSelectionCheckbox)
            .click()
            .addAliasToGraphRequest("ProductAttributeAssignmentUpdate")
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .wait("@ProductAttributeAssignmentUpdate");
          getProductType(productType.id);
        })
        .then(productType => {
          expect(productType.assignedVariantAttributes[0].attribute.name).to.eq(
            startsWith,
          );
          expect(
            productType.assignedVariantAttributes[0].variantSelection,
          ).to.eq(true);
        });
    },
  );
});
