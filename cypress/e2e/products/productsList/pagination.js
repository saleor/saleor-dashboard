/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { urlList } from "../../../fixtures/urlList";
import {
  getDisplayedColumnArray,
  isNumberOfProductsSameAsInSelectResultsOnPage,
} from "../../../support/pages/catalog/products/productsListPage";

describe("As an admin I should be able to manage products table", () => {
  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
    cy.visit(urlList.products);
  });

  it(
    "should be able go to the next page on product list. TC: SALEOR_2605",
    { tags: ["@productsList", "@allEnv"] },
    () => {
      cy.expectSkeletonIsVisible()
        .get(PRODUCTS_LIST.emptyProductRow)
        .should("not.exist")
        .get(PRODUCTS_LIST.previousPagePagination)
        .should("be.disabled");
      let firstPageProducts;
      getDisplayedColumnArray("name").then(
        productsList => (firstPageProducts = productsList),
      );
      cy.addAliasToGraphRequest("ProductList")
        .get(PRODUCTS_LIST.nextPageButton)
        .click()
        .waitForSkeletonToDisappear()
        .get(PRODUCTS_LIST.emptyProductRow)
        .should("not.exist")
        .wait("@ProductList");
      getDisplayedColumnArray("name").then(productList => {
        expect(productList).to.not.equal(firstPageProducts);
      });
      cy.get(PRODUCTS_LIST.previousPagePagination)
        .click()
        .waitForSkeletonToDisappear()
        .get(PRODUCTS_LIST.emptyProductRow)
        .should("not.exist");
      getDisplayedColumnArray("name").then(productsList => {
        expect(
          JSON.stringify(productsList) === JSON.stringify(firstPageProducts),
        ).to.be.true;
      });
    },
  );

  it(
    "should see correct amount of products per page. TC: SALEOR_2606",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      cy.expectSkeletonIsVisible();
      isNumberOfProductsSameAsInSelectResultsOnPage().then(
        isTheSame =>
          expect(isTheSame, "check if number of displayed products is correct")
            .to.be.true,
      );
      cy.get(PRODUCTS_LIST.resultsOnPageSelect)
        .click()
        .get(
          `${PRODUCTS_LIST.rowNumberOption}${BUTTON_SELECTORS.notSelectedOption}`,
        )
        .first()
        .click()
        .waitForProgressBarToNotExist();
      isNumberOfProductsSameAsInSelectResultsOnPage().then(
        isTheSame =>
          expect(
            isTheSame,
            "check if number of displayed products is correct, after changing results number in table footer",
          ).to.be.true,
      );
    },
  );
});
