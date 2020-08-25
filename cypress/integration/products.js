import { LEFT_MENU_SELECTORS } from "../elements/account/left-menu/left-menu-selectors";
import { LOGIN_SELECTORS } from "../elements/account/login-selectors";

// <reference types="cypress" />
describe("Products", () => {
  beforeEach(() => {
    cy.clearSessionData();
    cy.visit("/");
    cy.loginUser();
  });

  it("should add new visible product", () => {
    cy.get(LEFT_MENU_SELECTORS.catalog)
      .click()
      .get(LEFT_MENU_SELECTORS.PRODUCTS_SELECTORS.products)
      .click()
      .get(LEFT_MENU_SELECTORS.PRODUCTS_SELECTORS.createProductBtn)
      .click()
      .get(LEFT_MENU_SELECTORS.PRODUCTS_SELECTORS.productNameInput)
      .click()
      .type("Visible test product")
      .get(LEFT_MENU_SELECTORS.PRODUCTS_SELECTORS.productTypeInput)
      .click()
      .type("Cushion{'enter'}")
      .get(LEFT_MENU_SELECTORS.PRODUCTS_SELECTORS.categoryInput)
      .click()
      .get(LEFT_MENU_SELECTORS.PRODUCTS_SELECTORS.categoryDropdown)
      .first()
      .click()
      .get(LEFT_MENU_SELECTORS.PRODUCTS_SELECTORS.visibleRadioBtn)
      .click()
      .get(LEFT_MENU_SELECTORS.PRODUCTS_SELECTORS.saveBtn)
      .click()
      .get(LEFT_MENU_SELECTORS.PRODUCTS_SELECTORS.confirmationMsg)
      .contains("Product save");
  });
});
