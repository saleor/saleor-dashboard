/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import {
  PRODUCT_TYPE_DETAILS_SELECTORS,
} from "../../../elements/productTypes/productTypeDetails";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { productTypeDetailsUrl } from "../../../fixtures/urlList";
import { createAttribute } from "../../../support/api/requests/Attribute";
import {
  assignAttribute,
  createTypeProduct,
  getProductType,
} from "../../../support/api/requests/ProductType";

describe("As an admin I want to manage attributes in product types", () => {
  const startsWith = "attrProdType";
  let attribute;

  before(() => {
    cy.loginUserViaRequest();
    createAttribute({ name: startsWith }).then(resp => (attribute = resp));
    cy.checkIfDataAreNotNull(attribute);
  });

  beforeEach(() => {
    cy.loginUserViaRequest();
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
            .get(PRODUCT_TYPE_DETAILS_SELECTORS.assignProductAttributeButton)
            .click()
            .addAliasToGraphRequest("AssignProductAttribute")
            .assignElements(startsWith)
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
            .get(PRODUCT_TYPE_DETAILS_SELECTORS.hasVariantsButton)
            .should("be.enabled")
            .click({ force: true })
            .get(PRODUCT_TYPE_DETAILS_SELECTORS.assignVariantAttributeButton)
            .click()
            .addAliasToGraphRequest("AssignProductAttribute")
            .assignElements(startsWith)
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
            .get(PRODUCT_TYPE_DETAILS_SELECTORS.nameInput)
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
    { tags: ["@productType", "@allEnv", "@stable"] },
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
            .get(PRODUCT_TYPE_DETAILS_SELECTORS.nameInput)
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
            .get(PRODUCT_TYPE_DETAILS_SELECTORS.variantSelectionCheckbox)
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
