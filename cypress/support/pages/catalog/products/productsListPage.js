import { PRODUCTS_LIST } from "../../../../elements/catalog/products/products-list";
import { BUTTON_SELECTORS } from "../../../../elements/shared/button-selectors";
import {
  getElementByDataTestId,
  SHARED_ELEMENTS,
} from "../../../../elements/shared/sharedElements";
import { urlList } from "../../../../fixtures/urlList";
import { expectProductsSortedBy } from "../../../api/utils/products/productsListUtils";

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
      productsList => productsList.length === parseInt(numberOfResults, 10),
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
  cy.get(PRODUCTS_LIST.filters.filterField[filter])
    .contains(PRODUCTS_LIST.filters.filterOption, optionName)
    .find(BUTTON_SELECTORS.checkbox)
    .click();
  submitFilters();
}

export function selectAttributeFilter(attributeSlug, attributeValue) {
  selectFilterByAttribute(attributeSlug);
  cy.get(
    `${getElementByDataTestId(attributeSlug)}${
      PRODUCTS_LIST.filters.filterField.filterField
    }`,
  )
    .find(PRODUCTS_LIST.filters.filterOption)
    .should("be.visible")
    .contains(attributeValue)
    .should("be.visible")
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
  return showFilters()
    .get(PRODUCTS_LIST.filters.filterBy[filter])
    .click();
}

export function selectFilterByAttribute(attributeSlug) {
  return showFilters()
    .get(
      `${getElementByDataTestId(attributeSlug)}${
        SHARED_ELEMENTS.filters.filterGroupActivateCheckbox
      }`,
    )
    .click();
}

export function showFilters() {
  return cy.get(PRODUCTS_LIST.showFiltersButton).click();
}

export function selectChannel(channelSlug) {
  cy.waitForProgressBarToNotExist();
  selectFilterBy("channel");
  cy.get(getElementByDataTestId(channelSlug)).click();
}

export function submitFilters() {
  cy.get(BUTTON_SELECTORS.submit)
    .click()
    .waitForProgressBarToNotExist()
    .get(PRODUCTS_LIST.emptyProductRow)
    .should("not.exist");
}

export function enterProductListPage() {
  cy.visit(urlList.products)
    .expectSkeletonIsVisible()
    .waitForProgressBarToNotExist();
}

export function sortProductsBy(sortBy) {
  expectProductsSortedBy(sortBy);
  cy.addAliasToGraphRequest("ProductList")
    .get(PRODUCTS_LIST.tableHeaders[sortBy])
    .click()
    .waitForProgressBarToNotExist()
    .waitForRequestAndCheckIfNoErrors("@ProductList");
  expectProductsSortedBy(sortBy, false);
}
