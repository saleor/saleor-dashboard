import { PRODUCTS_LIST } from "../../../../elements/catalog/products/products-list";

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
export function expectProductsSortedBy(columnName, inAscOrder = true) {
  let sortedProductsArray;
  let productsArray;

  cy.get(PRODUCTS_LIST.emptyProductRow).should("not.exist");
  getDisplayedColumnArray(columnName)
    .then(productsArrayResp => {
      productsArray = productsArrayResp;
      sortedProductsArray = productsArray.slice();
      if (columnName !== "price") {
        sortedProductsArray = sortedProductsArray.sort((a, b) =>
          a.localeCompare(b, undefined, { ignorePunctuation: true }),
        );
        if (!inAscOrder) {
          sortedProductsArray.reverse();
        }
      } else {
        sortedProductsArray = getSortedPriceColumn(
          sortedProductsArray,
          inAscOrder,
        );
        if (!inAscOrder) {
          sortedProductsArray.reverse();
        }
      }
    })
    .then(() => {
      expect(
        JSON.stringify(productsArray) === JSON.stringify(sortedProductsArray),
      ).to.be.eq(true);
    });
}
function getSortedPriceColumn(productsArray, inAscOrder) {
  return inAscOrder
    ? productsArray.sort(sortColumnByPrice)
    : productsArray.sort(sortColumnByPrice).reverse();
}
function sortColumnByPrice(a, b) {
  return (
    getMinimalPriceFromPriceRangeCell(a) > getMinimalPriceFromPriceRangeCell(b)
  );
}
function getMinimalPriceFromPriceRangeCell(priceRange) {
  const regex = /\d+,\d+/;
  return parseFloat(priceRange.match(regex));
}
