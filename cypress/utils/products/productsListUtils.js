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
    const newProductArray = productsArray.slice();
    const sortedProductsArray = inAscOrder
      ? newProductArray.sort()
      : newProductArray.sort().reverse();
    expect(productsArray).to.be.deep.eq(sortedProductsArray);
  });
}
