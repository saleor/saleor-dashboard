import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";

export function selectFilterOption(filter, optionName) {
  selectFilterBy(filter)
    .get(PRODUCTS_LIST.filters.filterBySearchInput)
    .type(optionName);
  cy.contains(PRODUCTS_LIST.filters.filterOption, optionName)
    .find(BUTTON_SELECTORS.checkbox)
    .click();
  submitFilters();
}
export function selectProductsOutOfStock() {
  selectFilterBy("stock")
    .get(PRODUCTS_LIST.filters.productsOutOfStockOption)
    .click();
  submitFilters();
}
function selectFilterBy(filter) {
  return cy
    .get(PRODUCTS_LIST.showFiltersButton)
    .click()
    .get(PRODUCTS_LIST.filters.filterBy[filter])
    .click();
}
function submitFilters() {
  cy.get(BUTTON_SELECTORS.submit)
    .click()
    .get(SHARED_ELEMENTS.progressBar)
    .should("not.exist")
    .get(PRODUCTS_LIST.emptyProductRow)
    .should("not.exist");
}
