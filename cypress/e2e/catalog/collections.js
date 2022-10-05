/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { collectionRow } from "../../elements/catalog/collection-selectors";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { collectionDetailsUrl, urlList } from "../../fixtures/urlList";
import { createChannel } from "../../support/api/requests/Channels";
import {
  addChannelToCollection,
  addProductToCollection,
  createCollection as createCollectionRequest,
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
  assignProductsToCollection,
  createCollection,
  removeProductsFromCollection,
  updateCollection,
} from "../../support/pages/catalog/collectionsPage";

describe("As an admin I want to manage collections.", () => {
  const startsWith = "CyCollections-";
  const productName = `${startsWith}${faker.datatype.number()}`;

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
        productsUtils.createTypeAttributeAndCategoryForProduct({
          name: productName,
        });
      })
      .then(
        ({
          attribute: attributeResp,
          productType: productTypeResp,
          category: categoryResp,
        }) => {
          attribute = attributeResp;
          productType = productTypeResp;
          category = categoryResp;
          productsUtils.createProductInChannel({
            name: productName,
            channelId: defaultChannel.id,
            productTypeId: productType.id,
            attributeId: attribute.id,
            categoryId: category.id,
          });
        },
      )
      .then(({ product: productResp }) => (product = productResp));
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should create hidden collection. TC: SALEOR_0301",
    { tags: ["@collection", "@allEnv", "@stable"] },
    () => {
      const collectionName = `${startsWith}${faker.datatype.number()}`;
      let collection;

      cy.visit(urlList.collections).expectSkeletonIsVisible();
      createCollection(collectionName, false, defaultChannel).then(
        collectionResp => {
          collection = collectionResp;

          assignProductsToCollection(productName);
          getCollection({
            collectionId: collection.id,
            channelSlug: defaultChannel.slug,
          })
            .its("collection.channelListings.0.isPublished")
            .should("eq", false);
        },
      );
    },
  );

  it(
    "should create published collection. TC: SALEOR_0302",
    { tags: ["@collection", "@allEnv", "@stable"] },
    () => {
      const collectionName = `${startsWith}${faker.datatype.number()}`;
      let collection;

      cy.visit(urlList.collections).expectSkeletonIsVisible();
      createCollection(collectionName, true, defaultChannel).then(
        collectionResp => {
          collection = collectionResp;

          assignProductsToCollection(productName);
          getCollection({
            collectionId: collection.id,
            channelSlug: defaultChannel.slug,
          })
            .its("collection.channelListings.0.isPublished")
            .should("eq", true);
        },
      );
    },
  );

  it(
    "should create collection not available for channel. TC: SALEOR_0303",
    { tags: ["@collection", "@allEnv", "@stable"] },
    () => {
      const collectionName = `${startsWith}${faker.datatype.number()}`;
      let collection;
      let channel;

      createChannel({ name: collectionName }).then(channelResp => {
        channel = channelResp;

        updateChannelInProduct(product.id, channel.id);
        cy.visit(urlList.collections).expectSkeletonIsVisible();
        createCollection(collectionName, false, channel).then(
          collectionResp => {
            collection = collectionResp;

            assignProductsToCollection(productName);
            getCollection({
              collectionId: collection.id,
              channelSlug: defaultChannel.slug,
            })
              .its("collection")
              .should("be.null");
          },
        );
      });
    },
  );

  it(
    "should create published collection with products hidden in listings. TC: SALEOR_0304",
    { tags: ["@collection", "@allEnv", "@stable"] },
    () => {
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
          visibleInListings: false,
        })
        .then(({ product: productResp }) => (createdProduct = productResp));

      cy.visit(urlList.collections).expectSkeletonIsVisible();
      createCollection(collectionName, true, defaultChannel).then(
        collectionResp => {
          collection = collectionResp;

          assignProductsToCollection(collectionName);
          getCollection({
            collectionId: collection.id,
            channelSlug: defaultChannel.slug,
          })
            .its("collection.products.edges.0.node.id")
            .should("eq", createdProduct.id);
          searchInShop(createdProduct.name)
            .its("body.data.products.edges")
            .should("be.empty");
        },
      );
    },
  );

  it(
    "should delete collection. TC: SALEOR_0305",
    { tags: ["@collection", "@allEnv", "@stable"] },
    () => {
      const collectionName = `${startsWith}${faker.datatype.number()}`;

      createCollectionRequest(collectionName).then(collectionResp => {
        cy.visit(collectionDetailsUrl(collectionResp.id))
          .get(BUTTON_SELECTORS.deleteButton)
          .click()
          .addAliasToGraphRequest("RemoveCollection")
          .get(BUTTON_SELECTORS.submit)
          .click()
          .waitForRequestAndCheckIfNoErrors("@RemoveCollection");
        getCollection({ collectionId: collectionResp.id })
          .its("collection")
          .should("be.null");
      });
    },
  );

  it(
    "should update collection. TC: SALEOR_0306",
    { tags: ["@collection", "@allEnv", "@stable"] },
    () => {
      const collectionName = `${startsWith}${faker.datatype.number()}`;
      const updatedName = `${startsWith}updatedCollection`;

      let collection;

      createCollectionRequest(collectionName).then(collectionResp => {
        collection = collectionResp;

        cy.visitAndWaitForProgressBarToDisappear(
          collectionDetailsUrl(collection.id),
        );
        addChannelToCollection({
          collectionId: collection.id,
          channelId: defaultChannel.id,
        });
        updateCollection({ name: updatedName, description: updatedName });
        getCollection({
          collectionId: collection.id,
          channelSlug: defaultChannel.slug,
        })
          .its("collection")
          .should("include", { name: updatedName })
          .its("description")
          .should("have.string", `{"text": "${updatedName}"}`);
      });
    },
  );

  it(
    "should assign product to collection. TC: SALEOR_0307",
    { tags: ["@collection", "@allEnv", "@stable"] },
    () => {
      const collectionName = `Assign-${startsWith}${faker.datatype.number()}`;
      const productName = `Product-To-Assign-${startsWith}${faker.datatype.number()}`;

      let collection;
      let productToAssign;

      createCollectionRequest(collectionName).then(collectionResp => {
        collection = collectionResp;

        addChannelToCollection({
          collectionId: collection.id,
          channelId: defaultChannel.id,
        });
        productsUtils
          .createProductInChannel({
            name: productName,
            channelId: defaultChannel.id,
            productTypeId: productType.id,
            attributeId: attribute.id,
            categoryId: category.id,
            visibleInListings: false,
          })
          .then(({ product: productResp }) => {
            productToAssign = productResp;

            cy.visitAndWaitForProgressBarToDisappear(
              collectionDetailsUrl(collection.id),
            );
            cy.reload();
            assignProductsToCollection(productToAssign.name);
            getCollection({
              collectionId: collection.id,
              channelSlug: defaultChannel.slug,
            })
              .its("collection.products.edges.0.node.id")
              .should("include", productToAssign.id);
          });
      });
    },
  );

  it(
    "should remove product from collection. TC: SALEOR_0308",
    { tags: ["@collection", "@allEnv", "@stable"] },
    () => {
      const collectionName = `Remove-With-Assigned-Product-${startsWith}${faker.datatype.number()}`;
      const productName = `Product-To-Assign-${startsWith}${faker.datatype.number()}`;
      let collection;
      let productToAssign;

      createCollectionRequest(collectionName).then(collectionResp => {
        collection = collectionResp;

        addChannelToCollection({
          collectionId: collection.id,
          channelId: defaultChannel.id,
        });
        productsUtils
          .createProductInChannel({
            name: productName,
            channelId: defaultChannel.id,
            productTypeId: productType.id,
            attributeId: attribute.id,
            categoryId: category.id,
            visibleInListings: false,
          })
          .then(({ product: productResp }) => {
            productToAssign = productResp;

            addProductToCollection({
              collectionId: collection.id,
              productId: productToAssign.id,
            });
            cy.visitAndWaitForProgressBarToDisappear(
              collectionDetailsUrl(collection.id),
            );
            getProductDetails(productToAssign.id, defaultChannel.slug)
              .its("body.data.product.collections")
              .should("have.length", 1);
            getCollection({
              collectionId: collection.id,
              channelSlug: defaultChannel.slug,
            })
              .its("collection.products.edges")
              .should("have.length", 1);
            removeProductsFromCollection(productToAssign.name);
            getCollection({
              collectionId: collection.id,
              channelSlug: defaultChannel.slug,
            })
              .its("collection.products.edges")
              .should("be.empty");
          });
      });
    },
  );

  it(
    "delete several collections on collections list page. TC: SALEOR_0309",
    { tags: ["@collection", "@allEnv", "@stable"] },
    () => {
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
        getCollection({ collectionId: firstCollection.id })
          .its("collection")
          .should("be.null");
        getCollection({ collectionId: secondCollection.id })
          .its("collection")
          .should("be.null");
      });
    },
  );
});
