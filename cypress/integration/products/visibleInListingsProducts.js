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
  let productType;
  let attribute;
  let category;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProperProducts(startsWith);
    productsUtils.createTypeAttributeAndCategoryForProduct(name).then(() => {
      productType = productsUtils.getProductType();
      attribute = productsUtils.getAttribute();
      category = productsUtils.getCategory();
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
          productType.id,
          attribute.id,
          category.id,
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
          productType.id,
          attribute.id,
          category.id,
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
