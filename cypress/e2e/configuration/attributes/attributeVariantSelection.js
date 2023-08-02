/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { addVariantUrl } from "../../../fixtures/urlList";
import { createCategory } from "../../../support/api/requests/Category";
import { getVariant } from "../../../support/api/requests/Product";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import {
  createProductInChannelWithoutVariants,
} from "../../../support/api/utils/products/productsUtils";
import {
  createProductTypeWithNewVariantSelectionAttribute,
} from "../../../support/api/utils/productTypeUtils";
import {
  fillUpVariantDetails,
} from "../../../support/pages/catalog/products/VariantsPage";

describe("As an admin I want to use attributes in variant selection", () => {
  const startsWith = "VarSel" + Date.now();

  const attributesTypes = [
    { key: "DROPDOWN", TC: "SALEOR_0534" },
    { key: "BOOLEAN", TC: "SALEOR_0536" },
    { key: "NUMERIC", TC: "SALEOR_0537" },
    { key: "SWATCH", TC: "SALEOR_0538" },
  ];
  let channel;
  let category;

  before(() => {
    cy.loginUserViaRequest();
    getDefaultChannel().then(defaultChannel => (channel = defaultChannel));
    createCategory({ name: startsWith }).then(categoryResp => {
      category = categoryResp;
      cy.checkIfDataAreNotNull({ channel, category });
    });
  });

  beforeEach(() => {
    cy.loginUserViaRequest();
  });

  attributesTypes.forEach(attributeType => {
    it(
      `should create variant with ${attributeType.key} attribute. TC: ${attributeType.TC}`,
      { tags: ["@attribute", "@allEnv"] },
      () => {
        const name = `${startsWith}${
          attributeType.key
        }${faker.datatype.number()}`;
        const variantName = `cypress_variant_${faker.datatype.number()}`;
        const inputType = attributeType.key;
        const attributeValues = ["1", "2"];
        let productType;
        let product;

        createProductTypeWithNewVariantSelectionAttribute({
          name,
          inputType,
          attributeValues,
        }).then(({ productType: productTypeResp }) => {
          productType = productTypeResp;

          createProductInChannelWithoutVariants({
            categoryId: category.id,
            productTypeId: productType.id,
            name,
            channelId: channel.id,
          })
            .then(productResp => {
              product = productResp;

              cy.visit(addVariantUrl(product.id)).addAliasToGraphRequest(
                "VariantCreate",
              );

              fillUpVariantDetails({
                sku: name,
                attributeName: attributeValues[0],
                attributeType: inputType,
                costPrice: 10,
                price: 10,
                variantName,
              });
              cy.wait("@VariantCreate");
            })
            .then(({ response }) => {
              const variant =
                response.body.data.productVariantCreate.productVariant;
              getVariant(variant.id, channel.slug).then(({ attributes }) => {
                expect(attributes[0].attribute.inputType).to.eq(inputType);
                cy.confirmationMessageShouldAppear();
              });
            });
        });
      },
    );
  });
});
