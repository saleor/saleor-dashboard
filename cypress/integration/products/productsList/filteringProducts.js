import faker from "faker";

import { urlList } from "../../../url/urlList";
import { getDefaultChannel } from "../../../utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct
} from "../../../utils/productsUtils";
import { createShipping } from "../../../utils/shippingUtils";

describe("Products", () => {
  const startsWith = "Cy-";
  const name = `${startsWith} ${faker.random.number()}`;
  const stockQuantity = 747;
  const price = 342;
  let attribute;
  let productType;
  let category;
  let channel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    createTypeAttributeAndCategoryForProduct(name).then(
      ({
        attribute: attributeResp,
        productType: productTypeResp,
        category: categoryResp
      }) => {
        attribute = attributeResp;
        productType = productTypeResp;
        category = categoryResp;
      }
    );
    getDefaultChannel()
      .then(channelResp => {
        channel = channelResp;
        cy.fixture("addresses");
      })
      .then(addresses => {
        createShipping({
          channelId: channel.id,
          name,
          address: addresses.plAddress
        });
      })
      .then(({ warehouse: warehouse }) => {
        createProductInChannel({
          name,
          channelId: channel.id,
          warehouseId: warehouse.id,
          quantityInWarehouse: stockQuantity,
          price,
          attributeId: attribute.id,
          categoryId: category.id,
          productTypeId: productType.id
        });
      });
  });
  it("should filter products by category", () => {
    cy.clearSessionData()
      .loginUserViaRequest()
      .visit(urlList.products);
  });
});
