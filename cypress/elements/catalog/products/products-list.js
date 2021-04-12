export const PRODUCTS_LIST = {
  productsList: "[data-test-id][data-test='id']",
  productsNames: "[data-test='name']",
  createProductBtn: "[data-test='add-product']",
  searchProducts: "[placeholder='Search Products...']",
  emptyProductRow: "[data-test-id='skeleton']",
  showFiltersButton: '[data-test-id="show-filters-button"]',
  filters: {
    filterOption: '[data-test-id="filterOption"]',
    productsOutOfStockOption: '[data-test-id="OUT_OF_STOCK"]',
    filterBy: {
      category: '[data-test-id="categories"]',
      collection: '[data-test-id="collections"]',
      productType: '[data-test-id="productType"]',
      stock: '[data-test-id="stock"]'
    },
    filterBySearchInput: '[data-test*="filterField"][data-test*="Input"]'
  }
};
