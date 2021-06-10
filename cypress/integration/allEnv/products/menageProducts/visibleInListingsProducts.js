import faker from "faker";

import { searchInShop } from "../../../../apiRequests/storeFront/Search";
import { ONE_PERMISSION_USERS } from "../../../../Data/users";
import { updateProductVisibleInListings } from "../../../../steps/catalog/products/productSteps";
import { productDetailsUrl } from "../../../../url/urlList";
import { getDefaultChannel } from "../../../../utils/channelsUtils";
import * as productsUtils from "../../../../utils/products/productsUtils";
import { isProductVisibleInSearchResult } from "../../../../utils/storeFront/storeFrontProductUtils";

// <reference types="cypress" />
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
          getDefaultChannel();
        }
      )
      .then(channel => {
        defaultChannel = channel;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest(
      "auth",
      ONE_PERMISSION_USERS.product
    );
  });

  it("should update product to visible in listings", () => {
    const productName = `${startsWith}${faker.datatype.number()}`;

    productsUtils
      .createProductInChannel({
        name: productName,
        channelId: defaultChannel.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        visibleInListings: false,
        isAvailableForPurchase: false
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
          productName
        );
        expect(isProductVisible).to.be.eq(true);
      });
  });

  it("should update product to not visible in listings", () => {
    const productName = `${startsWith}${faker.datatype.number()}`;

    productsUtils
      .createProductInChannel({
        name: productName,
        channelId: defaultChannel.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        visibleInListings: true
      })
      .then(({ product: productResp }) => {
        const product = productResp;
        const productUrl = productDetailsUrl(product.id);
        updateProductVisibleInListings(productUrl);

        searchInShop(productName).then(resp => {
          const isProductVisible = isProductVisibleInSearchResult(
            resp,
            productName
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
          productName
        );
        expect(isProductVisible).to.be.eq(true);
      });
  });
});
