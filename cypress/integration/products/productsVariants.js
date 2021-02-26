import faker from "faker";
import { visit } from "graphql";

import Channels from "../../apiRequests/Channels";
import Product from "../../apiRequests/Product";
import ProductDetails from "../../apiRequests/storeFront/ProductDetails";
import VariantsSteps from "../../steps/products/VariantsSteps";
import { urlList } from "../../url/urlList";
import ChannelsUtils from "../../utils/channelsUtils";
import ProductsUtils from "../../utils/productsUtils";
import ShippingUtils from "../../utils/shippingUtils";
import StoreFrontProductUtils from "../../utils/storeFront/storeFrontProductUtils";

// <reference types="cypress" />
describe("creating variants", () => {
  const startsWith = "Cy-";

  const productUtils = new ProductsUtils();
  const channelsUtils = new ChannelsUtils();
  const shippingUtils = new ShippingUtils();
  const storeFrontProductUtils = new StoreFrontProductUtils();
  const product = new Product();
  const channels = new Channels();
  const productDetails = new ProductDetails();

  const variantsSteps = new VariantsSteps();

  let defaultChannel;
  let warehouse;
  let attribute;
  let productType;
  let category;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    shippingUtils.deleteShipping(startsWith);
    productUtils.deleteProperProducts(startsWith);

    const name = `${startsWith}${faker.random.number()}`;
    channelsUtils
      .getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        cy.fixture("addresses");
      })
      .then(fixtureAddresses =>
        shippingUtils.createShipping({
          channelId: defaultChannel.id,
          name,
          address: fixtureAddresses.plAddress
        })
      )
      .then(() => (warehouse = shippingUtils.getWarehouse()));

    productUtils.createTypeAttributeAndCategoryForProduct(name).then(() => {
      attribute = productUtils.getAttribute();
      productType = productUtils.getProductType();
      category = productUtils.getCategory();
    });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should create variant visible on frontend", () => {
    const name = `${startsWith}${faker.random.number()}`;
    const price = 10;
    let createdProduct;

    product
      .createProduct(attribute.id, name, productType.id, category.id)
      .then(resp => {
        createdProduct = resp.body.data.productCreate.product;
        product.updateChannelInProduct({
          productId: createdProduct.id,
          channelId: defaultChannel.id
        });
        cy.visit(`${urlList.products}${createdProduct.id}`);
        variantsSteps.createFirstVariant({
          sku: name,
          warehouseId: warehouse.id,
          price,
          attribute: attribute.values[0].name
        });
        storeFrontProductUtils.getProductVariants(
          createdProduct.id,
          defaultChannel.slug
        );
        // productDetails
        //   .getProductDetails(createdProduct.id, defaultChannel.slug)
      })
      .then(variants => {
        // expect(productDetailsResp.body[0].data.product.name).to.equal(name);
        expect(variants[0].name).to.equal(attribute.values[0].name);
        expect(variants[0].pricing.price.gross.amount).to.equal(price);
        // expect(
        //   productDetailsResp.body[0].data.product.variants[0].pricing.price
        //     .gross.amount
        // ).to.equal(price);
      });
  });
  it("should create several variants", () => {
    const name = `${startsWith}${faker.random.number()}`;
    const secondVariantSku = `${startsWith}${faker.random.number()}`;
    const variantsPrice = 5;
    let createdProduct;

    productUtils
      .createProductInChannel({
        name,
        attributeId: attribute.id,
        channelId: defaultChannel.id,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        categoryId: category.id,
        price: variantsPrice
      })
      .then(() => {
        createdProduct = productUtils.getCreatedProduct();
        cy.visit(`${urlList.products}${createdProduct.id}`);
        variantsSteps.createVariant({
          sku: secondVariantSku,
          warehouseName: warehouse.name,
          attributeName: attribute.values[1].name,
          price: variantsPrice
        });
      })
      .then(
        () =>
          storeFrontProductUtils.getProductVariants(
            createdProduct.id,
            defaultChannel.slug
          )
        // productDetails.getProductDetails(createdProduct.id, defaultChannel.slug)
      )
      .then(variants => {
        expect(variants).to.have.length(2);
        expect(variants[0].pricing.price.gross.amount).to.equal(variantsPrice);
        expect(variants[1].pricing.price.gross.amount).to.equal(variantsPrice);
        // expect(productDetailsResp.body[0].data.product.name).to.equal(name);
        // expect(productDetailsResp.body[0].data.product.variants).to.have.length(
        //   2
        // );
        // expect(
        //   productDetailsResp.body[0].data.product.variants[0].pricing.price
        //     .gross.amount
        // ).to.equal(variantsPrice);
        // expect(
        //   productDetailsResp.body[0].data.product.variants[1].pricing.price
        //     .gross.amount
        // ).to.equal(variantsPrice);
      });
  });
  it("should create variant for many channels", () => {
    const name = `${startsWith}${faker.random.number()}`;
    const variantsPrice = 10;
    let newChannel;
    let createdProduct;
    channels
      .createChannel(true, name, name, "PLN")
      .then(resp => {
        newChannel = resp.body.data.channelCreate.channel;
        productUtils.createProduct(
          attribute.id,
          name,
          productType.id,
          category.id
        );
      })
      .then(() => {
        createdProduct = productUtils.getCreatedProduct();
        product.updateChannelInProduct({
          productId: createdProduct.id,
          channelId: defaultChannel.id
        });
      })
      .then(() => {
        product.updateChannelInProduct({
          productId: createdProduct.id,
          channelId: newChannel.id
        });
      })
      .then(() => {
        cy.visit(`${urlList.products}${createdProduct.id}`);
        variantsSteps.createFirstVariant(
          name,
          warehouse.id,
          variantsPrice,
          attribute.name
        );
        // productDetails.getProductDetails(product.id, defaultChannel.slug);
        storeFrontProductUtils.getProductVariants(
          product.id,
          defaultChannel.slug
        );
      })
      .then(variants => {
        expect(variants[0].pricing.price.gross.amount).to.equal(variantsPrice);
      })
      .then(() => {
        storeFrontProductUtils.getProductVariants(product.id, newChannel.slug);
        // productDetails.getProductDetails(product.id, newChannel.slug);
      })
      .then(variants => {
        expect(variants[0].pricing.price.gross.amount).to.equal(variantsPrice);
      });
  });
});
