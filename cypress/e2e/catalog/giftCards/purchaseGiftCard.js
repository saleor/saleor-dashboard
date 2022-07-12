/// <reference types="cypress" />
import faker from "faker";

import { deleteGiftCardsWithTagStartsWith } from "../../../support/api/utils/catalog/giftCardUtils";
import * as channelsUtils from "../../../support/api/utils/channelsUtils";
import { createWaitingForCaptureOrder } from "../../../support/api/utils/ordersUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith,
} from "../../../support/api/utils/shippingUtils";

describe("As a customer I should be able to purchase gift card as a product", () => {
  const startsWith = "GiftCardsCheckout";
  const productPrice = 50;
  const shippingPrice = 50;
  const email = "example@example.com";

  let defaultChannel;
  let productType;
  let attribute;
  let category;
  let shippingMethod;
  let variants;
  let address;
  const giftCardData = {
    amount: 150,
    currency: "USD",
  };

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    channelsUtils.deleteChannelsStartsWith(startsWith);
    productsUtils.deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    deleteGiftCardsWithTagStartsWith(startsWith);

    const name = `${startsWith}${faker.datatype.number()}`;

    productsUtils
      .createTypeAttributeAndCategoryForProduct({ name, kind: "GIFT_CARD" })
      .then(
        ({
          productType: productTypeResp,
          attribute: attributeResp,
          category: categoryResp,
        }) => {
          productType = productTypeResp;
          attribute = attributeResp;
          category = categoryResp;

          channelsUtils.getDefaultChannel();
        },
      )
      .then(channel => {
        defaultChannel = channel;
        cy.fixture("addresses");
      })
      .then(addresses => {
        address = addresses.plAddress;
        createShipping({
          channelId: defaultChannel.id,
          name,
          address,
          price: shippingPrice,
        });
      })
      .then(({ shippingMethod: shippingMethodResp, warehouse: warehouse }) => {
        shippingMethod = shippingMethodResp;
        productsUtils.createProductInChannel({
          name,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
          price: productPrice,
        });
      })
      .then(({ variantsList: variantsResp }) => {
        variants = variantsResp;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should be able to purchase gift card as a product. TC: SALEOR_1008",
    { tags: ["@giftCard", "@allEnv", "@stable"] },
    () => {
      giftCardData.tag = `${startsWith}${faker.datatype.number()}`;

      createWaitingForCaptureOrder({
        address,
        channelSlug: defaultChannel.slug,
        email,
        shippingMethodName: shippingMethod.name,
        variantsList: variants,
      }).then(({ order }) => {
        expect(order.id).to.be.ok;
      });
    },
  );
});
