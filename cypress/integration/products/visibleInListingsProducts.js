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
    let defaultChannel;
    channelsUtils
      .getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        productsUtils.createProductInChannel(
          productName,
          defaultChannel.id,
          null,
          null,
          productType.id,
          attribute.id,
          category.id,
          1,
          true,
          false,
          false
        );
      })
      .then(() => {
        const product = productsUtils.getCreatedProduct();
        const productUrl = `${URL_LIST.products}${product.id}`;
        productSteps.updateProductVisibleInListings(productUrl);
        frontShopProductUtils.isProductVisibleInSearchResult(
          productName,
          defaultChannel.slug
        );
      })
      .then(isProductVisible => {
        expect(isProductVisible).to.be.eq(true);
      });
  });
  it("should update product to not visible in listings", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    let defaultChannel;
    channelsUtils
      .getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        productsUtils.createProductInChannel(
          productName,
          defaultChannel.id,
          null,
          null,
          productType.id,
          attribute.id,
          category.id,
          1,
          true,
          false,
          true
        );
      })
      .then(() => {
        const product = productsUtils.getCreatedProduct();
        const productUrl = `${URL_LIST.products}${product.id}`;
        productSteps.updateProductVisibleInListings(productUrl);
        frontShopProductUtils
          .isProductVisibleInSearchResult(productName, defaultChannel.slug)
          .then(isProductVisible => {
            expect(isProductVisible).to.be.eq(false);
          });
        cy.loginInShop();
      })
      .then(() => {
        frontShopProductUtils.isProductVisibleInSearchResult(
          productName,
          defaultChannel.slug
        );
      })
      .then(isProductVisible => {
        expect(isProductVisible).to.be.eq(true);
      });
  });
});
