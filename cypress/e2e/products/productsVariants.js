/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { PRODUCT_DETAILS } from "../../elements/catalog/products/product-details";
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
  addVariantToDataGrid,
  enterVariantEditPage,
} from "../../support/pages/catalog/products/productDetailsPage";
import {
  createVariant,
  selectChannelsForVariant,
} from "../../support/pages/catalog/products/VariantsPage";

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

    cy.loginUserViaRequest();

    productUtils
      .createShippingProductTypeAttributeAndCategory(name, attributeValues)
      .then(resp => {
        attribute = resp.attribute;
        productType = resp.productType;
        category = resp.category;
        defaultChannel = resp.defaultChannel;
        warehouse = resp.warehouse;

        createChannel({ isActive: true, name, currencyCode: "PLN" });
      })
      .then(resp => {
        newChannel = resp;
      });
    cy.checkIfDataAreNotNull({
      defaultChannel,
      warehouse,
      attribute,
      productType,
      category,
      newChannel,
    });
  });

  beforeEach(() => {
    cy.loginUserViaRequest("auth", ONE_PERMISSION_USERS.product);
  });

  it(
    "should be able to create variant visible for the customers in all channels. TC: SALEOR_2901",
    { tags: ["@variants", "@allEnv", "@stable", "@oldRelease"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const price = 10;
      let createdProduct;
      // TODO fix name for proper one when problem with typing in grid will be solved - now only first letter of string is able to be typed in grid cell
      const variantName = "A";

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
          cy.visit(
            `${urlList.products}${createdProduct.id}`,
          ).waitForProgressBarToNotBeVisible();
          addVariantToDataGrid(variantName);
          enterVariantEditPage();
          selectChannelsForVariant();
          cy.addAliasToGraphRequest("VariantUpdate");
          createVariant({
            channelName: [defaultChannel.name, newChannel.name],
            sku: name,
            price,
            attributeName: attributeValues[0],
          });
          cy.wait("@VariantUpdate");
          getProductVariants(createdProduct.id, defaultChannel.slug);
        })
        .then(([variant]) => {
          expect(variant).to.have.property("name", variantName);
          expect(variant).to.have.property("price", price);
          expect(variant).to.have.property("currency", "USD");
          getProductVariants(createdProduct.id, newChannel.slug);
        })
        .then(([variant]) => {
          expect(variant).to.have.property("name", variantName);
          expect(variant).to.have.property("price", price);
          expect(variant).to.have.property("currency", "PLN");
        });
    },
  );
  it(
    "should be able to create variant. TC: SALEOR_2900",
    { tags: ["@variants", "@allEnv", "@critical", "@stable", "@oldRelease"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let createdProduct;

      createProduct({
        attributeId: attribute.id,
        name,
        productTypeId: productType.id,
        categoryId: category.id,
      }).then(resp => {
        createdProduct = resp;

        updateChannelInProduct({
          productId: createdProduct.id,
          channelId: defaultChannel.id,
        });
        updateChannelInProduct({
          productId: createdProduct.id,
          channelId: newChannel.id,
        });
        cy.visit(
          `${urlList.products}${createdProduct.id}`,
        ).waitForProgressBarToNotBeVisible();
        addVariantToDataGrid(name);
      });
    },
  );

  it(
    "should be able to create several variants visible for the customers. TC: SALEOR_2902 - migration in progress - to delete when done",
    { tags: ["@variants", "@allEnv", "@critical", "@stable", "@oldRelease"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const secondVariantSku = `${startsWith}${faker.datatype.number()}`;
      const secondVariantName = `${startsWith}${faker.datatype.number()}`;
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
          cy.get(PRODUCT_DETAILS.dataGridTable).scrollIntoView();
          enterVariantEditPage();
          cy.get(PRODUCT_DETAILS.addVariantButton)
            .click()
            .then(() => {
              cy.addAliasToGraphRequest("VariantCreate");
              createVariant({
                sku: secondVariantSku,
                attributeName: variants[1].name,
                price: variants[1].price,
                channelName: defaultChannel.name,
                variantName: secondVariantName,
              });
              cy.wait("@VariantCreate");
              getProductVariants(createdProduct.id, defaultChannel.slug);
            })
            .then(([secondVariant, firstVariant]) => {
              expect(firstVariant).to.have.property("price", variants[0].price);
              expect(firstVariant).to.have.property("name", "value");
              expect(firstVariant).to.have.property("currency", "USD");
              expect(secondVariant).to.have.property("name", secondVariantName);
              expect(secondVariant).to.have.property(
                "price",
                variants[1].price,
              );
              expect(secondVariant).to.have.property("currency", "USD");
            });
        });
    },
  );
});
