import faker from "faker";

import { createCategory } from "../../../apiRequests/Category";
import { createCollection } from "../../../apiRequests/Collections";
import { getProductDetails } from "../../../apiRequests/storeFront/ProductDetails";
import { PRODUCT_DETAILS } from "../../../elements/catalog/products/product-details";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { metadataForms } from "../../../steps/catalog/metadataSteps";
import { fillUpCommonFieldsForAllProductTypes } from "../../../steps/catalog/products/productSteps";
import { productDetailsUrl } from "../../../url/urlList";
import { getDefaultChannel } from "../../../utils/channelsUtils";
import { deleteCollectionsStartsWith } from "../../../utils/collectionsUtils";
import { expectCorrectProductInformation } from "../../../utils/products/checkProductInfo";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith
} from "../../../utils/products/productsUtils";

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
        createTypeAttributeAndCategoryForProduct(name);
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
          description
        });
      })
      .then(({ product: productResp }) => {
        product = productResp;
      });
  });
  it("Should update product", () => {
    const updatedName = `${startsWith}${faker.random.number()}`;
    let updatedCategory;
    let updatedCollection;
    createCategory(updatedName)
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
            rating: 3
          },
          seo: {
            slug: updatedName,
            title: "newTitle",
            description: "New description."
          },
          metadata: {
            private: {
              metadataForm: metadataForms.private,
              name: "newPrivate",
              value: "value1"
            },
            public: {
              metadataForm: metadataForms.public,
              name: "newPublic",
              value: "value2"
            }
          },
          productOrganization: {
            category: updatedCategory.name,
            collection: updatedCollection.name
          }
        };
        cy.visit(productDetailsUrl(product.id));
        cy.get(PRODUCT_DETAILS.collectionRemoveButtons).click();
        fillUpCommonFieldsForAllProductTypes(productData, false);
        cy.addAliasToGraphRequest("UpdatePrivateMetadata");
        cy.addAliasToGraphRequest("UpdateMetadata");
        cy.addAliasToGraphRequest("ProductUpdate");
        cy.get(BUTTON_SELECTORS.confirm).click();
        cy.get(PRODUCT_DETAILS.confirmationMsg)
          .should("be.visible")
          .then(() => {
            cy.wait("@ProductUpdate");
            cy.wait("@UpdateMetadata");
            cy.wait("@UpdatePrivateMetadata");
            productData.productOrganization.productType = name;
            productData.attribute = attribute;
            cy.loginUserViaRequest("token");
          })
          .then(() => {
            getProductDetails(product.id, defaultChannel.slug, "auth").its(
              "body.data.product"
            );
          })
          .then(resp => {
            expectCorrectProductInformation(resp, productData);
          });
      });
  });
  it("should delete product", () => {
    cy.visit(productDetailsUrl(product.id));
    cy.addAliasToGraphRequest("ProductDelete");
    cy.get(BUTTON_SELECTORS.deleteButton)
      .click()
      .get(BUTTON_SELECTORS.submit)
      .click();
    cy.wait("@ProductDelete");
    cy.loginUserViaRequest("token")
      .then(() => {
        getProductDetails(product.id, defaultChannel.slug).its("body.data");
      })
      .then(
        productResp =>
          expect(productResp.product, "Check if product exist").to.be.null
      );
  });
});
