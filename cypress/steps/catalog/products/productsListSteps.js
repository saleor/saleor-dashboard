import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import {
  getElementByDataTestId,
  SHARED_ELEMENTS
} from "../../../elements/shared/sharedElements";

export function isNumberOfProductsSameAsInSelectResultsOnPage() {
  let numberOfResults;
  return cy
    .get(PRODUCTS_LIST.productsList)
    .should("be.visible")
    .get(PRODUCTS_LIST.emptyProductRow)
    .should("not.exist")
    .then(() => {
      cy.get(PRODUCTS_LIST.resultsOnPageSelect).invoke("text");
    })
    .then(text => {
      numberOfResults = text;
      getDisplayedColumnArray("name");
    })
    .then(
      productsList => productsList.length === parseInt(numberOfResults, 10)
    );
}
export function getDisplayedColumnArray(columnName) {
  let productsList = new Array();
  return cy
    .get(PRODUCTS_LIST.productsList)
    .each($product => {
      cy.wrap($product)
        .find(PRODUCTS_LIST.productRowElements[columnName])
        .invoke("text")
        .then(productName => {
          productsList = productsList.concat([productName]);
        });
    })
    .then(() => productsList);
}
export function selectFilterOption(filter, optionName) {
  selectFilterBy(filter)
    .get(PRODUCTS_LIST.filters.filterField[filter])
    .find(PRODUCTS_LIST.filters.filterBySearchInput)
    .type(optionName);
  cy.contains(PRODUCTS_LIST.filters.filterOption, optionName)
    .find(BUTTON_SELECTORS.checkbox)
    .click();
  submitFilters();
}
export function selectProductsOutOfStock() {
  cy.get(PRODUCTS_LIST.filters.filterBy.stock)
    .click()
    .get(PRODUCTS_LIST.filters.productsOutOfStockOption)
    .click();
  submitFilters();
}
export function selectFilterBy(filter) {
  return cy
    .get(PRODUCTS_LIST.showFiltersButton)
    .click()
    .get(PRODUCTS_LIST.filters.filterBy[filter])
    .click();
}

export function selectChannel(channelSlug) {
  selectFilterBy("channel");
  cy.get(getElementByDataTestId(channelSlug)).click();
}

function submitFilters() {
  cy.get(BUTTON_SELECTORS.submit)
    .click()
    .get(SHARED_ELEMENTS.progressBar)
    .should("not.exist")
    .get(PRODUCTS_LIST.emptyProductRow)
    .should("not.exist");
}
