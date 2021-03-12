// <reference types="cypress" />

import faker from "faker";

import { updateChannelInProduct } from "../../apiRequests/Product";
import {
  assignProducts,
  createSale,
  discountOptions
} from "../../steps/salesSteps";
import { urlList } from "../../url/urlList";
import * as channelsUtils from "../../utils/channelsUtils";
import * as productsUtils from "../../utils/productsUtils";
import { deleteSalesStartsWith } from "../../utils/salesUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../utils/shippingUtils";
import { getProductPrice } from "../../utils/storeFront/storeFrontProductUtils";

describe("Sales discounts", () => {
  const startsWith = "Cy-";

  let productType;
  let attribute;
  let category;
  let defaultChannel;
  let warehouse;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    channelsUtils.deleteChannelsStartsWith(startsWith);
    deleteSalesStartsWith(startsWith);
    productsUtils.deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);

    const name = `${startsWith}${faker.random.number()}`;
    productsUtils
      .createTypeAttributeAndCategoryForProduct(name)
      .then(
        ({
          productType: productTypeResp,
          attribute: attributeResp,
          category: categoryResp
        }) => {
          productType = productTypeResp;
          attribute = attributeResp;
          category = categoryResp;

          channelsUtils.getDefaultChannel();
        }
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
          price: 100
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should create percentage discount", () => {
    const saleName = `${startsWith}${faker.random.number()}`;
    const discountValue = 50;
    const productPrice = 100;

    productsUtils
      .createProductInChannel({
        name: saleName,
        channelId: defaultChannel.id,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        price: productPrice
      })
      .then(({ product: productResp }) => {
        cy.visit(urlList.sales);
        const product = productResp;
        createSale({
          saleName,
          channelName: defaultChannel.name,
          discountValue,
          discountOption: discountOptions.PERCENTAGE
        });
        assignProducts(product.name);
        getProductPrice(product.id, defaultChannel.slug);
      })
      .then(price => {
        const expectedPrice = (productPrice * discountValue) / 100;
        expect(expectedPrice).to.be.eq(price);
      });
  });

  it("should create fixed price discount", () => {
    const saleName = `${startsWith}${faker.random.number()}`;
    const discountValue = 50;
    const productPrice = 100;

    productsUtils
      .createProductInChannel({
        name: saleName,
        channelId: defaultChannel.id,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        price: productPrice
      })
      .then(({ product: productResp }) => {
        cy.visit(urlList.sales);
        const product = productResp;
        createSale({
          saleName,
          channelName: defaultChannel.name,
          discountValue,
          discountOption: discountOptions.FIXED
        });
        assignProducts(product.name);
        getProductPrice(product.id, defaultChannel.slug);
      })
      .then(price => {
        const expectedPrice = productPrice - discountValue;
        expect(expectedPrice).to.be.eq(price);
      });
  });

  it("should not displayed discount not assign to channel", () => {
    const saleName = `${startsWith}${faker.random.number()}`;
    let channel;
    let product;
    const discountValue = 50;
    const productPrice = 100;

    channelsUtils
      .createChannel({ name: saleName })
      .then(channelResp => (channel = channelResp));
    productsUtils
      .createProductInChannel({
        name: saleName,
        channelId: defaultChannel.id,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        price: productPrice
      })
      .then(({ product: productResp }) => {
        product = productResp;
        updateChannelInProduct({
          productId: product.id,
          channelId: channel.id
        });
      })
      .then(() => {
        cy.visit(urlList.sales);
        createSale({
          saleName,
          channelName: channel.name,
          discountValue
        });
        assignProducts(product.name);
        getProductPrice(product.id, defaultChannel.slug);
      })
      .then(price => expect(price).to.equal(productPrice));
  });
});
