/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { urlList } from "../../../fixtures/urlList";
import { createChannel } from "../../../support/api/requests/Channels";
import { updateChannelInProduct } from "../../../support/api/requests/Product";
import { expectProductVisibleInShop } from "../../../support/api/requests/storeFront/Search";
import * as channelsUtils from "../../../support/api/utils/channelsUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import { createShipping } from "../../../support/api/utils/shippingUtils";

import { getProductPrice } from "../../../support/api/utils/storeFront/storeFrontProductUtils";
import {
  getDefaultTaxClass,
  updateTaxConfigurationForChannel,
} from "../../../support/api/utils/taxesUtils";
import {
  assignProducts,
  createSale,
  createSaleWithNewProduct,
  discountOptions,
} from "../../../support/pages/discounts/salesPage";

describe("As an admin I want to create sale for products", () => {
  const startsWith = "SalesProd-";
  const discountValue = 10;
  const productPrice = 50;

  let productType;
  let attribute;
  let category;
  let defaultChannel;
  let warehouse;
  let taxClass;

  before(() => {
    const name = `${startsWith}${faker.datatype.number()}`;

    cy.loginUserViaRequest();
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
        getDefaultTaxClass();
      })
      .then(taxResp => {
        taxClass = taxResp;
        cy.fixture("addresses");
      })
      .then(addresses => {
        createShipping({
          channelId: defaultChannel.id,
          name,
          address: addresses.plAddress,
          price: 100,
          taxClassId: taxClass.id,
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
        cy.checkIfDataAreNotNull({
          productType,
          attribute,
          category,
          defaultChannel,
          warehouse,
        });
      });
  });

  beforeEach(() => {
    cy.loginUserViaRequest();
    updateTaxConfigurationForChannel({
      channelSlug: defaultChannel.slug,
      pricesEnteredWithTax: true,
    });
  });

  it(
    "should be able to create percentage discount. TC: SALEOR_1801",
    { tags: ["@sales", "@allEnv", "@stable"] },
    () => {
      const saleName = `${startsWith}${faker.datatype.number()}`;
      const discountOption = discountOptions.PERCENTAGE;

      createSaleWithNewProduct({
        name: saleName,
        channel: defaultChannel,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        price: productPrice,
        discountOption,
        discountValue,
        taxClassId: taxClass.id,
      }).should("eq", 45);
    },
  );

  it(
    "should be able to create fixed price discount. TC: SALEOR_1802",
    { tags: ["@sales", "@allEnv", "@stable"] },
    () => {
      const saleName = `${startsWith}${faker.datatype.number()}`;
      const discountOption = discountOptions.FIXED;

      createSaleWithNewProduct({
        name: saleName,
        channel: defaultChannel,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        price: productPrice,
        discountOption,
        discountValue,
      }).should("eq", 40);
    },
  );

  it(
    "should not be able to see product discount not assigned to channel. TC: SALEOR_1803",
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
          taxClassId: taxClass.id,
        })
        .then(({ product: productResp }) => {
          product = productResp;

          updateChannelInProduct({
            productId: product.id,
            channelId: channel.id,
          });
          /*Uncomment after fixing SALEOR-3367 bug
          cy.clearSessionData().loginUserViaRequest("auth", ONE_PERMISSION_USERS.discount);
          */
          cy.visit(urlList.sales);
          createSale({
            saleName,
            channelName: channel.name,
            discountValue,
          });
          // Make sure the product is searchable before assigning
          expectProductVisibleInShop(product.name);
          assignProducts(product.name);
          getProductPrice(product.id, defaultChannel.slug);
        })
        .should("eq", 50);
    },
  );
});
