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
          const productId = resp.body.data.productCreate.product.id;
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
            .get(VARIANTS_SELECTORS.nextButton)
            .click()
            .get(VARIANTS_SELECTORS.priceinput)
            .type(10)
            .get(`[name*='${warehouseId}']`)
            .click()
            .get(VARIANTS_SELECTORS.nextButton)
            .click()
            .get(VARIANTS_SELECTORS.skuInput)
            .type(name)
            .get(VARIANTS_SELECTORS.nextButton)
            .click()

            .get("@shopUrl")
            .then(shopUrl => {
              cy.visit(shopUrl);
              searchSteps.searchFor(name);
              cy.get(SEARCH_SELECTORS.productItem).contains(name);
            });
        });
    });
  });
});
