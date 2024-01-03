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
export function filterProductsWithNewFilters(filter, optionName) {
  cy.get(PRODUCTS_LIST.newFilters.showFiltersButton).click();
  cy.get(PRODUCTS_LIST.newFilters.addFilterButton).click();
  cy.get(PRODUCTS_LIST.newFilters.leftInput).click();
  cy.get(PRODUCTS_LIST.newFilters.dropDownOptions).contains(filter).click();
  cy.scrollTo("top");
  cy.get(PRODUCTS_LIST.newFilters.rightInput)
    .click()
    .invoke("attr", "aria-expanded")
    .should("eq", "true");
  cy.get(PRODUCTS_LIST.newFilters.rightInput).type(optionName);
  cy.get(PRODUCTS_LIST.newFilters.dropDownOptions).contains(optionName).click();
  cy.get(PRODUCTS_LIST.newFilters.saveFiltersButton).click();
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
    .click({ force: true });
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
  // react is not as fast as cypress makes it flaky and can not follow with actions on filters
  cy.wait(1000);
  cy.get(getElementByDataTestId(channelSlug)).click();
}

export function submitFilters() {
  cy.get(BUTTON_SELECTORS.submit)
    .scrollIntoView()
    .should("be.visible")
    .click()
    .waitForRequestAndCheckIfNoErrors("@ProductList")
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

export function changeToTileView() {
  cy.clickOnElement(PRODUCTS_LIST.tileViewButton);
}

export function changeToDatagridView() {
  cy.clickOnElement(PRODUCTS_LIST.datagridViewButton);
}
