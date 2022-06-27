/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { CHANNEL_FORM_SELECTORS } from "../../../elements/channels/channel-form-selectors";
import { DRAFT_ORDER_SELECTORS } from "../../../elements/orders/draft-order-selectors";
import { ORDERS_SELECTORS } from "../../../elements/orders/orders-selectors";
import { urlList } from "../../../fixtures/urlList";
import {
  activateChannel,
  createChannel,
} from "../../../support/api/requests/Channels";
import { createCheckout } from "../../../support/api/requests/Checkout";
import { getProductDetails } from "../../../support/api/requests/storeFront/ProductDetails";
import {
  deleteChannelsStartsWith,
  getDefaultChannel,
} from "../../../support/api/utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith,
} from "../../../support/api/utils/products/productsUtils";
import { isProductVisible } from "../../../support/api/utils/storeFront/storeFrontProductUtils";

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
      currencyCode: currency,
    }).then(channel => {
      newChannel = channel;
    });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should not be possible to add products to order with inactive channel. TC: SALEOR_0706",
    { tags: ["@channel", "@allEnv"] },
    () => {
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
    },
  );

  it(
    "should not be possible to create checkout with inactive channel. TC: SALEOR_0707",
    { tags: ["@channel", "@allEnv", "@stable"] },
    () => {
      const randomChannel = `${channelStartsWith}${faker.datatype.number()}`;
      createTypeAttributeAndCategoryForProduct({ name: randomChannel })
        .then(({ productType, attribute, category }) => {
          createProductInChannel({
            name: randomChannel,
            channelId: defaultChannel.id,
            productTypeId: productType.id,
            attributeId: attribute.id,
            categoryId: category.id,
          });
        })
        .then(({ variantsList }) => {
          createCheckout({
            channelSlug: newChannel.slug,
            email: "example@example.com",
            variantsList,
            address,
          });
        })
        .then(({ errors }) => {
          expect(
            errors[0],
            "checkout shouldn't be created with error in field channel",
          ).to.have.property("field", "channel");
        });
    },
  );

  it(
    "products in inactive channel should not be displayed. TC: SALEOR_0708",
    { tags: ["@channel", "@allEnv", "@stable"] },
    () => {
      const randomChannel = `${channelStartsWith}${faker.datatype.number()}`;
      let channel;
      let product;

      createChannel({
        isActive: false,
        name: randomChannel,
        slug: randomChannel,
        currencyCode: currency,
      })
        .then(channelResp => {
          channel = channelResp;
          createTypeAttributeAndCategoryForProduct({ name: randomChannel });
        })
        .then(({ productType, attribute, category }) => {
          createProductInChannel({
            name: randomChannel,
            channelId: channel.id,
            productTypeId: productType.id,
            attributeId: attribute.id,
            categoryId: category.id,
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
            "product with inactive channel shouldn't be visible",
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
            "product with active channel should be visible",
          ).to.be.eq(true);
        });
    },
  );
});
