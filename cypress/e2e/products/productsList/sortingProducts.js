/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { urlList } from "../../../fixtures/urlList";
import { expectProductsSortedBy } from "../../../support/api/utils/products/productsListUtils";

describe("Sorting products", () => {
  const sortByList = ["name", "type"];
  sortByList.forEach(sortBy => {
    it(
      `Sorting by ${sortBy}`,
      { tags: ["@productsList", "@allEnv", "@stable"] },
      () => {
        cy.clearSessionData()
          .loginUserViaRequest()
          .visit(urlList.products);
        cy.expectSkeletonIsVisible();
        cy.get(SHARED_ELEMENTS.header).should("be.visible");
        if (sortBy !== "name") {
          cy.get(PRODUCTS_LIST.tableHeaders[sortBy])
            .click()
            .waitForProgressBarToNotExist();
        }
        expectProductsSortedBy(sortBy);
        cy.addAliasToGraphRequest("ProductList")
          .get(PRODUCTS_LIST.tableHeaders[sortBy])
          .click()
          .waitForProgressBarToNotExist()
          .waitForRequestAndCheckIfNoErrors("@ProductList");
        expectProductsSortedBy(sortBy, false);
      },
    );
  });
});
