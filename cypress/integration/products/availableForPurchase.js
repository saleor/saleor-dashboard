import faker from "faker";

import ShopInfo from "../../apiRequests/ShopInfo";
import { PRODUCTS_SELECTORS } from "../../elements/catalog/product-selectors";
import { CART_SELECTORS } from "../../elements/frontend-elements/cart-selectors";
import { PRODUCTS_DETAILS_SELECTORS } from "../../elements/frontend-elements/product-details-selectors";
import { SEARCH_SELECTORS } from "../../elements/frontend-elements/search-selectors";
import SearchSteps from "../../steps/frontendSteps/searchSteps";
import { URL_LIST } from "../../url/url-list";
import ChannelsUtils from "../../utils/channelsUtils";
import ProductsUtils from "../../utils/productsUtils";
import ShippingUtils from "../../utils/shippingUtils";

// <reference types="cypress" />
describe("Products", () => {
  const shippingUtils = new ShippingUtils();
  const channelsUtils = new ChannelsUtils();
  const productsUtils = new ProductsUtils();
  const searchSteps = new SearchSteps();

  const shopInfo = new ShopInfo();

  const startsWith = "Cy-";
  const name = `${startsWith}${faker.random.number()}`;
  let productTypeId;
  let attributeId;
  let categoryId;
  let defaultChannel;
  let warehouseId;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    shippingUtils.deleteShipping(startsWith);
    productsUtils.deleteProducts(startsWith);

    channelsUtils.getDefaultChannel().then(channel => {
      defaultChannel = channel;
      cy.fixture("addresses").then(json => {
        shippingUtils
          .createShipping(defaultChannel, name, json.plAddress, 10)
          .then(() => {
            warehouseId = shippingUtils.getWarehouseId();
          });
      });
    });
    productsUtils.createTypeAttributeAndCategoryForProduct(name).then(() => {
      productTypeId = productsUtils.getProductTypeId();
      attributeId = productsUtils.getAttributeId();
      categoryId = productsUtils.getCategoryId();
    });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
    shopInfo
      .getShopInfo()
      .its("body.data.shop.domain.url")
      .as("shopUrl");
  });

  it("should be possible to add to cart available for purchase product", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    productsUtils
      .createProductInChannel(
        productName,
        productTypeId,
        attributeId,
        categoryId,
        defaultChannel.id,
        true,
        false,
        true,
        warehouseId,
        10,
        10
      )
      .then(() => {
        const productUrl = `${
          URL_LIST.products
        }${productsUtils.getCreatedProductId()}`;
        cy.visit(productUrl)
          .get(PRODUCTS_SELECTORS.assignedChannels)
          .click()
          .get(PRODUCTS_SELECTORS.publishedRadioButton)
          .contains("Dostępne do zakupu")
          .click()
          .get(PRODUCTS_SELECTORS.saveBtn)
          .click()
          .waitForGraph("ProductChannelListingUpdate")
          .get("@shopUrl")
          .then(shopUrl => {
            cy.visit(shopUrl);
            searchSteps.searchFor(productName);
            cy.get(SEARCH_SELECTORS.productItem)
              .contains(productName)
              .click()
              .get(PRODUCTS_DETAILS_SELECTORS.addToCartButton)
              .click()
              .get(CART_SELECTORS.productInCart)
              .contains(productName);
          });
      });
  });
  it("shouldn't be possible to add to cart not available for purchase product", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    productsUtils
      .createProductInChannel(
        productName,
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
        const productUrl = `${
          URL_LIST.products
        }${productsUtils.getCreatedProductId()}`;
        cy.visit(productUrl)
          .get(PRODUCTS_SELECTORS.assignedChannels)
          .click()
          .get(PRODUCTS_SELECTORS.publishedRadioButton)
          .contains("Niedostępne do zakupu")
          .click()
          .get(PRODUCTS_SELECTORS.saveBtn)
          .click()
          .waitForGraph("ProductChannelListingUpdate")
          .get("@shopUrl")
          .then(shopUrl => {
            cy.visit(shopUrl);
            searchSteps.searchFor(productName);
            cy.get(SEARCH_SELECTORS.productItem)
              .contains(productName)
              .click()
              .get(PRODUCTS_DETAILS_SELECTORS.addToCartButton)
              .should("be.disabled");
          });
      });
  });
});
