/// <reference types="cypress"/>
/// <reference types="../../../support"/>
import faker from "faker";

import { productDetailsUrl } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import {
  expectProductVisibleInShop,
  searchInShop,
} from "../../../support/api/requests/storeFront/Search";
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
    cy.loginUserViaRequest();
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
        cy.checkIfDataAreNotNull({
          productType,
          attribute,
          category,
          defaultChannel,
        });
      });
  });

  beforeEach(() => {
    cy.loginUserViaRequest("auth", ONE_PERMISSION_USERS.product);
  });

  it(
    "should update product to be visible in listings. TC: SALEOR_2505",
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
          cy.visit(productUrl);
          updateProductVisibleInListings();
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
    "should update product to not be visible in listings. TC: SALEOR_2506",
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
          cy.visit(productUrl);
          updateProductVisibleInListings();

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
          expectProductVisibleInShop(productName);
        });
    },
  );
});
