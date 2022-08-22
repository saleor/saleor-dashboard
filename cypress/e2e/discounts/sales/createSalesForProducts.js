/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { urlList } from "../../../fixtures/urlList";
import { createChannel } from "../../../support/api/requests/Channels";
import { updateChannelInProduct } from "../../../support/api/requests/Product";
import * as channelsUtils from "../../../support/api/utils/channelsUtils";
import { deleteSalesStartsWith } from "../../../support/api/utils/discounts/salesUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith,
} from "../../../support/api/utils/shippingUtils";
import { getProductPrice } from "../../../support/api/utils/storeFront/storeFrontProductUtils";
import {
  assignProducts,
  createSale,
  createSaleWithNewProduct,
  discountOptions,
} from "../../../support/pages/discounts/salesPage";

describe("As an admin I want to create sale for products", () => {
  const startsWith = "SalesProd-";
  const discountValue = 50;
  const productPrice = 100;

  let productType;
  let attribute;
  let category;
  let defaultChannel;
  let warehouse;

  before(() => {
    const name = `${startsWith}${faker.datatype.number()}`;

    cy.clearSessionData().loginUserViaRequest();
    channelsUtils.deleteChannelsStartsWith(startsWith);
    deleteSalesStartsWith(startsWith);
    productsUtils.deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    productsUtils
      .createTypeAttributeAndCategoryForProduct({ name })
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
        createShipping({
          channelId: defaultChannel.id,
          name,
          address: addresses.plAddress,
          price: 100,
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should be able to create percentage discount. TC: SALEOR_1801",
    { tags: ["@sales", "@allEnv", "@stable"] },
    () => {
      const saleName = `${startsWith}${faker.datatype.number()}`;
      const expectedPrice = (productPrice * discountValue) / 100;

      createSaleWithNewProduct({
        name: saleName,
        channel: defaultChannel,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        price: productPrice,
        discountOption: discountOptions.PERCENTAGE,
        discountValue,
      }).should("eq", expectedPrice);
    },
  );

  it(
    "should be able to create fixed price discount. TC: SALEOR_1802",
    { tags: ["@sales", "@allEnv", "@stable"] },
    () => {
      const saleName = `${startsWith}${faker.datatype.number()}`;
      const expectedPrice = productPrice - discountValue;

      createSaleWithNewProduct({
        name: saleName,
        channel: defaultChannel,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        price: productPrice,
        discountOption: discountOptions.FIXED,
        discountValue,
      }).should("eq", expectedPrice);
    },
  );

  it(
    "should not be able to see product discount not assign to channel. TC: SALEOR_1803",
    { tags: ["@sales", "@allEnv", "@stable"] },
    () => {
      const saleName = `${startsWith}${faker.datatype.number()}`;

      let channel;
      let product;

      createChannel({ name: saleName }).then(
        channelResp => (channel = channelResp),
      );
      productsUtils
        .createProductInChannel({
          name: saleName,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
          price: productPrice,
        })
        .then(({ product: productResp }) => {
          product = productResp;

          updateChannelInProduct({
            productId: product.id,
            channelId: channel.id,
          });
          /* Uncomment after fixing SALEOR-3367 bug 
           cy.clearSessionData()
          .loginUserViaRequest("auth", ONE_PERMISSION_USERS.discount) 
          */
          cy.visit(urlList.sales)
            .expectSkeletonIsVisible()
            .waitForProgressBarToNotExist();
          createSale({
            saleName,
            channelName: channel.name,
            discountValue,
          });
          assignProducts(product.name);
          getProductPrice(product.id, defaultChannel.slug);
        })
        .should("eq", productPrice);
    },
  );
});
