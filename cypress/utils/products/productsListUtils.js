export function getDisplayedProductsArray() {
  const productsList = [];
  return get(PRODUCTS_LIST.products)
    .each($product => {
      const product = {};
      PRODUCT_ROW.forEach(key => {
        $product
          .find(key)
          .invoke("text")
          .then(productName => {
            product[key] = productName;
          });
      });
      productsList.push(cy.wrap(product));
    })
    .then(() => productsList);
}
export function expectSortedBy(productsArray, columnName, inAscOrder = true) {
  const productsNames = productsArray.map(product => product[columnName]);
  const sortedArray = inAscOrder
    ? productsNames.sort()
    : productsNames.sort(function(a, b) {
        return b - a;
      });
  expect(productsNames).to.be.eq(sortedArray);
}
