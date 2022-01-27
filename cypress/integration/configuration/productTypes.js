/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { PRODUCT_TYPE_DETAILS } from "../../elements/productTypes/productTypeDetails";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { productTypeDetailsUrl, urlList } from "../../fixtures/urlList";
import { createAttribute } from "../../support/api/requests/Attribute";
import { createCategory } from "../../support/api/requests/Category";
import {
  assignAttribute,
  createTypeProduct,
  getProductType
} from "../../support/api/requests/ProductType";
import { getProductDetails } from "../../support/api/requests/storeFront/ProductDetails";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import {
  createProductInChannel,
  deleteProductsStartsWith
} from "../../support/api/utils/products/productsUtils";
import filterTests from "../../support/filterTests";
import { createProductType } from "../../support/pages/productTypePage";

filterTests({ definedTags: ["all"] }, () => {
  describe("As an admin I want to manage product types", () => {
    const startsWith = "productType";
    let category;
    let channel;
    let attribute;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteProductsStartsWith(startsWith);
      createAttribute({ name: startsWith }).then(resp => (attribute = resp));
      createCategory(startsWith).then(resp => (category = resp));
      getDefaultChannel().then(resp => (channel = resp));
    });

    beforeEach(() => {
      cy.clearSessionData()
        .loginUserViaRequest()
        .visit(urlList.productTypes)
        .softExpectSkeletonIsVisible();
    });

    it("As an admin I want to create product type without shipping required", () => {
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

    it("As an admin I want to create product type with shipping required", () => {
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

    it("As an admin I want to update product type with product attribute", () => {
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

    it("As an admin I want to update product type with variant attribute", () => {
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

    it("As an admin I want to delete product type", () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      createTypeProduct({ name, hasVariants: false }).then(productType => {
        cy.visitAndWaitForProgressBarToDisappear(
          productTypeDetailsUrl(productType.id)
        )
          .get(BUTTON_SELECTORS.deleteButton)
          .click()
          .addAliasToGraphRequest("ProductTypeDelete")
          .get(SHARED_ELEMENTS.warningDialog)
          .find(BUTTON_SELECTORS.deleteButton)
          .click()
          .waitForRequestAndCheckIfNoErrors("@ProductTypeDelete");
        getProductType(productType.id).should("be.null");
      });
    });

    it("As an admin I want to delete product type with assigned product", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let productType;

      createTypeProduct({ name, hasVariants: false })
        .then(productTypeResp => {
          productType = productTypeResp;
          createProductInChannel({
            name,
            channelId: channel.id,
            categoryId: category.id,
            productTypeId: productType.id
          });
        })
        .then(({ product }) => {
          cy.visitAndWaitForProgressBarToDisappear(
            productTypeDetailsUrl(productType.id)
          )
            .get(BUTTON_SELECTORS.deleteButton)
            .click()
            .addAliasToGraphRequest("ProductTypeDelete")
            .get(SHARED_ELEMENTS.warningDialog)
            .find(BUTTON_SELECTORS.deleteButton)
            .should("not.be.enabled")
            .get(BUTTON_SELECTORS.deleteAssignedItemsConsentCheckbox)
            .click()
            .get(SHARED_ELEMENTS.warningDialog)
            .find(BUTTON_SELECTORS.deleteButton)
            .click()
            .waitForRequestAndCheckIfNoErrors("@ProductTypeDelete");
          getProductType(productType.id).should("be.null");
          getProductDetails(product.id)
            .its("body.data.product")
            .should("be.null");
        });
    });

    it("As an admin I want to remove variant attribute from product type", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let productType;

      createTypeProduct({ name, hasVariants: true })
        .then(productTypeResp => {
          productType = productTypeResp;
          assignAttribute(productType.id, attribute.id);
        })
        .then(() => {
          cy.visitAndWaitForProgressBarToDisappear(
            productTypeDetailsUrl(productType.id)
          )
            .get(BUTTON_SELECTORS.deleteIcon)
            .click()
            .addAliasToGraphRequest("UnassignProductAttribute")
            .get(BUTTON_SELECTORS.submit)
            .click()
            .wait("@UnassignProductAttribute");
          getProductType(productType.id);
        })
        .then(productType => {
          expect(productType.variantAttributes).to.be.empty;
        });
    });

    it("As an admin I want to remove variant attribute from product type", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let productType;

      createTypeProduct({ name, hasVariants: false })
        .then(productTypeResp => {
          productType = productTypeResp;
          assignAttribute(productType.id, attribute.id, "PRODUCT");
        })
        .then(() => {
          cy.visitAndWaitForProgressBarToDisappear(
            productTypeDetailsUrl(productType.id)
          )
            .get(BUTTON_SELECTORS.deleteIcon)
            .click()
            .addAliasToGraphRequest("UnassignProductAttribute")
            .get(BUTTON_SELECTORS.submit)
            .click()
            .wait("@UnassignProductAttribute");
          getProductType(productType.id);
        })
        .then(productType => {
          expect(productType.variantAttributes).to.be.empty;
        });
    });
  });
});
