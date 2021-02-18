import faker from "faker";

import ProductSteps from "../../steps/productSteps";
import { urlList } from "../../url/urlList";
import ChannelsUtils from "../../utils/channelsUtils";
import FrontShopProductUtils from "../../utils/frontShop/frontShopProductUtils";
import ProductsUtils from "../../utils/productsUtils";

// <reference types="cypress" />
describe("Published products", () => {
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
  it("should update product to published", () => {
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
          false,
          false,
          true
        );
      })
      .then(() => {
        const product = productsUtils.getCreatedProduct();
        const productUrl = `${urlList.products}${product.id}`;
        productSteps.updateProductPublish(productUrl, true);
        frontShopProductUtils.isProductVisible(
          product.id,
          defaultChannel.slug,
          productName
        );
      })
      .then(isVisible => {
        expect(isVisible).to.be.eq(true);
      });
  });
  it("should update product to not published", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    let defaultChannel;
    let product;

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
          category.id
        );
      })
      .then(() => {
        product = productsUtils.getCreatedProduct();
        const productUrl = `${urlList.products}${product.id}`;
        productSteps.updateProductPublish(productUrl, false);
        frontShopProductUtils.isProductVisible(
          product.id,
          defaultChannel.slug,
          productName
        );
      })
      .then(isVisible => {
        expect(isVisible).to.be.eq(false);
        cy.loginInShop();
      })
      .then(() => {
        frontShopProductUtils.isProductVisible(
          product.id,
          defaultChannel.slug,
          productName
        );
      })
      .then(isVisible => {
        expect(isVisible).to.be.eq(true);
      });
  });
});
