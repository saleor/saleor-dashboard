/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { urlList } from "../../fixtures/urlList";
import { createChannel } from "../../support/api/requests/Channels";
import { updateChannelInProduct } from "../../support/api/requests/Product";
import { getCollection } from "../../support/api/requests/storeFront/Collections";
import { searchInShop } from "../../support/api/requests/storeFront/Search";
import { deleteCollectionsStartsWith } from "../../support/api/utils/catalog/collectionsUtils";
import * as channelsUtils from "../../support/api/utils/channelsUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../support/api/utils/shippingUtils";
import {
  isCollectionVisible,
  isProductInCollectionVisible
} from "../../support/api/utils/storeFront/collectionsUtils";
import { isProductVisibleInSearchResult } from "../../support/api/utils/storeFront/storeFrontProductUtils";
import filterTests from "../../support/filterTests";
import {
  assignProductsToCollection,
  createCollection
} from "../../support/pages/catalog/collectionsPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Collections", () => {
    const startsWith = "CyCollections-";
    const name = `${startsWith}${faker.datatype.number()}`;

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
      channelsUtils.deleteChannelsStartsWith(startsWith);

      channelsUtils
        .getDefaultChannel()
        .then(channel => {
          defaultChannel = channel;
          productsUtils.createTypeAttributeAndCategoryForProduct({ name });
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
      const collectionName = `${startsWith}${faker.datatype.number()}`;
      cy.visit(urlList.collections);
      cy.softExpectSkeletonIsVisible();
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
      const collectionName = `${startsWith}${faker.datatype.number()}`;
      let collection;
      cy.visit(urlList.collections);
      cy.softExpectSkeletonIsVisible();

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
      const collectionName = `${startsWith}${faker.datatype.number()}`;
      let collection;
      let channel;

      createChannel({ name: collectionName })
        .then(channelResp => {
          channel = channelResp;
          updateChannelInProduct(product.id, channel.id);
        })
        .then(() => {
          cy.visit(urlList.collections);
          cy.softExpectSkeletonIsVisible();
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
      const randomName = `${startsWith}${faker.datatype.number()}`;
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
      cy.softExpectSkeletonIsVisible();
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
            createdProduct.id
          );
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
});
