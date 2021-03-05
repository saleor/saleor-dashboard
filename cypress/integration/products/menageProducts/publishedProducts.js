import faker from "faker";

import ProductDetails from "../../../apiRequests/storeFront/ProductDetails";
import ProductSteps from "../../../steps/products/productSteps";
import { productDetailsUrl } from "../../../url/urlList";
import ChannelsUtils from "../../../utils/channelsUtils";
import ProductsUtils from "../../../utils/productsUtils";
import { isProductVisible } from "../../../utils/storeFront/storeFrontProductUtils";

// <reference types="cypress" />
describe("Published products", () => {
  const productDetails = new ProductDetails();
  const channelsUtils = new ChannelsUtils();
  const productsUtils = new ProductsUtils();
  const productSteps = new ProductSteps();

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
      .then(() => {
        const product = productsUtils.getCreatedProduct();
        const productUrl = productDetailsUrl(product.id);
        productSteps.updateProductPublish(productUrl, true);
        productDetails.getProductDetails(product.id, defaultChannel.slug);
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

    channelsUtils
      .getDefaultChannel()
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
      .then(() => {
        product = productsUtils.getCreatedProduct();
        const productUrl = productDetailsUrl(product.id);
        productSteps.updateProductPublish(productUrl, false);
        productDetails.getProductDetails(product.id, defaultChannel.slug);
      })
      .then(resp => {
        const isVisible = isProductVisible(resp, productName);
        expect(isVisible).to.be.eq(false);
        cy.loginInShop();
      })
      .then(() => {
        productDetails.getProductDetails(product.id, defaultChannel.slug);
      })
      .then(resp => {
        const isVisible = isProductVisible(resp, productName);
        expect(isVisible).to.be.eq(true);
      });
  });
});
