/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { urlList } from "../../../fixtures/urlList";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import {
  selectChannel,
  sortProductBy,
  submitFilters,
} from "../../../support/pages/catalog/products/productsListPage";

describe("As an admin I should be able to sort products", () => {
  const sortByList = ["price", "type", "name"];
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
    "should be able to sort products by price. SALEOR_2607",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      selectChannel(defaultChannel.slug);
      submitFilters();
      cy.get(PRODUCTS_LIST.tableHeaders[sortByList[0]])
        .click()
        .waitForProgressBarToNotExist();
      sortProductBy(sortByList[0]);
    },
  );

  it(
    "should be able to sort products by type. SALEOR_2608",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      cy.get(PRODUCTS_LIST.tableHeaders[sortByList[1]])
        .click()
        .waitForProgressBarToNotExist();
      sortProductBy(sortByList[1]);
    },
  );

  it(
    "should be able to sort products by name. SALEOR_2609",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      sortProductBy(sortByList[2]);
    },
  );
});
