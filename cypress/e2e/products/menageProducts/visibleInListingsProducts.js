/// <reference types="cypress"/>
/// <reference types="../../../support"/>
import faker from "faker";

import { productDetailsUrl } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { searchInShop } from "../../../support/api/requests/storeFront/Search";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import { isProductVisibleInSearchResult } from "../../../support/api/utils/storeFront/storeFrontProductUtils";
import { updateProductVisibleInListings } from "../../../support/pages/catalog/products/productDetailsPage";

describe("Products displayed in listings", () => {
  const startsWith = "CyVisibleInListings-";
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
    "should update product to visible in listings",
    { tags: ["@products", "@allEnv"] },
    () => {
      const productName = `${startsWith}${faker.datatype.number()}`;

      productsUtils
        .createProductInChannel({
          name: productName,
          channelId: defaultChannel.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
          visibleInListings: false,
          isAvailableForPurchase: false,
        })
        .then(({ product: productResp }) => {
          const product = productResp;
          const productUrl = productDetailsUrl(product.id);
          updateProductVisibleInListings(productUrl);
          searchInShop(productName);
        })
        .then(resp => {
          const isProductVisible = isProductVisibleInSearchResult(
            resp,
            productName,
          );
          expect(isProductVisible).to.be.eq(true);
        });
    },
  );

  it(
    "should update product to not visible in listings",
    { tags: ["@products", "@allEnv"] },
    () => {
      const productName = `${startsWith}${faker.datatype.number()}`;

      productsUtils
        .createProductInChannel({
          name: productName,
          channelId: defaultChannel.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
          visibleInListings: true,
        })
        .then(({ product: productResp }) => {
          const product = productResp;
          const productUrl = productDetailsUrl(product.id);
          updateProductVisibleInListings(productUrl);

          searchInShop(productName).then(resp => {
            const isProductVisible = isProductVisibleInSearchResult(
              resp,
              productName,
            );
            expect(isProductVisible).to.be.eq(false);
          });
          cy.loginInShop();
        })
        .then(() => {
          searchInShop(productName);
        })
        .then(resp => {
          const isProductVisible = isProductVisibleInSearchResult(
            resp,
            productName,
          );
          expect(isProductVisible).to.be.eq(true);
        });
    },
  );
});
