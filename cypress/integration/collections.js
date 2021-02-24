// <reference types="cypress" />
import faker from "faker";

import Product from "../apiRequests/Product";
import CollectionsSteps from "../steps/collectionsSteps";
import { urlList } from "../url/urlList";
import ChannelsUtils from "../utils/channelsUtils";
import CollectionsUtils from "../utils/collectionsUtils";
import ProductsUtils from "../utils/productsUtils";
import ShippingUtils from "../utils/shippingUtils";
import StoreFrontCollectionUtils from "../utils/storeFront/collectionsUtils";
import StoreFrontProductUtils from "../utils/storeFront/storeFrontProductUtils";

describe("Collections", () => {
  const productRequest = new Product();
  const channelsUtils = new ChannelsUtils();
  const productsUtils = new ProductsUtils();
  const storeFrontProductUtils = new StoreFrontProductUtils();
  const collectionsUtils = new CollectionsUtils();
  const storeFrontCollectionUtils = new StoreFrontCollectionUtils();
  const shippingUtils = new ShippingUtils();
  const collectionsSteps = new CollectionsSteps();

  const startsWith = "Cy-";
  const name = `${startsWith}${faker.random.number()}`;

  let attribute;
  let productType;
  let category;

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
        attribute = productsUtils.getAttribute();
        productType = productsUtils.getProductType();
        category = productsUtils.getCategory();
        productsUtils.createProductInChannel({
          name,
          channelId: defaultChannel.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id
        });
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
        storeFrontCollectionUtils.isCollectionVisible(
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
        storeFrontCollectionUtils.isCollectionVisible(
          collection.id,
          defaultChannel.slug
        );
      })
      .then(isVisible => expect(isVisible).to.equal(true));
  });
  it("should not display unavailable in channel collections", () => {
    const collectionName = `${startsWith}${faker.random.number()}`;
    channelsUtils
      .createChannel({ name: collectionName })
      .then(() => {
        productRequest.updateChannelInProduct(
          productsUtils.getCreatedProduct().id,
          channelsUtils.getCreatedChannel().id
        );
      })
      .then(() => {
        cy.visit(urlList.collections);
        collectionsSteps.createCollection(
          collectionName,
          true,
          channelsUtils.getCreatedChannel()
        );
      })
      .then(collection => {
        collectionsSteps.assignProductsToCollection(name);
        storeFrontCollectionUtils.isCollectionVisible(
          collection.id,
          defaultChannel.slug
        );
      })
      .then(isVisible => expect(isVisible).to.equal(false));
  });
  it("should display products hidden in listing, only in collection", () => {
    const randomName = `${startsWith}${faker.random.number()}`;
    const hiddenProductUtils = new ProductsUtils();
    hiddenProductUtils.createProductInChannel({
      name: randomName,
      channelId: defaultChannel.id,
      productTypeId: productType.id,
      attributeId: attribute.id,
      categoryId: category.id,
      visibleInListings: false
    });
    cy.visit(urlList.collections);
    collectionsSteps
      .createCollection(randomName, true, defaultChannel)
      .then(collection => {
        collectionsSteps.assignProductsToCollection(randomName);
        storeFrontCollectionUtils.isProductInCollectionVisible(
          collection.id,
          defaultChannel.slug,
          hiddenProductUtils.getCreatedProduct().id
        );
      })
      .then(isVisible => {
        expect(isVisible).to.equal(true);
        storeFrontProductUtils.isProductVisibleInSearchResult(
          hiddenProductUtils.getCreatedProduct().name,
          defaultChannel.slug
        );
      })
      .then(isVisible => {
        expect(isVisible).to.equal(false);
      });
  });
});
