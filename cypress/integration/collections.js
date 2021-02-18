// <reference types="cypress" />
import faker from "faker";

import { COLLECTION_SELECTORS } from "../elements/catalog/collection-selectors";
import { ASSIGN_PRODUCTS_SELECTORS } from "../elements/catalog/products/assign-products-selectors";
import { MENAGE_CHANNEL_AVAILABILITY_FORM } from "../elements/channels/menage-channel-availability-form";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { urlList } from "../url/urlList";
import ChannelsUtils from "../utils/channelsUtils";
import CollectionsUtils from "../utils/collectionsUtils";
import ProductsUtils from "../utils/productsUtils";

describe("Collections", () => {
  const channelsUtils = new ChannelsUtils();
  const productsUtils = new ProductsUtils();
  const collectionsFrontUtils = new CollectionsUtils();

  const startsWith = "Cy-";
  const name = `${startsWith}${faker.random.number()}`;

  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    channelsUtils
      .getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        productsUtils.createTypeAttributeAndCategoryForProduct(name);
      })
      .then(() => {
        const attribute = productsUtils.getAttribute();
        const productType = productsUtils.getProductType();
        const category = productsUtils.getCategory();
        productsUtils.createProductInChannel(
          name,
          defaultChannel.id,
          null,
          null,
          productType.id,
          attribute.id,
          category.id,
          1
        );
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
    cy.visit(urlList.collections);
  });

  it("should not display hidden collections", () => {
    const collectionName = `${startsWith}${faker.random.number()}`;

    cy.get(COLLECTION_SELECTORS.createCollectionButton)
      .click()
      .get(COLLECTION_SELECTORS.nameInput)
      .type(collectionName)
      .get(MENAGE_CHANNEL_AVAILABILITY_FORM.channelsMenageButton)
      .click()
      .get(MENAGE_CHANNEL_AVAILABILITY_FORM.allChannelsCheckbox)
      .click();
    cy.contains(
      MENAGE_CHANNEL_AVAILABILITY_FORM.channelRow,
      defaultChannel.name
    )
      .find(MENAGE_CHANNEL_AVAILABILITY_FORM.channelCheckbox)
      .click()
      .get(BUTTON_SELECTORS.submit)
      .click()
      .get(MENAGE_CHANNEL_AVAILABILITY_FORM.channelsAvailabilityItem)
      .click()
      .get(
        `${MENAGE_CHANNEL_AVAILABILITY_FORM.publishedCheckbox}${MENAGE_CHANNEL_AVAILABILITY_FORM.radioButtonsValueFalse}`
      )
      .click()
      .waitForGraph("CreateCollection")
      .get(COLLECTION_SELECTORS.saveButton)
      .click();
    collectionsFrontUtils.getCreatedCollection().then(collection => {
      cy.get(COLLECTION_SELECTORS.addProductButton)
        .click()
        .get(ASSIGN_PRODUCTS_SELECTORS.searchInput)
        .type(name);
      cy.contains(ASSIGN_PRODUCTS_SELECTORS.tableRow, name)
        .find(ASSIGN_PRODUCTS_SELECTORS.checkbox)
        .click()
        .get(ASSIGN_PRODUCTS_SELECTORS.submitButton)
        .click()
        .loginInShop();
      collectionsFrontUtils.isCollectionVisible(
        collection.id,
        defaultChannel.slug
      );
    });
  });
  // xit("should display collections", () => {
  //     createVisibleCollection
  //     addProductToCollection
  //     checkIfCollectionIsNotDisplayed
  // });
  // xit("should not display unavailable collections", () => {
  //     createunavailableCollection
  //     addProductToCollection
  //     checkIfCollectionIsNotDisplayed
  // });
  // xit("should display products hidden in listing only in collection", () => {
  //     createHiddenInListingsProduct
  //     createVisibleCollection
  //     addProductToCollection
  //     checkIfCollectionIsNotDisplayed
  // });
});
