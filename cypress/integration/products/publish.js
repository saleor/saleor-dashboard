import faker from "faker";

import ShopInfo from "../../apiRequests/ShopInfo";
import { PRODUCTS_SELECTORS } from "../../elements/catalog/product-selectors";
import { SEARCH_SELECTORS } from "../../elements/frontend-elements/search-selectors";
import SearchSteps from "../../steps/frontendSteps/searchSteps";
import { URL_LIST } from "../../url/url-list";
import ChannelsUtils from "../../utils/channelsUtils";
import ProductsUtils from "../../utils/productsUtils";

// <reference types="cypress" />
describe("Products", () => {
  const channelsUtils = new ChannelsUtils();
  const productsUtils = new ProductsUtils();
  const searchSteps = new SearchSteps();

  const shopInfo = new ShopInfo();

  const startsWith = "Cy-";
  const name = `${startsWith}${faker.random.number()}`;
  let productTypeId;
  let attributeId;
  let categoryId;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProducts(startsWith);
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
  xit("should display on frontend only published products", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    channelsUtils.getDefaultChannel().then(defaultChannel => {
      productsUtils
        .createProductInChannel(
          productName,
          productTypeId,
          attributeId,
          categoryId,
          defaultChannel.id,
          false,
          false
        )
        .then(() => {
          cy.visit(`${URL_LIST.products}${productsUtils.getCreatedProductId()}`)
            .get(PRODUCTS_SELECTORS.assignedChannels)
            .click()
            .get(PRODUCTS_SELECTORS.publishedRadioButton)
            .contains("Opublikowany")
            .click()
            .get(PRODUCTS_SELECTORS.saveBtn)
            .click()
            .waitForGraph("ProductChannelListingUpdate")
            .get("@shopUrl")
            .then(shopUrl => {
              cy.visit(shopUrl);
              searchSteps.searchFor(name);
              cy.get(SEARCH_SELECTORS.productItem).contains(name);
            });
        });
    });
  });
  it("shouldn't display not published product for unlogged user", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    channelsUtils.getDefaultChannel().then(defaultChannel => {
      productsUtils
        .createProductInChannel(
          productName,
          productTypeId,
          attributeId,
          categoryId,
          defaultChannel.id,
          true,
          false
        )
        .then(() => {
          cy.visit(`${URL_LIST.products}${productsUtils.getCreatedProductId()}`)
            .get(PRODUCTS_SELECTORS.assignedChannels)
            .click()
            .get(PRODUCTS_SELECTORS.publishedRadioButton)
            .contains("Nie opublikowano")
            .click()
            .get(PRODUCTS_SELECTORS.saveBtn)
            .click()
            .waitForGraph("ProductChannelListingUpdate")
            .get("@shopUrl")
            .then(shopUrl => {
              cy.visit(shopUrl);
              searchSteps.searchFor(name);
              cy.get(SEARCH_SELECTORS.productItem).should("not.exist");
            });
        });
    });
  });
  xit("should display not published product for staff member", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    channelsUtils.getDefaultChannel().then(defaultChannel => {
      productsUtils
        .createProductInChannel(
          productName,
          productTypeId,
          attributeId,
          categoryId,
          defaultChannel.id,
          true,
          false
        )
        .then(() => {
          cy.visit(`${URL_LIST.products}${productsUtils.getCreatedProductId()}`)
            .get(PRODUCTS_SELECTORS.assignedChannels)
            .click()
            .get(PRODUCTS_SELECTORS.publishedRadioButton)
            .contains("Nie opublikowano")
            .click()
            .get(PRODUCTS_SELECTORS.saveBtn)
            .click()
            .waitForGraph("ProductChannelListingUpdate")
            .get("@shopUrl")
            .then(shopUrl => {
              cy.visit(shopUrl)
                .loginInShop()
                .then(() => {
                  searchSteps.searchFor(name);
                  cy.get(SEARCH_SELECTORS.productItem).contains(name);
                });
            });
        });
    });
  });
});
