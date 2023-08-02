/// <reference types="cypress"/>

import {
  PRODUCTS_LIST,
} from "../../../elements/catalog/products/products-list";
import { urlList } from "../../../fixtures/urlList";
import {
  changeToDatagridView,
  changeToTileView,
} from "../../../support/pages/catalog/products/productsListPage";

describe("As an user I should be able switch between product views", () => {
  beforeEach(() => {
    cy.loginUserViaRequest().then(() => {
      // set notifiedAboutNavigator to make navigator banner gone from the start - banner was covering needed elements during test
      window.localStorage.setItem("notifiedAboutNavigator", "true");
    });
    cy.visit(urlList.products);
  });

  it(
    "should be able to switch between products view TC: SALEOR_2610",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      cy.get(PRODUCTS_LIST.datagridViewButton)
        .invoke("attr", "data-state")
        .should("eq", "checked");
      changeToTileView();
      cy.checkIfElementIsVisible(PRODUCTS_LIST.tileProductsView);
      cy.get(PRODUCTS_LIST.dataGridTable).should("not.exist");
      changeToDatagridView();
      cy.checkIfElementIsVisible(PRODUCTS_LIST.dataGridTable);
      cy.get(PRODUCTS_LIST.tileProductsView).should("not.exist");
    },
  );
});
