/// <reference types="cypress"/>
/// <reference types="../support"/>
import faker from "faker";

import {
  updateMetadata,
  updatePrivateMetadata,
} from "../support/api/requests/Metadata";
import { createDraftOrder, getOrder } from "../support/api/requests/Order";
import { getProductMetadata } from "../support/api/requests/storeFront/ProductDetails";
import { getDefaultChannel } from "../support/api/utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith,
} from "../support/api/utils/products/productsUtils";

describe("Test for metadata", () => {
  const startsWith = "Metadata";
  const name = `${startsWith}${faker.datatype.number()}`;
  const metadata = { key: "metadataKey", value: "metadataValue" };
  let channel;
  let product;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteProductsStartsWith(startsWith);
    getDefaultChannel()
      .then(channelResp => {
        channel = channelResp;
        createTypeAttributeAndCategoryForProduct({ name });
      })
      .then(({ attribute, category, productType }) => {
        createProductInChannel({
          attributeId: attribute.id,
          categoryId: category.id,
          channelId: channel.id,
          name,
          productTypeId: productType.id,
        });
      })
      .then(({ product: productResp }) => {
        product = productResp;
      });
  });

  it(
    "should create metadata for product",
    { tags: ["@metadata", "@allEnv", "@stable"] },
    () => {
      cy.clearSessionData().loginUserViaRequest();
      updateMetadata(product.id, metadata.key, metadata.value);
      updatePrivateMetadata(product.id, metadata.key, metadata.value)
        .then(() => {
          getProductMetadata({
            productId: product.id,
            channelSlug: channel.slug,
            auth: "auth",
            withPrivateMetadata: true,
          }).its("data");
        })
        .then(({ product: productResp }) => {
          expect(productResp.metadata[0].key).to.eq(metadata.key);
          expect(productResp.metadata[0].value).to.eq(metadata.value);
          expect(productResp.privateMetadata[0].key).to.eq(metadata.key);
          expect(productResp.privateMetadata[0].value).to.eq(metadata.value);
          getProductMetadata({
            productId: product.id,
            channelSlug: channel.slug,
            auth: "token",
            withPrivateMetadata: true,
          });
        })
        .then(({ errors }) => {
          expect(errors[0].extensions.exception.code).to.eq("PermissionDenied");
          getProductMetadata({
            productId: product.id,
            channelSlug: channel.slug,
            auth: "token",
            withPrivateMetadata: false,
          }).its("data");
        })
        .then(({ product: productResp }) => {
          expect(productResp.metadata[0].key).to.eq(metadata.key);
          expect(productResp.metadata[0].value).to.eq(metadata.value);
        });
    },
  );
  it(
    "should create metadata for order",
    { tags: ["@metadata", "@allEnv", "@stable"] },
    () => {
      let order;
      cy.clearSessionData().loginUserViaRequest();
      createDraftOrder({ channelId: channel.id })
        .then(orderResp => {
          order = orderResp;
          updateMetadata(order.token, metadata.key, metadata.value);
          updatePrivateMetadata(order.token, metadata.key, metadata.value);
        })
        .then(() => {
          getOrder(order.id);
        })
        .then(orderResp => {
          expect(orderResp.metadata[0].key).to.eq(metadata.key);
          expect(orderResp.metadata[0].value).to.eq(metadata.value);
          expect(orderResp.privateMetadata[0].key).to.eq(metadata.key);
          expect(orderResp.privateMetadata[0].value).to.eq(metadata.value);
        });
    },
  );
});
