/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { PRODUCT_DETAILS } from "../../elements/catalog/products/product-details";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { productDetailsUrl } from "../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../fixtures/users";
import { createCategory } from "../../support/api/requests/Category";
import { createCollection } from "../../support/api/requests/Collections";
import { getProductDetails } from "../../support/api/requests/storeFront/ProductDetails";
import { deleteCollectionsStartsWith } from "../../support/api/utils/catalog/collectionsUtils";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import { expectCorrectProductInformation } from "../../support/api/utils/products/checkProductInfo";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith,
} from "../../support/api/utils/products/productsUtils";
import { metadataForms } from "../../support/pages/catalog/metadataComponent";
import { fillUpCommonFieldsForAllProductTypes } from "../../support/pages/catalog/products/productDetailsPage";

describe("Update products", () => {
  const startsWith = "CyUpdateProducts-";
  const name = `${startsWith}${faker.datatype.number()}`;
  const description = faker.lorem.sentences(2);

  let defaultChannel;
  let collection;
  let product;
  let attribute;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteProductsStartsWith(startsWith);
    deleteCollectionsStartsWith(startsWith);
    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        createCollection(name);
      })
      .then(collectionResp => {
        collection = collectionResp;
        createTypeAttributeAndCategoryForProduct({ name });
      })
      .then(({ attribute: attributeResp, category, productType }) => {
        attribute = attributeResp;
        createProductInChannel({
          attributeId: attribute.id,
          categoryId: category.id,
          productTypeId: productType.id,
          channelId: defaultChannel.id,
          name,
          collectionId: collection.id,
          description,
        });
      })
      .then(({ product: productResp }) => {
        product = productResp;
      });
  });

  it("Should update product", { tags: ["@products", "@allEnv"] }, () => {
    const updatedName = `${startsWith}${faker.random.number()}`;
    let updatedCategory;
    let updatedCollection;
    createCategory({ name: updatedName })
      .then(categoryResp => {
        updatedCategory = categoryResp;
        createCollection(updatedName);
      })
      .then(collectionResp => {
        updatedCollection = collectionResp;
        const productData = {
          generalInfo: {
            name: updatedName,
            description: faker.lorem.sentence(),
            rating: 3,
          },
          seo: {
            slug: updatedName,
            title: "newTitle",
            description: "New description.",
          },
          metadata: {
            private: {
              metadataForm: metadataForms.private,
              name: "newPrivate",
              value: "value1",
            },
            public: {
              metadataForm: metadataForms.public,
              name: "newPublic",
              value: "value2",
            },
          },
          productOrganization: {
            category: updatedCategory.name,
            collection: updatedCollection.name,
          },
        };
        cy.clearSessionData()
          .loginUserViaRequest("auth", ONE_PERMISSION_USERS.product)
          .visit(productDetailsUrl(product.id))
          .get(PRODUCT_DETAILS.collectionRemoveButtons)
          .click();
        fillUpCommonFieldsForAllProductTypes(productData, false);
        cy.addAliasToGraphRequest("UpdatePrivateMetadata")
          .addAliasToGraphRequest("UpdateMetadata")
          .addAliasToGraphRequest("ProductUpdate")
          .get(BUTTON_SELECTORS.confirm)
          .click()
          .confirmationMessageShouldDisappear()
          .waitForRequestAndCheckIfNoErrors("@ProductUpdate")
          .waitForRequestAndCheckIfNoErrors("@UpdateMetadata")
          .waitForRequestAndCheckIfNoErrors("@UpdatePrivateMetadata");
        productData.productOrganization.productType = name;
        productData.attribute = attribute;
        cy.loginUserViaRequest("token")
          .then(() => {
            getProductDetails(product.id, defaultChannel.slug, "auth").its(
              "body.data.product",
            );
          })
          .then(resp => {
            expectCorrectProductInformation(resp, productData);
          });
      });
  });

  it(
    "should delete product",
    { tags: ["@products", "@allEnv", "@stable"] },
    () => {
      cy.clearSessionData()
        .loginUserViaRequest("auth", ONE_PERMISSION_USERS.product)
        .visit(productDetailsUrl(product.id))
        .addAliasToGraphRequest("ProductDelete")
        .get(BUTTON_SELECTORS.deleteButton)
        .click()
        .get(BUTTON_SELECTORS.submit)
        .click()
        .waitForRequestAndCheckIfNoErrors("@ProductDelete")
        .loginUserViaRequest("token")
        .then(() => {
          getProductDetails(product.id, defaultChannel.slug).its("body.data");
        })
        .then(
          productResp =>
            expect(productResp.product, "Check if product exist").to.be.null,
        );
    },
  );
});
