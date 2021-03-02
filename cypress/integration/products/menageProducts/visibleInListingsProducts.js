import faker from "faker";

import ProductSteps from "../../../steps/productSteps";
import { productDetailsUrl } from "../../../url/urlList";
import ChannelsUtils from "../../../utils/channelsUtils";
import ProductsUtils from "../../../utils/productsUtils";
import { isProductVisibleInSearchResult } from "../../../utils/storeFront/storeFrontProductUtils";

// <reference types="cypress" />
describe("Products displayed in listings", () => {
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
  it("should update product to visible in listings", () => {
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
          visibleInListings: false,
          isAvailableForPurchase: false
        });
      })
      .then(() => {
        const product = productsUtils.getCreatedProduct();
        const productUrl = productDetailsUrl(product.id);
        productSteps.updateProductVisibleInListings(productUrl);
        isProductVisibleInSearchResult(productName, defaultChannel.slug);
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
        productsUtils.createProductInChannel({
          name: productName,
          channelId: defaultChannel.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
          visibleInListings: true
        });
      })
      .then(() => {
        const product = productsUtils.getCreatedProduct();
        const productUrl = productDetailsUrl(product.id);
        productSteps.updateProductVisibleInListings(productUrl);
        isProductVisibleInSearchResult(productName, defaultChannel.slug).then(
          isProductVisible => {
            expect(isProductVisible).to.be.eq(false);
          }
        );
        cy.loginInShop();
      })
      .then(() => {
        isProductVisibleInSearchResult(productName, defaultChannel.slug);
      })
      .then(isProductVisible => {
        expect(isProductVisible).to.be.eq(true);
      });
  });
});
