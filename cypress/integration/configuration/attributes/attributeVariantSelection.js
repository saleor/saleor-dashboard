/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import { PRODUCT_DETAILS } from "../../../elements/catalog/products/product-details";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { productDetailsUrl } from "../../../fixtures/urlList";
import { createAttribute } from "../../../support/api/requests/Attribute";
import { createCategory } from "../../../support/api/requests/Category";
import { getVariant } from "../../../support/api/requests/Product";
import {
  createTypeProduct,
  productAttributeAssignmentUpdate
} from "../../../support/api/requests/ProductType";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import {
  createProductInChannelWithoutVariants,
  deleteProductsStartsWith
} from "../../../support/api/utils/products/productsUtils";
import filterTests from "../../../support/filterTests";
import { fillUpVariantDetails } from "../../../support/pages/catalog/products/VariantsPage";

filterTests({ definedTags: ["all"], version: "3.1.0" }, () => {
  describe("Create attribute with type", () => {
    const startsWith = "VarSel";

    const attributesTypes = [
      "DROPDOWN",
      "MULTISELECT",
      "BOOLEAN",
      "NUMERIC",
      "SWATCH",
      "DATE"
    ];
    let channel;
    let category;
    let product;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteProductsStartsWith(startsWith);
      getDefaultChannel().then(defaultChannel => (channel = defaultChannel));
      createCategory(startsWith).then(
        categoryResp => (category = categoryResp)
      );
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    attributesTypes.forEach(attributeType => {
      it(`should create variant with ${attributeType} attribute`, () => {
        const name = `${startsWith}${attributeType}`;
        const inputType = attributeType;
        const attributeValues = ["1", "2"];
        let productType;
        let attribute;

        createAttribute({
          name,
          inputType,
          attributeValues
        })
          .then(attributeResp => {
            attribute = attributeResp;
            createTypeProduct({
              name,
              attributeId: attribute.id,
              productAttributes: false
            });
          })
          .then(productTypeResp => {
            productType = productTypeResp;
            productAttributeAssignmentUpdate({
              productTypeId: productType.id,
              attributeId: attribute.id
            });
          })
          .then(() => {
            createProductInChannelWithoutVariants({
              categoryId: category.id,
              productTypeId: productType.id,
              name,
              channelId: channel.id
            });
          })
          .then(productResp => {
            product = productResp;
            cy.visit(productDetailsUrl(product.id))
              .get(PRODUCT_DETAILS.addVariantsButton)
              .click()
              .get(PRODUCT_DETAILS.createSingleVariantCheckbox)
              .click()
              .get(BUTTON_SELECTORS.submit)
              .click()
              .addAliasToGraphRequest("VariantCreate");
            fillUpVariantDetails({
              sku: name,
              attributeName: attributeValues[0],
              attributeType
            });
            cy.wait("@VariantCreate");
          })
          .then(({ response }) => {
            const variant =
              response.body.data.productVariantCreate.productVariant;
            getVariant(variant.id, channel.slug);
          })
          .then(({ attributes }) => {
            expect(attributes[0].attribute.inputType).to.eq(inputType);
          });
      });
    });
  });
});
