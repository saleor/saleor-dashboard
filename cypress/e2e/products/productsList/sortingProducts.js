/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { urlList } from "../../../fixtures/urlList";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import {
  selectChannel,
  sortProductsBy,
  submitFilters,
} from "../../../support/pages/catalog/products/productsListPage";

describe("As an admin I should be able to sort products", () => {
  let defaultChannel;

  beforeEach(() => {
    cy.clearSessionData()
      .loginUserViaRequest()
      .visit(urlList.products)
      .expectSkeletonIsVisible()
      .get(SHARED_ELEMENTS.header)
      .should("be.visible");
  });

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    getDefaultChannel().then(channel => {
      defaultChannel = channel;
    });
  });

  it(
    "should be able to sort products by price. TC: SALEOR_2607",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      selectChannel(defaultChannel.slug);
      submitFilters();
      cy.get(PRODUCTS_LIST.tableHeaders.price)
        .click()
        .waitForProgressBarToNotExist();
      sortProductsBy("price");
    },
  );

  it(
    "should be able to sort products by type. TC: SALEOR_2608",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      cy.get(PRODUCTS_LIST.tableHeaders.type)
        .click()
        .waitForProgressBarToNotExist();
      sortProductsBy("type");
    },
  );

  it(
    "should be able to sort products by name. TC: SALEOR_2609",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      sortProductsBy("name");
    },
  );
});
