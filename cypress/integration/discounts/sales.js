// <reference types="cypress" />

import faker from "faker";

import ProductRequest from "../../apiRequests/Product";
import SalesSteps from "../../steps/salesSteps";
import { urlList } from "../../url/urlList";
import ChannelsUtils from "../../utils/channelsUtils";
import ProductsUtils from "../../utils/productsUtils";
import SalesUtils from "../../utils/salesUtils";
import ShippingUtils from "../../utils/shippingUtils";
import { getProductPrice } from "../../utils/storeFront/storeFrontProductUtils";

describe("Sales discounts", () => {
  const startsWith = "Cy-";

  const productRequest = new ProductRequest();
  const productsUtils = new ProductsUtils();
  const channelsUtils = new ChannelsUtils();
  const shippingUtils = new ShippingUtils();
  const salesUtils = new SalesUtils();
  const salesSteps = new SalesSteps();

  let productType;
  let attribute;
  let category;
  let defaultChannel;
  let warehouse;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    channelsUtils.deleteChannels(startsWith);
    salesUtils.deleteProperSales(startsWith);
    productsUtils.deleteProperProducts(startsWith);
    shippingUtils.deleteShipping(startsWith);

    const name = `${startsWith}${faker.random.number()}`;
    productsUtils
      .createTypeAttributeAndCategoryForProduct(name)
      .then(() => {
        productType = productsUtils.getProductType();
        attribute = productsUtils.getAttribute();
        category = productsUtils.getCategory();

        channelsUtils.getDefaultChannel();
      })
      .then(channel => {
        defaultChannel = channel;
        cy.fixture("addresses");
      })
      .then(addresses => {
        shippingUtils.createShipping({
          channelId: defaultChannel.id,
          name,
          address: addresses.plAddress,
          price: 100
        });
      })
      .then(() => {
        warehouse = shippingUtils.getWarehouse();
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
      .then(() => {
        cy.visit(urlList.sales);
        const product = productsUtils.getCreatedProduct();
        salesSteps.createSale({
          saleName,
          channelName: defaultChannel.name,
          discountValue,
          discountOption: salesSteps.discountOptions.PERCENTAGE
        });
        salesSteps.assignProducts(product.name);
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
      .then(() => {
        cy.visit(urlList.sales);
        const product = productsUtils.getCreatedProduct();
        salesSteps.createSale({
          saleName,
          channelName: defaultChannel.name,
          discountValue,
          discountOption: salesSteps.discountOptions.FIXED
        });
        salesSteps.assignProducts(product.name);
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

    channelsUtils.createChannel({ name: saleName });
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
      .then(() => {
        product = productsUtils.getCreatedProduct();
        channel = channelsUtils.getCreatedChannel();
        productRequest.updateChannelInProduct({
          productId: product.id,
          channelId: channel.id
        });
      })
      .then(() => {
        cy.visit(urlList.sales);
        salesSteps.createSale({
          saleName,
          channelName: channel.name,
          discountValue
        });
        salesSteps.assignProducts(product.name);
        getProductPrice(product.id, defaultChannel.slug);
      })
      .then(price => expect(price).to.equal(productPrice));
  });
});
