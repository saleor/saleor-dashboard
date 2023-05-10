/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { urlList } from "../../../fixtures/urlList";

describe("As an user I should be able switch between product views", () => {
  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
    cy.visit(urlList.products);
  });

  it(
    "should be able to switch to products image view TC: SALEOR_2610",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      cy.get(PRODUCTS_LIST.tileViewButton).click();
      cy.get(PRODUCTS_LIST.tileProductsView).should("be.visible");
      cy.get(PRODUCTS_LIST.dataGridTable).should("not.exist");
    },
  );
});
