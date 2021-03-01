import faker from "faker";

import Channels from "../../apiRequests/Channels";
import Product from "../../apiRequests/Product";
import VariantsSteps from "../../steps/products/VariantsSteps";
import { urlList } from "../../url/urlList";
import ChannelsUtils from "../../utils/channelsUtils";
import ProductsUtils from "../../utils/productsUtils";
import ShippingUtils from "../../utils/shippingUtils";
import { getProductVariants } from "../../utils/storeFront/storeFrontProductUtils";

// <reference types="cypress" />
describe("creating variants", () => {
  const startsWith = "Cy-";
  const attributeValues = ["value1", "value2"];

  const productUtils = new ProductsUtils();
  const channelsUtils = new ChannelsUtils();
  const shippingUtils = new ShippingUtils();
  const product = new Product();
  const channels = new Channels();

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

    productUtils
      .createTypeAttributeAndCategoryForProduct(name, attributeValues)
      .then(() => {
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
          attribute: attributeValues[0]
        });
        getProductVariants(createdProduct.id, defaultChannel.slug);
      })
      .then(variants => {
        expect(variants[0]).to.have.property("name", attributeValues[0]);
        expect(variants[0].pricing.price.gross).to.have.property(
          "amount",
          price
        );
      });
  });
  it("should create several variants", () => {
    const name = `${startsWith}${faker.random.number()}`;
    const secondVariantSku = `${startsWith}${faker.random.number()}`;
    const variants = [{ amount: 7 }, { name: attributeValues[1], amount: 16 }];
    let createdProduct;

    productUtils
      .createProductInChannel({
        name,
        attributeId: attribute.id,
        channelId: defaultChannel.id,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        categoryId: category.id,
        price: variants[0].amount
      })
      .then(() => {
        createdProduct = productUtils.getCreatedProduct();
        cy.visit(`${urlList.products}${createdProduct.id}`);
        variantsSteps.createVariant({
          sku: secondVariantSku,
          warehouseName: warehouse.name,
          attributeName: variants[1].name,
          price: variants[1].amount
        });
      })
      .then(() => getProductVariants(createdProduct.id, defaultChannel.slug))
      .then(variantsResp => {
        expect(variantsResp).to.have.length(2);
        expect(variantsResp[0].pricing.price.gross).to.have.property(
          "amount",
          variants[0].amount
        );
        expect(variantsResp[1]).to.have.property("name", variants[1].name);
        expect(variantsResp[1].pricing.price.gross).to.have.property(
          "amount",
          variants[1].amount
        );
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
        variantsSteps.createFirstVariant({
          sku: name,
          warehouseId: warehouse.id,
          price: variantsPrice,
          attribute: attributeValues[0]
        });
        getProductVariants(createdProduct.id, defaultChannel.slug);
      })
      .then(variants => {
        expect(variants[0]).to.have.property("name", attributeValues[0]);
        expect(variants[0].pricing.price.gross).to.have.property(
          "amount",
          variantsPrice
        );
        getProductVariants(createdProduct.id, newChannel.slug);
      })
      .then(variants => {
        expect(variants[0]).to.have.property("name", attributeValues[0]);
        expect(variants[0].pricing.price.gross).to.have.property(
          "amount",
          variantsPrice
        );
      });
  });
});
