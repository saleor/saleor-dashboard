/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { PRODUCT_TYPE_DETAILS } from "../../elements/productTypes/productTypeDetails";
import { productTypeDetailsUrl, urlList } from "../../fixtures/urlList";
import { createAttribute } from "../../support/api/requests/Attribute";
import {
  createTypeProduct,
  getProductType
} from "../../support/api/requests/ProductType";
import { deleteProductsStartsWith } from "../../support/api/utils/products/productsUtils";
import filterTests from "../../support/filterTests";
import { createProductType } from "../../support/pages/productTypePage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Tests for product types", () => {
    const startsWith = "ProductType";

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteProductsStartsWith(startsWith);
      createAttribute({ name: startsWith });
    });

    beforeEach(() => {
      cy.clearSessionData()
        .loginUserViaRequest()
        .visit(urlList.productTypes)
        .softExpectSkeletonIsVisible();
    });

    it("Create product type without shipping required", () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      createProductType(name, false)
        .then(productType => {
          getProductType(productType.id);
        })
        .then(productType => {
          expect(productType.name).to.be.eq(name);
          expect(productType.isShippingRequired).to.be.false;
        });
    });

    it("Create product type with shipping required", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const shippingWeight = 10;

      createProductType(name, shippingWeight)
        .then(productType => {
          getProductType(productType.id);
        })
        .then(productType => {
          expect(productType.name).to.be.eq(name);
          expect(productType.isShippingRequired).to.be.true;
          expect(productType.weight.value).to.eq(shippingWeight);
        });
    });

    it("Update product type with product attribute", () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      createTypeProduct({ name })
        .then(productType => {
          cy.visitAndWaitForProgressBarToDisappear(
            productTypeDetailsUrl(productType.id)
          )
            .get(PRODUCT_TYPE_DETAILS.assignProductAttributeButton)
            .click()
            .addAliasToGraphRequest("AssignProductAttribute")
            .assignElements(startsWith, false)
            .confirmationMessageShouldDisappear()
            .waitForRequestAndCheckIfNoErrors("@AssignProductAttribute");
          getProductType(productType.id);
        })
        .then(productType => {
          expect(productType.productAttributes[0].name).to.eq(startsWith);
        });
    });

    it("Update product type with variant attribute", () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      createTypeProduct({ name, hasVariants: false })
        .then(productType => {
          cy.visitAndWaitForProgressBarToDisappear(
            productTypeDetailsUrl(productType.id)
          )
            .get(PRODUCT_TYPE_DETAILS.hasVariantsButton)
            .click()
            .get(PRODUCT_TYPE_DETAILS.assignVariantAttributeButton)
            .click()
            .addAliasToGraphRequest("AssignProductAttribute")
            .assignElements(startsWith, false)
            .confirmationMessageShouldDisappear()
            .wait("@AssignProductAttribute");
          getProductType(productType.id);
        })
        .then(productType => {
          expect(productType.variantAttributes[0].name).to.eq(startsWith);
        });
    });
  });
});
