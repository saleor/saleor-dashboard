/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { productDetailsUrl } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { getProductDetails } from "../../../support/api/requests/storeFront/ProductDetails";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import { isProductVisible } from "../../../support/api/utils/storeFront/storeFrontProductUtils";
import { updateProductPublish } from "../../../support/pages/catalog/products/productDetailsPage";

describe("Published products", () => {
  const startsWith = "CyPublishedProducts-";
  const name = `${startsWith}${faker.datatype.number()}`;
  let productType;
  let attribute;
  let category;
  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProductsStartsWith(startsWith);
    productsUtils
      .createTypeAttributeAndCategoryForProduct({ name })
      .then(
        ({
          attribute: attributeResp,
          productType: productTypeResp,
          category: categoryResp,
        }) => {
          productType = productTypeResp;
          attribute = attributeResp;
          category = categoryResp;
          getDefaultChannel();
        },
      )
      .then(channel => {
        defaultChannel = channel;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest(
      "auth",
      ONE_PERMISSION_USERS.product,
    );
  });

  it(
    "should update product to published",
    { tags: ["@products", "@allEnv", "@stable"] },
    () => {
      const productName = `${startsWith}${faker.datatype.number()}`;

      productsUtils
        .createProductInChannel({
          name: productName,
          channelId: defaultChannel.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
          isPublished: false,
          isAvailableForPurchase: false,
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
    },
  );

  it(
    "should update product to not published",
    { tags: ["@products", "@allEnv", "@stable"] },
    () => {
      const productName = `${startsWith}${faker.datatype.number()}`;
      let product;

      productsUtils
        .createProductInChannel({
          name: productName,
          channelId: defaultChannel.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
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
    },
  );
});
