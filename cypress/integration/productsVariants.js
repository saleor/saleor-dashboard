import faker from "faker";

import Channels from "../apiRequests/Channels";
import Product from "../apiRequests/Product";
import ShopInfo from "../apiRequests/ShopInfo";
import { PRODUCTS_SELECTORS } from "../elements/catalog/product-selectors";
import { VARIANTS_SELECTORS } from "../elements/catalog/variants-selectors";
import VariantsSteps from "../steps/products/VariantsSteps";
import { urlList } from "../url/url-list";
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
  const shopInfo = new ShopInfo();
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
    productUtils.deleteProducts(startsWith);

    const name = `${startsWith}${faker.random.number()}`;
    channelsUtils
      .getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        cy.fixture("addresses");
      })
      .then(fixtureAddresses =>
        shippingUtils.createShipping(
          channel.id,
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
    shopInfo
      .getShopInfo()
      .its("body.data.shop.domain.url")
      .as("shopUrl");
  });

  it("should create variant visible on frontend", () => {
    const name = `${startsWith}${faker.random.number()}`;
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
        cy.visit(`${urlList.products}${productId}`);
        variantsSteps.createFirstVariant(warehouse.id);
        // .get(PRODUCTS_SELECTORS.addVariantsButton)
        // .click()
        // .get(VARIANTS_SELECTORS.attributeCheckbox)
        // .first()
        // .click()
        // .get(VARIANTS_SELECTORS.nextButton)
        // .click()
        // .get(VARIANTS_SELECTORS.priceInput)
        // .type(10)
        // .get(`[name*='${warehouseId}']`)
        // .click()
        // .get(VARIANTS_SELECTORS.nextButton)
        // .click()
        // .get(VARIANTS_SELECTORS.skuInput)
        // .type(name)
        // .get(VARIANTS_SELECTORS.nextButton)
        // .click()
        // .waitForGraph("ProductVariantBulkCreate")
        cy.getProductDetails(product.id, defaultChannel.slug).then(
          productDetailsResp => {
            expect(productDetailsResp.body[0].data.product.name).to.equal(name);
            expect(
              productDetailsResp.body[0].data.product.variants[0].pricing.price
                .gross.amount
            ).to.equal(10);
          }
        );
      });
  });
  it("should create several variants", () => {
    const name = `${startsWith}${faker.random.number()}`;
    const secondVariantSku = `${startsWith}${faker.random.number()}`;
    productUtils
      .createProductInChannel(
        name,
        productType.id,
        attribute.id,
        category.id,
        defaultChannel.id,
        true,
        true,
        true,
        warehouse.id,
        10,
        10
      )
      .then(() => {
        cy.visit(`${urlList.products}${productId}`);
        variantsSteps.createVariant(secondVariantSku, warehouse.name);
        // .get(PRODUCTS_SELECTORS.addVariantsButton)
        // .click()
        // .get(VARIANTS_SELECTORS.attributeSelector)
        // .click()
        // .get(VARIANTS_SELECTORS.attributeOption)
        // .first()
        // .click()
        // .get(VARIANTS_SELECTORS.priceInput)
        // .type(10)
        // .get(VARIANTS_SELECTORS.skuInputInAddVariant)
        // .type(secondVariantSku)
        // .get(VARIANTS_SELECTORS.addWarehouseButton)
        // .click()
        // .get(VARIANTS_SELECTORS.warehouseOption)
        // .contains(name)
        // .click()
        // .get(VARIANTS_SELECTORS.saveButton)
        // .click()
      })
      .then(() => cy.getProductDetails(productId, defaultChannel.slug))
      .then(productDetailsResp => {
        expect(productDetailsResp.body[0].data.product.name).to.equal(name);
        expect(productDetailsResp.body[0].data.product.variants).to.have.length(
          2
        );
        expect(
          productDetailsResp.body[0].data.product.variants[0].pricing.price
            .gross.amount
        ).to.equal(10);
        expect(
          productDetailsResp.body[0].data.product.variants[1].pricing.price
            .gross.amount
        ).to.equal(10);
      });
  });
  it("should create variant for many channels", () => {
    const name = `${startsWith}${faker.random.number()}`;
    let newChannel;
    channels
      .createChannel(true, name, name, "PLN")
      .then(resp => {
        newChannel = resp.body.data.createdChannel.channel;
        product.createProduct(attribute.id, name, productType.id, category.id);
      })
      .then(resp => {
        const createdProduct = resp.body.data.productCreate.product;
        product.updateChannelInProduct(
          createdProduct.id,
          defaultChannel.id,
          true,
          true,
          true
        );
        product.updateChannelInProduct(
          createdProduct.id,
          newChannel.id,
          true,
          true,
          true
        );
      });
  });
});
