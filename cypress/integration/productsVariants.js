import faker from "faker";
import { visit } from "graphql";

import Channels from "../apiRequests/Channels";
import ProductDetails from "../apiRequests/frontShop/ProductDetails";
import Product from "../apiRequests/Product";
import VariantsSteps from "../steps/products/VariantsSteps";
import { urlList } from "../url/urlList";
import ChannelsUtils from "../utils/channelsUtils";
import ProductsUtils from "../utils/productsUtils";
import ShippingUtils from "../utils/shippingUtils";

// <reference types="cypress" />
describe("creating variants", () => {
  const startsWith = "Cy-";

  const productUtils = new ProductsUtils();
  const channelsUtils = new ChannelsUtils();
  const shippingUtils = new ShippingUtils();
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
        shippingUtils.createShipping(
          defaultChannel.id,
          name,
          fixtureAddresses.plAddress,
          10
        )
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
        product.updateChannelInProduct(
          createdProduct.id,
          defaultChannel.id,
          true,
          true,
          true
        );
        cy.visit(`${urlList.products}${createdProduct.id}`);
        variantsSteps.createFirstVariant(name, warehouse.id, price);
        productDetails
          .getProductDetails(createdProduct.id, defaultChannel.slug)
          .then(productDetailsResp => {
            expect(productDetailsResp.body[0].data.product.name).to.equal(name);
            expect(
              productDetailsResp.body[0].data.product.variants[0].pricing.price
                .gross.amount
            ).to.equal(price);
          });
      });
  });
  it("should create several variants", () => {
    const name = `${startsWith}${faker.random.number()}`;
    const secondVariantSku = `${startsWith}${faker.random.number()}`;
    const variantsPrice = 5;
    let createdProduct;
    productUtils
      .createProductInChannel(
        name,
        defaultChannel.id,
        warehouse.id,
        1,
        productType.id,
        attribute.id,
        category.id,
        variantsPrice
      )
      .then(() => {
        createdProduct = productUtils.getCreatedProduct();
        cy.visit(`${urlList.products}${createdProduct.id}`);
        variantsSteps.createVariant(
          secondVariantSku,
          warehouse.name,
          variantsPrice
        );
      })
      .then(() =>
        productDetails.getProductDetails(createdProduct.id, defaultChannel.slug)
      )
      .then(productDetailsResp => {
        expect(productDetailsResp.body[0].data.product.name).to.equal(name);
        expect(productDetailsResp.body[0].data.product.variants).to.have.length(
          2
        );
        expect(
          productDetailsResp.body[0].data.product.variants[0].pricing.price
            .gross.amount
        ).to.equal(variantsPrice);
        expect(
          productDetailsResp.body[0].data.product.variants[1].pricing.price
            .gross.amount
        ).to.equal(variantsPrice);
      });
  });
  it("should create variant for many channels", () => {
    const name = `${startsWith}${faker.random.number()}`;
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
        product.updateChannelInProduct(
          createdProduct.id,
          defaultChannel.id,
          true,
          true,
          true
        );
      })
      .then(() => {
        product.updateChannelInProduct(
          createdProduct.id,
          newChannel.id,
          true,
          true,
          true
        );
      })
      .then(() => {
        cy.visit(`${urlList.products}${createdProduct.id}`);
        variantsSteps.createFirstVariant(warehouse.id);
        productDetails.getProductDetails(product.id, defaultChannel.slug);
      })
      .then(productDetailsResp => {
        expect(productDetailsResp.body[0].data.product.name).to.equal(name);
        expect(
          productDetailsResp.body[0].data.product.variants[0].pricing.price
            .gross.amount
        ).to.equal(10);
      })
      .then(() => {
        productDetails.getProductDetails(product.id, newChannel.slug);
      })
      .then(productDetailsResp => {
        expect(productDetailsResp.body[0].data.product.name).to.equal(name);
        expect(
          productDetailsResp.body[0].data.product.variants[0].pricing.price
            .gross.amount
        ).to.equal(10);
      });
  });
});
