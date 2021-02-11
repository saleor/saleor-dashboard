import faker from "faker";

import Product from "../apiRequests/Product";
import ShopInfo from "../apiRequests/ShopInfo";
import { PRODUCTS_SELECTORS } from "../elements/catalog/product-selectors";
import { VARIANTS_SELECTORS } from "../elements/catalog/variants-selectors";
import { SEARCH_SELECTORS } from "../elements/frontend-elements/search-selectors";
import SearchSteps from "../steps/frontendSteps/searchSteps";
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
  const searchSteps = new SearchSteps();

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    shippingUtils.deleteShipping(startsWith);
    productUtils.deleteProducts(startsWith);
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
    let warehouseId;
    let defaultChannel;
    let productId;
    channelsUtils.getDefaultChannel().then(channel => {
      cy.fixture("addresses").then(json => {
        defaultChannel = channel;
        shippingUtils
          .createShipping(channel.id, name, json.plAddress, 10)
          .then(() => {
            warehouseId = shippingUtils.getWarehouseId();
          });
      });
    });
    productUtils.createTypeAttributeAndCategoryForProduct(name).then(() => {
      const attributeId = productUtils.getAttributeId();
      const productTypeId = productUtils.getProductTypeId();
      const categoryId = productUtils.getCategoryId();

      product
        .createProduct(attributeId, name, productTypeId, categoryId)
        .then(resp => {
          productId = resp.body.data.productCreate.product.id;
          product.updateChannelInProduct(
            productId,
            defaultChannel.id,
            true,
            true,
            true
          );
          cy.visit(`${urlList.products}${productId}`)
            .get(PRODUCTS_SELECTORS.addVariantsButton)
            .click()
            .get(VARIANTS_SELECTORS.attributeCheckbox)
            .first()
            .click()
            .get(VARIANTS_SELECTORS.nextButton)
            .click()
            .get(VARIANTS_SELECTORS.priceInput)
            .type(10)
            .get(`[name*='${warehouseId}']`)
            .click()
            .get(VARIANTS_SELECTORS.nextButton)
            .click()
            .get(VARIANTS_SELECTORS.skuInput)
            .type(name)
            .get(VARIANTS_SELECTORS.nextButton)
            .click()
            .waitForGraph("ProductVariantBulkCreate")
            // .searchInShop(name).then(searchResp => {
            //   expect(searchResp.body[0].data.products.edges[0].node.name).to.equal(name)
            // })
            .getProductDetails(productId, defaultChannel.slug)
            .then(productDetailsResp => {
              expect(productDetailsResp.body[0].data.product.name).to.equal(
                name
              );
              expect(
                productDetailsResp.body[0].data.product.variants[0].pricing
                  .price.gross.amount
              ).to.equal(10);
            });
        });
    });
  });
  it("should create several variants", () => {
    const name = `${startsWith}${faker.random.number()}`;
    const secondVariantSku = `${startsWith}${faker.random.number()}`;
    let defaultChannel;
    let warehouseId;
    let productId;
    channelsUtils.getDefaultChannel().then(channel => {
      cy.fixture("addresses").then(json => {
        defaultChannel = channel;
        shippingUtils
          .createShipping(channel.id, name, json.plAddress, 10)
          .then(() => {
            warehouseId = shippingUtils.getWarehouseId();
          });
      });
    });
    productUtils.createTypeAttributeAndCategoryForProduct(name).then(resp => {
      const productTypeId = productUtils.getProductTypeId();
      const attributeId = productUtils.getAttributeId();
      const categoryId = productUtils.getCategoryId();
      productUtils
        .createProductInChannel(
          name,
          productTypeId,
          attributeId,
          categoryId,
          defaultChannel.id,
          true,
          true,
          true,
          warehouseId,
          10,
          10
        )
        .then(() => {
          productId = productUtils.getCreatedProductId();
          cy.visit(`${urlList.products}${productId}`)
            .get(PRODUCTS_SELECTORS.addVariantsButton)
            .click()
            .get(VARIANTS_SELECTORS.attributeSelector)
            .click()
            .get(VARIANTS_SELECTORS.attributeOption)
            .first()
            .click()
            .get(VARIANTS_SELECTORS.priceInput)
            .type(10)
            .get(VARIANTS_SELECTORS.skuInputInAddVariant)
            .type(secondVariantSku)
            .get(VARIANTS_SELECTORS.addWarehouseButton)
            .click()
            .get(VARIANTS_SELECTORS.warehouseOption)
            .contains(name)
            .click()
            .get(VARIANTS_SELECTORS.saveButton)
            .click()
            .then(() => {
              cy.getProductDetails(productId, defaultChannel.slug).then(
                productDetailsResp => {
                  expect(productDetailsResp.body[0].data.product.name).to.equal(
                    name
                  );
                  expect(
                    productDetailsResp.body[0].data.product.variants
                  ).to.have.length(2);
                  expect(
                    productDetailsResp.body[0].data.product.variants[0].pricing
                      .price.gross.amount
                  ).to.equal(10);
                  expect(
                    productDetailsResp.body[0].data.product.variants[1].pricing
                      .price.gross.amount
                  ).to.equal(10);
                }
              );
            });
        });
    });
  });
});
