import faker from "faker";

import ProductSteps from "../../steps/productSteps";
import { URL_LIST } from "../../url/url-list";
import ChannelsUtils from "../../utils/channelsUtils";
import FrontShopProductUtils from "../../utils/frontShop/frontShopProductUtils";
import ProductsUtils from "../../utils/productsUtils";

// <reference types="cypress" />
describe("Products displayed in listings", () => {
  const channelsUtils = new ChannelsUtils();
  const productsUtils = new ProductsUtils();
  const productSteps = new ProductSteps();
  const frontShopProductUtils = new FrontShopProductUtils();

  const startsWith = "Cy-";
  const name = `${startsWith}${faker.random.number()}`;
  let productTypeId;
  let attributeId;
  let categoryId;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProducts(startsWith);
    productsUtils.createTypeAttributeAndCategoryForProduct(name).then(() => {
      productTypeId = productsUtils.getProductTypeId();
      attributeId = productsUtils.getAttributeId();
      categoryId = productsUtils.getCategoryId();
    });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });
  it("should update product to visible in listings", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    channelsUtils.getDefaultChannel().then(defaultChannel => {
      productsUtils
        .createProductInChannel(
          productName,
          productTypeId,
          attributeId,
          categoryId,
          defaultChannel.id,
          true,
          false,
          false
        )
        .then(() => {
          const productId = productsUtils.getCreatedProductId();
          const productUrl = `${URL_LIST.products}${productId}`;
          productSteps.updateProductVisibleInListings(productUrl);
          frontShopProductUtils
            .isProductVisibleInSearchResult(productName, defaultChannel.slug)
            .then(isProductVisible => {
              expect(isProductVisible).to.be.eq(true);
            });
        });
    });
  });
  it("should update product to not visible in listings", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    channelsUtils.getDefaultChannel().then(defaultChannel => {
      productsUtils
        .createProductInChannel(
          productName,
          productTypeId,
          attributeId,
          categoryId,
          defaultChannel.id,
          true,
          false,
          true
        )
        .then(() => {
          const productId = productsUtils.getCreatedProductId();
          const productUrl = `${URL_LIST.products}${productId}`;
          productSteps.updateProductVisibleInListings(productUrl);
          frontShopProductUtils
            .isProductVisibleInSearchResult(productName, defaultChannel.slug)
            .then(isProductVisible => {
              expect(isProductVisible).to.be.eq(false);
            });
          cy.loginInShop().then(() => {
            frontShopProductUtils
              .isProductVisibleInSearchResult(productName, defaultChannel.slug)
              .then(isProductVisible => {
                expect(isProductVisible).to.be.eq(true);
              });
          });
        });
    });
  });
});
