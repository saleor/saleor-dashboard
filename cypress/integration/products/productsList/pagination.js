/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { urlList } from "../../../fixtures/urlList";
import filterTests from "../../../support/filterTests";
import {
  getDisplayedColumnArray,
  isNumberOfProductsSameAsInSelectResultsOnPage
} from "../../../support/pages/catalog/products/productsListPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Products", () => {
    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
      cy.visit(urlList.products);
    });
    it("Should go to the next page", () => {
      cy.softExpectSkeletonIsVisible();
      cy.get(PRODUCTS_LIST.productsList)
        .should("be.visible")
        .get(PRODUCTS_LIST.emptyProductRow)
        .should("not.exist")
        .get(PRODUCTS_LIST.previousPagePagination)
        .should("be.disabled");
      let firstPageProducts;
      getDisplayedColumnArray("name").then(
        productsList => (firstPageProducts = productsList)
      );
      cy.addAliasToGraphRequest("ProductList")
        .get(PRODUCTS_LIST.nextPageButton)
        .click()
        .waitForProgressBarToNotExist()
        .wait("@ProductList");
      getDisplayedColumnArray("name").then(productList => {
        expect(productList).to.not.equal(firstPageProducts);
      });
      cy.get(PRODUCTS_LIST.previousPagePagination).then($button => {
        expect($button).to.be.enabled;
      });
    });
    it("should displayed correct number of results per page", () => {
      cy.softExpectSkeletonIsVisible();
      isNumberOfProductsSameAsInSelectResultsOnPage().then(
        isTheSame =>
          expect(isTheSame, "check if number of displayed products is correct")
            .to.be.true
      );
      cy.get(PRODUCTS_LIST.resultsOnPageSelect)
        .click()
        .get(
          `${PRODUCTS_LIST.rowNumberOption}${BUTTON_SELECTORS.notSelectedOption}`
        )
        .first()
        .click()
        .waitForProgressBarToNotExist();
      isNumberOfProductsSameAsInSelectResultsOnPage().then(
        isTheSame =>
          expect(
            isTheSame,
            "check if number of displayed products is correct, after changing results number in table footer"
          ).to.be.true
      );
    });
  });
});
