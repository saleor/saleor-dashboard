// <reference types="cypress" />
import { PRODUCTS_SELECTORS } from "../../elements/catalog/products/product-selectors";
import { urlList } from "../../url/urlList";

describe("Products", () => {
  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should add new visible product", () => {
    cy.visit(urlList.products)
      .get(PRODUCTS_SELECTORS.createProductBtn)
      .click()
      .get(PRODUCTS_SELECTORS.productNameInput)
      .click()
      .type("Visible test product")
      .get(PRODUCTS_SELECTORS.productTypeInput)
      .click()
      .get(PRODUCTS_SELECTORS.autocompleteDropdown) // trying to fill autocomplete before dropdown will cause error
      .get(PRODUCTS_SELECTORS.productTypeInput)
      .click()
      .type("Cushion")
      .get(PRODUCTS_SELECTORS.categoryItem)
      .should("have.length", 1)
      .get(PRODUCTS_SELECTORS.firstCategoryItem)
      .click()
      .get(PRODUCTS_SELECTORS.categoryInput)
      .click()
      .get(PRODUCTS_SELECTORS.categoryItem)
      .first()
      .click()
      .get(PRODUCTS_SELECTORS.channelAvailabilityItem)
      .first()
      .click()
      .get(PRODUCTS_SELECTORS.visibleRadioBtn)
      .first()
      .click()
      .get(PRODUCTS_SELECTORS.saveBtn)
      .click()
      .get(PRODUCTS_SELECTORS.confirmationMsg)
      .contains("Product created");
  });
});
