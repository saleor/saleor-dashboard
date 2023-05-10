/// <reference types="cypress"/>

import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { urlList } from "../../../fixtures/urlList";
import { changeToTileView } from "../../../support/pages/catalog/products/productsListPage";

describe("As an user I should be able switch between product views", () => {
  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
    cy.visit(urlList.products);
  });

  it(
    "should be able to switch to products image view TC: SALEOR_2610",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      changeToTileView();
      cy.checkIfElementIsVisible(PRODUCTS_LIST.tileProductsView)
      cy.get(PRODUCTS_LIST.dataGridTable).should("not.exist");
    },
  );
});
