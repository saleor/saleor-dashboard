// <reference types="cypress" />
import faker from "faker";

import Product from "../apiRequests/Product";
import CollectionsSteps from "../steps/collectionsSteps";
import { urlList } from "../url/urlList";
import ChannelsUtils from "../utils/channelsUtils";
import CollectionsUtils from "../utils/collectionsUtils";
import ProductsUtils from "../utils/productsUtils";
import ShippingUtils from "../utils/shippingUtils";

describe("Collections", () => {
  const productRequest = new Product();
  const channelsUtils = new ChannelsUtils();
  const productsUtils = new ProductsUtils();
  const collectionsUtils = new CollectionsUtils();
  const shippingUtils = new ShippingUtils();
  const collectionsSteps = new CollectionsSteps();

  const startsWith = "Cy-";
  const name = `${startsWith}${faker.random.number()}`;

  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProperProducts(startsWith);
    collectionsUtils.deleteProperCollections(startsWith);
    shippingUtils.deleteShipping(startsWith);

    channelsUtils
      .getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        productsUtils.createTypeAttributeAndCategoryForProduct(name);
      })
      .then(() => {
        const attribute = productsUtils.getAttribute();
        const productType = productsUtils.getProductType();
        const category = productsUtils.getCategory();
        productsUtils.createProductInChannel(
          name,
          defaultChannel.id,
          null,
          null,
          productType.id,
          attribute.id,
          category.id,
          1
        );
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should not display hidden collections", () => {
    const collectionName = `${startsWith}${faker.random.number()}`;
    cy.visit(urlList.collections);

    collectionsSteps
      .createCollection(collectionName, false, defaultChannel)
      .then(collection => {
        collectionsSteps.assignProductsToCollection(name);
        collectionsUtils.isCollectionVisible(
          collection.id,
          defaultChannel.slug
        );
      })
      .then(isVisible => expect(isVisible).to.equal(false));
  });

  it("should display collections", () => {
    const collectionName = `${startsWith}${faker.random.number()}`;
    cy.visit(urlList.collections);

    collectionsSteps
      .createCollection(collectionName, true, defaultChannel)
      .then(collection => {
        collectionsSteps.assignProductsToCollection(name);
        collectionsUtils.isCollectionVisible(
          collection.id,
          defaultChannel.slug
        );
      })
      .then(isVisible => expect(isVisible).to.equal(true));
  });
  xit("should not display unavailable in channel collections", () => {
    channelsUtils.createChannel(true, name, name, "PLN").then(() => {
      productRequest.updateChannelInProduct(
        productsUtils.getCreatedProduct().id,
        channelsUtils.getCreatedChannel().id
      );
    });
    cy.visit(urlList.collections);
    collectionsSteps
      .createCollection(collectionName, true, channelsUtils.getCreatedChannel())
      .then(collection => {
        collectionsSteps.assignProductsToCollection(name);
        collectionsUtils.isCollectionVisible(
          collection.id,
          defaultChannel.slug
        );
      })
      .then(isVisible => expect(isVisible).to.equal(true));
  });
  xit("should display products hidden in listing, only in collection", () => {
    productsUtils.createProductInChannel(
      name,
      defaultChannel.id,
      null,
      null,
      productsUtils.getProductType().id,
      productsUtils.getAttribute().id,
      productsUtils.getCategory().id,
      1
    );
    collectionsSteps
      .createCollection(collectionName, true, defaultChannel)
      .then(collection => {
        collectionsSteps.assignProductsToCollection(name);
        collectionsUtils.isProductInCollectionVisible(
          collection.id,
          defaultChannel.slug
        );
      })
      .then(isVisible => {
        expect(isVisible).to.equal(true);
        // productsUtils.searchForProduct
      });
  });
});
