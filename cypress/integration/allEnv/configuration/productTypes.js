import faker from "faker";

import { createAttribute } from "../../../apiRequests/Attribute";
import {
  createTypeProduct,
  getProductType
} from "../../../apiRequests/productType";
import { PRODUCT_TYPE_DETAILS } from "../../../elements/productTypes/productTypeDetails";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { createProductType } from "../../../steps/productTypeSteps";
import { assignElements } from "../../../steps/shared/assignElements";
import { confirmationMessageShouldDisappear } from "../../../steps/shared/confirmationMessage";
import { productTypeDetailsUrl, urlList } from "../../../url/urlList";
import { deleteProductsStartsWith } from "../../../utils/products/productsUtils";

describe("Tests for product types", () => {
  const startsWith = "ProductType";

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteProductsStartsWith(startsWith);
    createAttribute(startsWith);
  });

  beforeEach(() => {
    cy.clearSessionData()
      .loginUserViaRequest()
      .visit(urlList.productTypes);
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
        cy.visit(productTypeDetailsUrl(productType.id))
          .get(SHARED_ELEMENTS.progressBar)
          .should("be.not.visible")
          .get(PRODUCT_TYPE_DETAILS.assignProductAttributeButton)
          .click();
        cy.addAliasToGraphRequest("AssignProductAttribute");
        assignElements(startsWith, false);
        confirmationMessageShouldDisappear();
        cy.wait("@AssignProductAttribute");
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
        cy.visit(productTypeDetailsUrl(productType.id))
          .get(SHARED_ELEMENTS.progressBar)
          .should("be.not.visible")
          .get(PRODUCT_TYPE_DETAILS.hasVariantsButton)
          .click()
          .get(PRODUCT_TYPE_DETAILS.assignVariantAttributeButton)
          .click();
        cy.addAliasToGraphRequest("AssignProductAttribute");
        assignElements(startsWith, false);
        confirmationMessageShouldDisappear();
        cy.wait("@AssignProductAttribute");
        getProductType(productType.id);
      })
      .then(productType => {
        expect(productType.variantAttributes[0].name).to.eq(startsWith);
      });
  });
});
