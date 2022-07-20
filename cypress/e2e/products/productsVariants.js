/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { urlList } from "../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../fixtures/users";
import { createChannel } from "../../support/api/requests/Channels";
import {
  createProduct,
  updateChannelInProduct,
} from "../../support/api/requests/Product";
import * as productUtils from "../../support/api/utils/products/productsUtils";
import { getProductVariants } from "../../support/api/utils/storeFront/storeFrontProductUtils";
import {
  createVariant,
  variantsShouldBeVisible,
} from "../../support/pages/catalog/products/VariantsPage";
import { selectChannelInHeader } from "../../support/pages/channelsPage";

describe("As an admin I should be able to create variant", () => {
  const startsWith = "CyCreateVariants-";
  const attributeValues = ["value1", "value2"];

  let defaultChannel;
  let warehouse;
  let attribute;
  let productType;
  let category;
  let newChannel;

  before(() => {
    const name = `${startsWith}${faker.datatype.number()}`;

    cy.clearSessionData().loginUserViaRequest();

    productUtils
      .createShippingProductTypeAttributeAndCategory(name, attributeValues)
      .then(resp => {
        attribute = resp.attribute;
        productType = resp.productType;
        category = resp.category;
        defaultChannel = resp.defaultChannel;
        warehouse = resp.warehouse;

        createChannel({ isActive: true, name, currencyCode: "USD" });
      })
      .then(resp => (newChannel = resp));
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest(
      "auth",
      ONE_PERMISSION_USERS.product,
    );
  });

  it(
    "should be able to create variant visible for the customers in all channels. TC: SALEOR_2901",
    { tags: ["@variants", "@allEnv", "@critical", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const price = 10;
      let createdProduct;

      createProduct({
        attributeId: attribute.id,
        name,
        productTypeId: productType.id,
        categoryId: category.id,
      })
        .then(resp => {
          createdProduct = resp;
          updateChannelInProduct({
            productId: createdProduct.id,
            channelId: defaultChannel.id,
          });
          updateChannelInProduct({
            productId: createdProduct.id,
            channelId: newChannel.id,
          });
          cy.visit(`${urlList.products}${createdProduct.id}`);
          createVariant({
            channelName: [defaultChannel.name, newChannel.name],
            sku: name,
            price,
            attributeName: attributeValues[0],
          });
          selectChannelInHeader(defaultChannel.name);
          variantsShouldBeVisible({ name, price });
          getProductVariants(createdProduct.id, defaultChannel.slug);
        })
        .then(([variant]) => {
          expect(variant).to.have.property("name", attributeValues[0]);
          expect(variant).to.have.property("price", price);
          selectChannelInHeader(newChannel.name);
          variantsShouldBeVisible({ name, price });
          getProductVariants(createdProduct.id, defaultChannel.slug);
        })
        .then(([variant]) => {
          expect(variant).to.have.property("name", attributeValues[0]);
          expect(variant).to.have.property("price", price);
          getProductVariants(createdProduct.id, newChannel.slug);
        })
        .then(([variant]) => {
          expect(variant).to.have.property("name", attributeValues[0]);
          expect(variant).to.have.property("price", price);
        });
    },
  );

  it(
    "should be able to create several variants visible for the customers. TC: SALEOR_2902",
    { tags: ["@variants", "@allEnv", "@critical", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const secondVariantSku = `${startsWith}${faker.datatype.number()}`;
      const variants = [{ price: 7 }, { name: attributeValues[1], price: 16 }];
      let createdProduct;

      productUtils
        .createProductInChannel({
          name,
          attributeId: attribute.id,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          productTypeId: productType.id,
          categoryId: category.id,
          price: variants[0].price,
        })
        .then(({ product: productResp }) => {
          createdProduct = productResp;
          cy.visit(`${urlList.products}${createdProduct.id}`);
          createVariant({
            sku: secondVariantSku,
            attributeName: variants[1].name,
            price: variants[1].price,
            channelName: defaultChannel.name,
          });
        })
        .then(() => {
          selectChannelInHeader(defaultChannel.name);
          variantsShouldBeVisible({
            name: variants[1].name,
            price: variants[1].price,
          });
          getProductVariants(createdProduct.id, defaultChannel.slug);
        })
        .then(([firstVariant, secondVariant]) => {
          expect(firstVariant).to.have.property("price", variants[0].price);
          expect(secondVariant).to.have.property("name", variants[1].name);
          expect(secondVariant).to.have.property("price", variants[1].price);
        });
    },
  );
});
