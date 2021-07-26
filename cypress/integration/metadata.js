import faker from "faker";

import { updateMetadata, updatePrivateMetadata } from "../apiRequests/Metadata";
import { createDraftOrder, getOrder } from "../apiRequests/Order";
import { getProductMetadata } from "../apiRequests/storeFront/ProductDetails";
import filterTests from "../support/filterTests";
import { getDefaultChannel } from "../utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct
} from "../utils/products/productsUtils";

filterTests(["all"], () => {
  describe("Test for metadata", () => {
    const startsWith = "Metadata";
    const name = `${startsWith}${faker.datatype.number()}`;
    const metadata = { key: "metadataKey", value: "metadataValue" };
    let channel;
    let product;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      getDefaultChannel()
        .then(channelResp => {
          channel = channelResp;
          createTypeAttributeAndCategoryForProduct(name);
        })
        .then(({ attribute, category, productType }) => {
          createProductInChannel({
            attributeId: attribute.id,
            categoryId: category.id,
            channelId: channel.id,
            name,
            productTypeId: productType.id
          });
        })
        .then(({ product: productResp }) => {
          product = productResp;
        });
    });

    it("should create metadata for product", () => {
      cy.clearSessionData().loginUserViaRequest();
      updateMetadata(product.id, metadata.key, metadata.value);
      updatePrivateMetadata(product.id, metadata.key, metadata.value)
        .then(() => {
          getProductMetadata({
            productId: product.id,
            channelSlug: channel.slug,
            auth: "auth",
            withPrivateMetadata: true
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
            withPrivateMetadata: true
          });
        })
        .then(({ errors }) => {
          expect(errors[0].extensions.exception.code).to.eq("PermissionDenied");
          getProductMetadata({
            productId: product.id,
            channelSlug: channel.slug,
            auth: "token",
            withPrivateMetadata: false
          }).its("data");
        })
        .then(({ product: productResp }) => {
          expect(productResp.metadata[0].key).to.eq(metadata.key);
          expect(productResp.metadata[0].value).to.eq(metadata.value);
        });
    });
    it("should create metadata for order", () => {
      let order;
      cy.clearSessionData().loginUserViaRequest();
      createDraftOrder({ channelId: channel.id })
        .then(orderResp => {
          order = orderResp;
          updateMetadata(order.id, metadata.key, metadata.value);
          updatePrivateMetadata(order.id, metadata.key, metadata.value);
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
    });
  });
});
