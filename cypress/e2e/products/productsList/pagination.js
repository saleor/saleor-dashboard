/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import { PAGINATION } from "../../../elements";
import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { urlList } from "../../../fixtures/urlList";
import { ensureCanvasStatic } from "../../../support/customCommands/sharedElementsOperations/canvas";

describe("As an admin I should be able to manage products table", () => {
  beforeEach(() => {
    cy.loginUserViaRequest();
    cy.visit(urlList.products);
  });

  it(
    "should be able go to the next page and back on product list. TC: SALEOR_2605",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable).then(() => {
        cy.assertCanvasRowsNumber(PRODUCTS_LIST.dataGridTable, 21);
      });
      cy.get(PAGINATION.previousPagePaginationButton).should("be.disabled");

      cy.addAliasToGraphRequest("ProductList")
        .get(PAGINATION.nextPagePaginationButton)
        .should("not.be.disabled")
        .click()
        .wait("@ProductList");

      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable).then(() => {
        cy.assertCanvasRowsNumber(PRODUCTS_LIST.dataGridTable, 21);
      });
      cy.get(PAGINATION.previousPagePaginationButton)
        .should("not.be.disabled")
        .click()
        .wait("@ProductList")
        .get(PAGINATION.previousPagePaginationButton)
        .should("be.disabled")
        .get(PAGINATION.nextPagePaginationButton)
        .should("not.be.disabled");
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable).then(() => {
        cy.get(PRODUCTS_LIST.dataGridTable)
          .find("tr")
          .should("have.length.above", 10);
      });
    },
  );

  it(
    "should see correct amount of products per page. TC: SALEOR_2606",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      cy.addAliasToGraphRequest("ProductList");
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable).then(() => {
        cy.getRowNumberButton().should("contain.text", 20);
        cy.assertCanvasRowsNumber(PRODUCTS_LIST.dataGridTable, 21);
      });
      cy.clickRowNumberButton();
      cy.getRowSelectorWithNumber(30).click().wait("@ProductList");
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable).then(() => {
        cy.get(PRODUCTS_LIST.resultsOnPageSelect).should("contain.text", 30);
        cy.assertCanvasRowsNumber(PRODUCTS_LIST.dataGridTable, 31);
      });
    },
  );
});
