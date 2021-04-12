import faker from "faker";

import { createCollection } from "../../apiRequests/Collections";
import { productDetailsUrl } from "../../url/urlList";
import { getDefaultChannel } from "../../utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct
} from "../../utils/productsUtils";

describe("Update products", () => {
  const startsWith = "Cy-";
  const name = `${startsWith}${faker.random.number()}`;

  let defaultChannel;
  let collection;
  let product;

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        createCollection(name);
      })
      .then(collectionResp => {
        collection = collectionResp;
        createTypeAttributeAndCategoryForProduct(name);
      })
      .then(({ attribute, category, productType }) => {
        createProductInChannel({
          attributeId: attribute.id,
          categoryId: category.id,
          productTypeId: productType.id,
          channelId: defaultChannel.id,
          name,
          collectionId: collection.id,
          description: faker.lorem.sentences(2)
        });
      })
      .then(({ productResp }) => {
        product = productResp;
      });
  });
  it("Should update product", () => {
    cy.visit(productDetailsUrl(product.id));
    cy.pause();
  });
});
