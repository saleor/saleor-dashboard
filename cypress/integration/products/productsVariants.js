import faker from "faker";

import { createChannel } from "../../apiRequests/Channels";
import {
  createProduct,
  updateChannelInProduct
} from "../../apiRequests/Product";
import {
  createFirstVariant,
  createVariant
} from "../../steps/products/VariantsSteps";
import { urlList } from "../../url/urlList";
import {
  deleteChannelsStartsWith,
  getDefaultChannel
} from "../../utils/channelsUtils";
import * as productUtils from "../../utils/productsUtils";
import * as shippingUtils from "../../utils/shippingUtils";
import { getProductVariants } from "../../utils/storeFront/storeFrontProductUtils";

// <reference types="cypress" />
describe("Creating variants", () => {
  const startsWith = "Cy-";
  const attributeValues = ["value1", "value2"];

  let defaultChannel;
  let warehouse;
  let attribute;
  let productType;
  let category;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    shippingUtils.deleteShippingStartsWith(startsWith);
    productUtils.deleteProductsStartsWith(startsWith);
    deleteChannelsStartsWith(startsWith);

    const name = `${startsWith}${faker.random.number()}`;
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
      .then(({ warehouse: warehouseResp }) => (warehouse = warehouseResp));

    productUtils
      .createTypeAttributeAndCategoryForProduct(name, attributeValues)
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
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should create variant visible on frontend", () => {
    const name = `${startsWith}${faker.random.number()}`;
    const price = 10;
    let createdProduct;

    createProduct(attribute.id, name, productType.id, category.id)
      .then(resp => {
        createdProduct = resp.body.data.productCreate.product;
        updateChannelInProduct({
          productId: createdProduct.id,
          channelId: defaultChannel.id
        });
        cy.visit(`${urlList.products}${createdProduct.id}`);
        createFirstVariant({
          sku: name,
          warehouseId: warehouse.id,
          price,
          attribute: attributeValues[0]
        });
        getProductVariants(createdProduct.id, defaultChannel.slug);
      })
      .then(([variant]) => {
        expect(variant).to.have.property("name", attributeValues[0]);
        expect(variant).to.have.property("price", price);
      });
  });
  it("should create several variants", () => {
    const name = `${startsWith}${faker.random.number()}`;
    const secondVariantSku = `${startsWith}${faker.random.number()}`;
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
          warehouseName: warehouse.name,
          attributeName: variants[1].name,
          price: variants[1].price
        });
      })
      .then(() => getProductVariants(createdProduct.id, defaultChannel.slug))
      .then(([firstVariant, secondVariant]) => {
        expect(firstVariant).to.have.property("price", variants[0].price);
        expect(secondVariant).to.have.property("name", variants[1].name);
        expect(secondVariant).to.have.property("price", variants[1].price);
      });
  });
  it("should create variant for many channels", () => {
    const name = `${startsWith}${faker.random.number()}`;
    const variantsPrice = 10;
    let newChannel;
    let createdProduct;
    createChannel(true, name, name, "PLN")
      .then(resp => {
        newChannel = resp.body.data.channelCreate.channel;
        productUtils.createProduct(
          attribute.id,
          name,
          productType.id,
          category.id
        );
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
          warehouseId: warehouse.id,
          price: variantsPrice,
          attribute: attributeValues[0]
        });
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
