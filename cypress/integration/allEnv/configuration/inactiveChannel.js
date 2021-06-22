// <reference types="cypress" />
import faker from "faker";

import { activateChannel, createChannel } from "../../../apiRequests/Channels";
import { createCheckout } from "../../../apiRequests/Checkout";
import { getProductDetails } from "../../../apiRequests/storeFront/ProductDetails";
import { CHANNEL_FORM_SELECTORS } from "../../../elements/channels/channel-form-selectors";
import { DRAFT_ORDER_SELECTORS } from "../../../elements/orders/draft-order-selectors";
import { ORDERS_SELECTORS } from "../../../elements/orders/orders-selectors";
import { urlList } from "../../../url/urlList";
import {
  deleteChannelsStartsWith,
  getDefaultChannel
} from "../../../utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith
} from "../../../utils/products/productsUtils";
import { isProductVisible } from "../../../utils/storeFront/storeFrontProductUtils";

describe("Tests on inactive channel", () => {
  const channelStartsWith = `InactiveChannel`;
  const randomName = `${channelStartsWith}${faker.datatype.number()}`;
  const currency = "PLN";

  let address;
  let defaultChannel;
  let newChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteChannelsStartsWith(channelStartsWith);
    deleteProductsStartsWith(channelStartsWith);
    cy.fixture("addresses").then(({ plAddress }) => {
      address = plAddress;
    });
    getDefaultChannel().then(channel => (defaultChannel = channel));
    createChannel({
      isActive: false,
      name: randomName,
      slug: randomName,
      currencyCode: currency
    }).then(channel => {
      newChannel = channel;
    });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should not be possible to add products to order with inactive channel", () => {
    cy.visit(urlList.orders)
      .get(ORDERS_SELECTORS.createOrder)
      .click()
      .get(CHANNEL_FORM_SELECTORS.channelSelect)
      .click()
      .get(CHANNEL_FORM_SELECTORS.channelOption)
      .contains(newChannel.name)
      .click()
      .get(CHANNEL_FORM_SELECTORS.confirmButton)
      .click();
    cy.location()
      .should(loc => {
        const urlRegex = new RegExp(`${urlList.orders}.+`, "g");
        expect(loc.pathname).to.match(urlRegex);
      })
      .get(DRAFT_ORDER_SELECTORS.addProducts)
      .should("not.exist");
  });

  it("should not be possible to create checkout with inactive channel", () => {
    const randomChannel = `${channelStartsWith}${faker.datatype.number()}`;
    createTypeAttributeAndCategoryForProduct(randomChannel)
      .then(({ productType, attribute, category }) => {
        createProductInChannel({
          name: randomChannel,
          channelId: defaultChannel.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id
        });
      })
      .then(({ variantsList }) => {
        createCheckout({
          channelSlug: newChannel.slug,
          email: "example@example.com",
          variantsList,
          address
        });
      })
      .then(({ errors }) => {
        expect(
          errors[0],
          "checkout shouldn't be created with error in field channel"
        ).to.have.property("field", "channel");
      });
  });

  it("products in inactive channel should not be displayed", () => {
    const randomChannel = `${channelStartsWith}${faker.datatype.number()}`;
    let channel;
    let product;

    createChannel({
      isActive: false,
      name: randomChannel,
      slug: randomChannel,
      currencyCode: currency
    })
      .then(channelResp => {
        channel = channelResp;
        createTypeAttributeAndCategoryForProduct(randomChannel);
      })
      .then(({ productType, attribute, category }) => {
        createProductInChannel({
          name: randomChannel,
          channelId: channel.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id
        });
      })
      .then(({ product: productResp }) => {
        product = productResp;
        getProductDetails(product.id, channel.slug);
      })
      .then(resp => {
        const isVisible = isProductVisible(resp, randomChannel);
        expect(
          isVisible,
          "product with inactive channel shouldn't be visible"
        ).to.be.eq(false);
        activateChannel(channel.id);
      })
      .then(() => {
        getProductDetails(product.id, channel.slug);
      })
      .then(resp => {
        const isVisible = isProductVisible(resp, randomChannel);
        expect(
          isVisible,
          "product with active channel should be visible"
        ).to.be.eq(true);
      });
  });
});
