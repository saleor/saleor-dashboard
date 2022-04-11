/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { collectionRow } from "../../elements/catalog/collection-selectors";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { collectionDetailsUrl, urlList } from "../../fixtures/urlList";
import { createChannel } from "../../support/api/requests/Channels";
import {
  addProductToCollection,
  createCollection as createCollectionRequest
} from "../../support/api/requests/Collections";
import { updateChannelInProduct } from "../../support/api/requests/Product";
import { getCollection } from "../../support/api/requests/storeFront/Collections";
import { getProductDetails } from "../../support/api/requests/storeFront/ProductDetails";
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
  createCollection,
  removeProductsFromCollection,
  updateCollection
} from "../../support/pages/catalog/collectionsPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("As an admin I want to manage collections.", () => {
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

    it("should create hidden collection. TC: SALEOR_0301", () => {
      const collectionName = `${startsWith}${faker.datatype.number()}`;
      let collection;

      cy.visit(urlList.collections);
      cy.softExpectSkeletonIsVisible();

      createCollection(collectionName, false, defaultChannel)
        .then(collectionResp => {
          collection = collectionResp;
          assignProductsToCollection(name);
        })
        .then(() => {
          getCollection({
            collectionId: collection.id,
            channelSlug: defaultChannel.slug
          });
        })
        .then(({ collection: resp }) => {
          const isVisible = isCollectionVisible(resp, collection.id);
          expect(isVisible).to.equal(false);
        });
    });

    it("should create published collection. TC: SALEOR_0302", () => {
      const collectionName = `${startsWith}${faker.datatype.number()}`;
      let collection;

      cy.visit(urlList.collections);
      cy.softExpectSkeletonIsVisible();

      createCollection(collectionName, true, defaultChannel)
        .then(collectionResp => {
          collection = collectionResp;
          assignProductsToCollection(name);
          getCollection({
            collectionId: collection.id,
            channelSlug: defaultChannel.slug
          });
        })
        .then(({ collection: resp }) => {
          const isVisible = isCollectionVisible(resp, collection.id);
          expect(isVisible).to.equal(true);
        });
    });

    it("create collection not available for channel. TC: SALEOR_0303", () => {
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
          getCollection({
            collectionId: collection.id,
            channelSlug: defaultChannel.slug
          });
        })
        .then(({ collection: resp }) => {
          const isVisible = isCollectionVisible(resp, collection.id);
          expect(isVisible).to.equal(false);
        });
    });

    it("create published collection with products hidden in listings. TC: SALEOR_0304", () => {
      // Products "hidden in listings" are not displayed in Category listings or search results,
      // but are listed on Collections
      const collectionName = `${startsWith}${faker.datatype.number()}`;
      let collection;
      let createdProduct;

      productsUtils
        .createProductInChannel({
          name: collectionName,
          channelId: defaultChannel.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
          visibleInListings: false
        })
        .then(({ product: productResp }) => (createdProduct = productResp));
      cy.visit(urlList.collections);
      cy.softExpectSkeletonIsVisible();
      createCollection(collectionName, true, defaultChannel)
        .then(collectionResp => {
          collection = collectionResp;
          assignProductsToCollection(collectionName);
        })
        .then(() => {
          getCollection({
            collectionId: collection.id,
            channelSlug: defaultChannel.slug
          });
        })
        .then(({ collection: resp }) => {
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

    it("should delete collection. TC: SALEOR_0305", () => {
      const collectionName = `${startsWith}${faker.datatype.number()}`;

      createCollectionRequest(collectionName).then(collectionResp => {
        cy.visit(collectionDetailsUrl(collectionResp.id))
          .get(BUTTON_SELECTORS.deleteButton)
          .click()
          .addAliasToGraphRequest("RemoveCollection")
          .get(BUTTON_SELECTORS.submit)
          .click()
          .waitForRequestAndCheckIfNoErrors("@RemoveCollection");
        getCollection({ collectionId: collectionResp.id, auth: "auth" })
          .its("collection")
          .should("be.null");
      });
    });

    it("delete several collections on collections list page. TC: SALEOR_0309", () => {
      const deleteSeveral = "delete-several-";
      const firstCollectionName = `${deleteSeveral}${startsWith}${faker.datatype.number()}`;
      const secondCollectionName = `${deleteSeveral}${startsWith}${faker.datatype.number()}`;
      let firstCollection;
      let secondCollection;

      createCollectionRequest(firstCollectionName).then(collectionResp => {
        firstCollection = collectionResp;
      });

      createCollectionRequest(secondCollectionName).then(collectionResp => {
        secondCollection = collectionResp;
        cy.visit(urlList.collections)
          .searchInTable(deleteSeveral)
          .get(collectionRow(firstCollection.id))
          .find(BUTTON_SELECTORS.checkbox)
          .click()
          .get(collectionRow(secondCollection.id))
          .find(BUTTON_SELECTORS.checkbox)
          .click()
          .get(BUTTON_SELECTORS.deleteIcon)
          .click()
          .addAliasToGraphRequest("CollectionBulkDelete")
          .get(BUTTON_SELECTORS.submit)
          .click()
          .waitForRequestAndCheckIfNoErrors("@CollectionBulkDelete");

        getCollection({ collectionId: firstCollection.id, auth: "auth" })
          .its("collection")
          .should("be.null");
        getCollection({ collectionId: secondCollection.id, auth: "auth" })
          .its("collection")
          .should("be.null");
      });
    });

    it("assign product to collection. TC: SALEOR_0307", () => {
      cy.log("przed tworzeniem imion");
      const collectionName = `Assign-${startsWith}${faker.datatype.number()}`;
      const productName = `Product-To-Assign-${startsWith}${faker.datatype.number()}`;

      let collection;
      let productToAssign;
      cy.log("before request");

      createCollectionRequest(collectionName).then(collectionResp => {
        collection = collectionResp;

        productsUtils
          .createProductInChannel({
            name: productName,
            channelId: defaultChannel.id,
            productTypeId: productType.id,
            attributeId: attribute.id,
            categoryId: category.id,
            visibleInListings: false
          })
          .then(({ product: productResp }) => {
            productToAssign = productResp;

            cy.visit(collectionDetailsUrl(collection.id));
            assignProductsToCollection(productToAssign.name);

            getCollection({ collectionId: collection.id, auth: "auth" })
              .its("collection.products.edges")
              .should("have.length", 1)
              .then(productArray => {
                expect(productArray[0].node.id).to.equal(productToAssign.id);
              });
          });
      });
    });

    it("remove product from collection. TC: SALEOR_0308", () => {
      const collectionName = `Remove-With-Assigned-Product-${startsWith}${faker.datatype.number()}`;
      const productName = `Product-To-Assign-${startsWith}${faker.datatype.number()}`;
      let collection;
      let productToAssign;

      createCollectionRequest(collectionName).then(collectionResp => {
        collection = collectionResp;

        productsUtils
          .createProductInChannel({
            name: productName,
            channelId: defaultChannel.id,
            productTypeId: productType.id,
            attributeId: attribute.id,
            categoryId: category.id,
            visibleInListings: false
          })
          .then(({ product: productResp }) => {
            productToAssign = productResp;

            cy.visit(collectionDetailsUrl(collection.id));

            addProductToCollection({
              collectionId: collection.id,
              productId: productToAssign.id
            });

            getProductDetails(productToAssign.id, defaultChannel.slug, "auth")
              .its("body.data.product.collections")
              .should("have.length", 1);

            getCollection({ collectionId: collection.id, auth: "auth" })
              .its("collection.products.edges")
              .should("have.length", 1);

            removeProductsFromCollection(productToAssign.name);

            getCollection({ collectionId: collection.id, auth: "auth" })
              .its("collection.products.edges")
              .should("be.empty");
          });
      });
    });

    it("should update collection. TC: SALEOR_0306", () => {
      const collectionName = `${startsWith}${faker.datatype.number()}`;
      const updatedName = `${startsWith}updatedCollection`;

      createCollectionRequest(collectionName)
        .then(collectionResp => {
          cy.visitAndWaitForProgressBarToDisappear(
            collectionDetailsUrl(collectionResp.id)
          );
          updateCollection({ name: updatedName, description: updatedName });
          getCollection({ collectionId: collectionResp.id, auth: "auth" });
        })
        .then(({ collection: collectionResp }) => {
          expect(collectionResp.name).to.eq(updatedName);
          const descriptionJson = JSON.parse(collectionResp.description);
          const descriptionText = descriptionJson.blocks[0].data.text;
          expect(descriptionText).to.eq(updatedName);
        });
    });
  });
});
