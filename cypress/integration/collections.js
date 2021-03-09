// <reference types="cypress" />
import faker from "faker";

import { updateChannelInProduct } from "../apiRequests/Product";
import { getCollection } from "../apiRequests/storeFront/Collections";
import { searchInShop } from "../apiRequests/storeFront/Search";
import {
  assignProductsToCollection,
  createCollection
} from "../steps/collectionsSteps";
import { urlList } from "../url/urlList";
import * as channelsUtils from "../utils/channelsUtils";
import { deleteProperCollections } from "../utils/collectionsUtils";
import * as productsUtils from "../utils/productsUtils";
import { deleteShipping } from "../utils/shippingUtils";
import {
  isCollectionVisible,
  isProductInCollectionVisible
} from "../utils/storeFront/collectionsUtils";
import { isProductVisibleInSearchResult } from "../utils/storeFront/storeFrontProductUtils";

describe("Collections", () => {
  const startsWith = "Cy-";
  const name = `${startsWith}${faker.random.number()}`;

  let attribute;
  let productType;
  let category;

  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProperProducts(startsWith);
    deleteProperCollections(startsWith);
    deleteShipping(startsWith);

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

    createCollection(collectionName, false, defaultChannel)
      .then(collectionResp => {
        collection = collectionResp;
        assignProductsToCollection(name);
      })
      .then(() => {
        getCollection(collection.id, defaultChannel.slug);
      })
      .then(resp => {
        const isVisible = isCollectionVisible(resp, collection.id);
        expect(isVisible).to.equal(false);
      });
  });

  it("should display collections", () => {
    const collectionName = `${startsWith}${faker.random.number()}`;
    let collection;
    cy.visit(urlList.collections);

    createCollection(collectionName, true, defaultChannel)
      .then(collectionResp => {
        collection = collectionResp;
        assignProductsToCollection(name);
        getCollection(collection.id, defaultChannel.slug);
      })
      .then(resp => {
        const isVisible = isCollectionVisible(resp, collection.id);
        expect(isVisible).to.equal(true);
      });
  });
  it("should not display collection not set as available in channel", () => {
    const collectionName = `${startsWith}${faker.random.number()}`;
    let collection;

    channelsUtils
      .createChannel({ name: collectionName })
      .then(() => {
        updateChannelInProduct(
          productsUtils.getCreatedProduct().id,
          channelsUtils.getCreatedChannel().id
        );
      })
      .then(() => {
        cy.visit(urlList.collections);
        createCollection(
          collectionName,
          true,
          channelsUtils.getCreatedChannel()
        );
      })
      .then(collectionResp => {
        collection = collectionResp;
        assignProductsToCollection(name);
        getCollection(collection.id, defaultChannel.slug);
      })
      .then(resp => {
        const isVisible = isCollectionVisible(resp, collection.id);
        expect(isVisible).to.equal(false);
      });
  });
  it("should display products hidden in listing", () => {
    // Products "hidden in listings" are not displayed in Category listings or search results,
    // but are listed on Collections
    const randomName = `${startsWith}${faker.random.number()}`;
    let collection;

    productsUtils.createProductInChannel({
      name: randomName,
      channelId: defaultChannel.id,
      productTypeId: productType.id,
      attributeId: attribute.id,
      categoryId: category.id,
      visibleInListings: false
    });
    cy.visit(urlList.collections);
    createCollection(randomName, true, defaultChannel)
      .then(collectionResp => {
        collection = collectionResp;
        assignProductsToCollection(randomName);
      })
      .then(() => {
        getCollection(collection.id, defaultChannel.slug);
      })
      .then(resp => {
        const isVisible = isProductInCollectionVisible(
          resp,
          productsUtils.getCreatedProduct().id
        );
        expect(isVisible).to.equal(true);
      })
      .then(() => {
        searchInShop(productsUtils.getCreatedProduct().name);
      })
      .then(resp => {
        const isVisible = isProductVisibleInSearchResult(
          resp,
          productsUtils.getCreatedProduct().name
        );
        expect(isVisible).to.equal(false);
      });
  });
});
