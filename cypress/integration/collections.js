// <reference types="cypress" />
import faker from "faker";

import Product from "../apiRequests/Product";
import CollectionsSteps from "../steps/collectionsSteps";
import { urlList } from "../url/urlList";
import ChannelsUtils from "../utils/channelsUtils";
import CollectionsUtils from "../utils/collectionsUtils";
import ProductsUtils from "../utils/productsUtils";
import ShippingUtils from "../utils/shippingUtils";
import {
  isCollectionVisible,
  isProductInCollectionVisible
} from "../utils/storeFront/collectionsUtils";
import { isProductVisibleInSearchResult } from "../utils/storeFront/storeFrontProductUtils";

describe("Collections", () => {
  const productRequest = new Product();
  const channelsUtils = new ChannelsUtils();
  const productsUtils = new ProductsUtils();
  const collectionsUtils = new CollectionsUtils();
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
    let collection;

    collectionsSteps
      .createCollection(collectionName, false, defaultChannel)
      .then(collectionResp => {
        collection = collectionResp;
        collectionsSteps.assignProductsToCollection(name);
      })
      .then(() => {
        isCollectionVisible(collection.id, defaultChannel.slug);
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
        isCollectionVisible(collection.id, defaultChannel.slug);
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
        isCollectionVisible(collection.id, defaultChannel.slug);
      })
      .then(isVisible => expect(isVisible).to.equal(false));
  });
  it("should display products hidden in listing, only in collection", () => {
    const randomName = `${startsWith}${faker.random.number()}`;
    const hiddenProductUtils = new ProductsUtils();
    let collection;

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
      .then(collectionResp => {
        collection = collectionResp;
        collectionsSteps.assignProductsToCollection(randomName);
      })
      .then(() => {
        isProductInCollectionVisible(
          collection.id,
          defaultChannel.slug,
          hiddenProductUtils.getCreatedProduct().id
        );
      })
      .then(isVisible => {
        expect(isVisible).to.equal(true);
        isProductVisibleInSearchResult(
          hiddenProductUtils.getCreatedProduct().name,
          defaultChannel.slug
        );
      })
      .then(isVisible => {
        expect(isVisible).to.equal(false);
      });
  });
});
