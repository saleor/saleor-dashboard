/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { urlList } from "../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../fixtures/users";
import { createChannel } from "../../support/api/requests/Channels";
import {
  createProduct,
  updateChannelInProduct
} from "../../support/api/requests/Product";
import {
  deleteChannelsStartsWith,
  getDefaultChannel
} from "../../support/api/utils/channelsUtils";
import * as productUtils from "../../support/api/utils/products/productsUtils";
import * as shippingUtils from "../../support/api/utils/shippingUtils";
import { getProductVariants } from "../../support/api/utils/storeFront/storeFrontProductUtils";
import filterTests from "../../support/filterTests";
import {
  createFirstVariant,
  createVariant,
  variantsShouldBeVisible
} from "../../support/pages/catalog/products/VariantsPage";
import { enterHomePageChangeChannelAndReturn } from "../../support/pages/channelsPage";

filterTests({ definedTags: ["all", "critical"] }, () => {
  describe("Creating variants", () => {
    const startsWith = "CyCreateVariants-";
    const attributeValues = ["value1", "value2"];

    let defaultChannel;
    let warehouse;
    let attribute;
    let productType;
    let category;
    let newChannel;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      shippingUtils.deleteShippingStartsWith(startsWith);
      productUtils.deleteProductsStartsWith(startsWith);
      deleteChannelsStartsWith(startsWith);

      const name = `${startsWith}${faker.datatype.number()}`;
      getDefaultChannel()
        .then(channel => {
          defaultChannel = channel;
          cy.fixture("addresses");
        })
        .then(fixtureAddresses =>
          shippingUtils.createShipping({
            channelId: defaultChannel.id,
            name,
            address: fixtureAddresses.plAddress
          })
        )
        .then(({ warehouse: warehouseResp }) => {
          warehouse = warehouseResp;
          createChannel({ isActive: true, name, currencyCode: "USD" });
        })
        .then(resp => (newChannel = resp));

      productUtils
        .createTypeAttributeAndCategoryForProduct({ name, attributeValues })
        .then(
          ({
            attribute: attributeResp,
            productType: productTypeResp,
            category: categoryResp
          }) => {
            attribute = attributeResp;
            productType = productTypeResp;
            category = categoryResp;
          }
        );
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest(
        "auth",
        ONE_PERMISSION_USERS.product
      );
    });

    it("should create variant visible on frontend", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const price = 10;
      let createdProduct;

      createProduct({
        attributeId: attribute.id,
        name,
        productTypeId: productType.id,
        categoryId: category.id
      })
        .then(resp => {
          createdProduct = resp;
          updateChannelInProduct({
            productId: createdProduct.id,
            channelId: defaultChannel.id
          });
          cy.visit(`${urlList.products}${createdProduct.id}`);
          createFirstVariant({
            sku: name,
            price,
            attribute: attributeValues[0]
          });
          enterHomePageChangeChannelAndReturn(defaultChannel.name);
          variantsShouldBeVisible({ name, price });
          getProductVariants(createdProduct.id, defaultChannel.slug);
        })
        .then(([variant]) => {
          expect(variant).to.have.property("name", attributeValues[0]);
          expect(variant).to.have.property("price", price);
        });
    });

    it("should create several variants", () => {
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
          price: variants[0].price
        })
        .then(({ product: productResp }) => {
          createdProduct = productResp;
          cy.visit(`${urlList.products}${createdProduct.id}`);
          createVariant({
            sku: secondVariantSku,
            attributeName: variants[1].name,
            price: variants[1].price,
            channelName: defaultChannel.name
          });
        })
        .then(() => {
          enterHomePageChangeChannelAndReturn(defaultChannel.name);
          variantsShouldBeVisible({
            name: variants[1].name,
            price: variants[1].price
          });
          getProductVariants(createdProduct.id, defaultChannel.slug);
        })
        .then(([firstVariant, secondVariant]) => {
          expect(firstVariant).to.have.property("price", variants[0].price);
          expect(secondVariant).to.have.property("name", variants[1].name);
          expect(secondVariant).to.have.property("price", variants[1].price);
        });
    });

    it("should create variant for many channels", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const variantsPrice = 10;
      let createdProduct;
      createProduct({
        attributeId: attribute.id,
        name,
        productTypeId: productType.id,
        categoryId: category.id
      })
        .then(productResp => {
          createdProduct = productResp;
          updateChannelInProduct({
            productId: createdProduct.id,
            channelId: defaultChannel.id
          });
        })
        .then(() => {
          updateChannelInProduct({
            productId: createdProduct.id,
            channelId: newChannel.id
          });
        })
        .then(() => {
          cy.visit(`${urlList.products}${createdProduct.id}`);
          createFirstVariant({
            sku: name,
            price: variantsPrice,
            attribute: attributeValues[0]
          });
          enterHomePageChangeChannelAndReturn(defaultChannel.name);
          variantsShouldBeVisible({ name, price: variantsPrice });
          enterHomePageChangeChannelAndReturn(newChannel.name);
          variantsShouldBeVisible({ name, price: variantsPrice });
          getProductVariants(createdProduct.id, defaultChannel.slug);
        })
        .then(([variant]) => {
          expect(variant).to.have.property("name", attributeValues[0]);
          expect(variant).to.have.property("price", variantsPrice);
          getProductVariants(createdProduct.id, newChannel.slug);
        })
        .then(([variant]) => {
          expect(variant).to.have.property("name", attributeValues[0]);
          expect(variant).to.have.property("price", variantsPrice);
        });
    });
  });
});
