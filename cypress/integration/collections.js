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
import { deleteCollectionsStartsWith } from "../utils/collectionsUtils";
import * as productsUtils from "../utils/productsUtils";
import { deleteShippingStartsWith } from "../utils/shippingUtils";
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
  let product;

  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProductsStartsWith(startsWith);
    deleteCollectionsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);

    channelsUtils
      .getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        productsUtils.createTypeAttributeAndCategoryForProduct(name);
      })
      .then(
        ({
          attribute: attributeResp,
          productType: productTypeResp,
          category: categoryResp
        }) => {
          attribute = attributeResp;
          productType = productTypeResp;
          category = categoryResp;
          productsUtils.createProductInChannel({
            name,
            channelId: defaultChannel.id,
            productTypeId: productType.id,
            attributeId: attribute.id,
            categoryId: category.id
          });
        }
      )
      .then(({ product: productResp }) => (product = productResp));
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
    let channel;

    channelsUtils
      .createChannel({ name: collectionName })
      .then(channelResp => {
        channel = channelResp;
        updateChannelInProduct(product.id, channel.id);
      })
      .then(() => {
        cy.visit(urlList.collections);
        createCollection(collectionName, true, channel);
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
    let createdProduct;

    productsUtils
      .createProductInChannel({
        name: randomName,
        channelId: defaultChannel.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        visibleInListings: false
      })
      .then(({ product: productResp }) => (createdProduct = productResp));
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
        const isVisible = isProductInCollectionVisible(resp, createdProduct.id);
        expect(isVisible).to.equal(true);
      })
      .then(() => {
        searchInShop(createdProduct.name);
      })
      .then(resp => {
        const isVisible = isProductVisibleInSearchResult(
          resp,
          createdProduct.name
        );
        expect(isVisible).to.equal(false);
      });
  });
});
