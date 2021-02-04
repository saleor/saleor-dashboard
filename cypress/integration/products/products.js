import faker from "faker";

import Channels from "../../apiRequests/Channels";
import { LEFT_MENU_SELECTORS } from "../../elements/account/left-menu/left-menu-selectors";
import { PRODUCTS_SELECTORS } from "../../elements/catalog/product-selectors";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { URL_LIST } from "../../url/url-list";
import ChannelsUtils from "../../utils/channelsUtils";
import ProductsUtils from "../../utils/productsUtils";

// <reference types="cypress" />
describe("Products", () => {
  const channels = new Channels();
  const channelsUtils = new ChannelsUtils();
  const productsUtils = new ProductsUtils();

  const startsWith = "Cy-";

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProducts(startsWith);
    channelsUtils.deleteChannels(startsWith);
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  xit("should add new visible product", () => {
    cy.visit("/")
      .get(LEFT_MENU_SELECTORS.catalog)
      .click()
      .get(PRODUCTS_SELECTORS.products)
      .click()
      .get(PRODUCTS_SELECTORS.createProductBtn)
      .click()
      .get(PRODUCTS_SELECTORS.productNameInput)
      .click()
      .type("Visible test product")
      .get(PRODUCTS_SELECTORS.productTypeInput)
      .click()
      .get(PRODUCTS_SELECTORS.autocompleteDropdown) // trying to fill autocomplete before dropdown will cause error
      .get(PRODUCTS_SELECTORS.productTypeInput)
      .click()
      .type("Cushion")
      .get(PRODUCTS_SELECTORS.categoryItem)
      .should("have.length", 1)
      .get(PRODUCTS_SELECTORS.firstCategoryItem)
      .click()
      .get(PRODUCTS_SELECTORS.categoryInput)
      .click()
      .get(PRODUCTS_SELECTORS.categoryItem)
      .first()
      .click()
      .get(PRODUCTS_SELECTORS.channelAvailabilityItem)
      .first()
      .click()
      .get(PRODUCTS_SELECTORS.visibleRadioBtn)
      .first()
      .click()
      .get(PRODUCTS_SELECTORS.saveBtn)
      .click()
      .get(PRODUCTS_SELECTORS.confirmationMsg)
      .contains("Product created");
  });
  it("should display correct availibility for product in channel", () => {
    const name = `${startsWith}${faker.random.number()}`;
    cy.fixture("addresses").then(json => {
      channels.createChannel(true, name, name, json.plAddress.currency);
      productsUtils.createTypeAttributeAndCategoryForProduct(name).then(() => {
        const productTypeId = productsUtils.getProductTypeId();
        const attributeId = productsUtils.getAttributeId();
        const categoryId = productsUtils.getCategoryId();
        productsUtils.createProduct(
          name,
          attributeId,
          productTypeId,
          categoryId
        );
        cy.visit(URL_LIST.products)
          .get(PRODUCTS_SELECTORS.searchProducts)
          .type(name)
          .get(PRODUCTS_SELECTORS.productsList)
          .contains(name)
          .click()
          .get(PRODUCTS_SELECTORS.availableManageButton)
          .click()
          .get(PRODUCTS_SELECTORS.channelsAvailabilityForm)
          .contains(name)
          .click()
          .get(BUTTON_SELECTORS.submit)
          .click()
          .get(PRODUCTS_SELECTORS.saveBtn)
          .click()
          .get(PRODUCTS_SELECTORS.goBackButton)
          .click()
          .get(PRODUCTS_SELECTORS.searchProducts)
          .type(name)
          .get(PRODUCTS_SELECTORS.productsList)
          .contains(name)
          .parentsUntil("tbody")
          .find(PRODUCTS_SELECTORS.channelAvailabilityColumn)
          .click()
          .get(PRODUCTS_SELECTORS.channelAvailabilityList)
          .contains(name);
      });
    });
  });
});
