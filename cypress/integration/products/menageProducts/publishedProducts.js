import faker from "faker";

import { getProductDetails } from "../../../apiRequests/storeFront/ProductDetails";
import { updateProductPublish } from "../../../steps/products/productSteps";
import { productDetailsUrl } from "../../../url/urlList";
import { getDefaultChannel } from "../../../utils/channelsUtils";
import * as productsUtils from "../../../utils/productsUtils";
import { isProductVisible } from "../../../utils/storeFront/storeFrontProductUtils";

// <reference types="cypress" />
describe("Published products", () => {
  const startsWith = "Cy-";
  const name = `${startsWith}${faker.random.number()}`;
  let productType;
  let attribute;
  let category;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProductsStartsWith(startsWith);
    productsUtils
      .createTypeAttributeAndCategoryForProduct(name)
      .then(
        ({
          attribute: attributeResp,
          productType: productTypeResp,
          category: categoryResp
        }) => {
          productType = productTypeResp;
          attribute = attributeResp;
          category = categoryResp;
        }
      );
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });
  it("should update product to published", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    let defaultChannel;
    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        productsUtils.createProductInChannel({
          name: productName,
          channelId: defaultChannel.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
          isPublished: false,
          isAvailableForPurchase: false
        });
      })
      .then(({ product: productResp }) => {
        const product = productResp;
        const productUrl = productDetailsUrl(product.id);
        updateProductPublish(productUrl, true);
        getProductDetails(product.id, defaultChannel.slug);
      })
      .then(resp => {
        const isVisible = isProductVisible(resp, productName);
        expect(isVisible).to.be.eq(true);
      });
  });
  it("should update product to not published", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    let defaultChannel;
    let product;

    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        productsUtils.createProductInChannel({
          name: productName,
          channelId: defaultChannel.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id
        });
      })
      .then(({ product: productResp }) => {
        product = productResp;
        const productUrl = productDetailsUrl(product.id);
        updateProductPublish(productUrl, false);
        getProductDetails(product.id, defaultChannel.slug);
      })
      .then(resp => {
        const isVisible = isProductVisible(resp, productName);
        expect(isVisible).to.be.eq(false);
        cy.loginInShop();
      })
      .then(() => {
        getProductDetails(product.id, defaultChannel.slug);
      })
      .then(resp => {
        const isVisible = isProductVisible(resp, productName);
        expect(isVisible).to.be.eq(true);
      });
  });
});
