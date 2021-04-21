import { PRODUCTS_LIST } from "../../elements/catalog/products/products-list";
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
  getDisplayedColumnArray(columnName).then(productsArray => {
    let sortedProductsArray = productsArray.slice();
    if (columnName !== "price") {
      sortedProductsArray.sort();
      if (!inAscOrder) {
        sortedProductsArray.reverse();
      }
    } else {
      sortedProductsArray = getSortedPriceColumn(
        sortedProductsArray,
        inAscOrder
      );
    }
    expect(productsArray).to.be.deep.eq(sortedProductsArray);
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
