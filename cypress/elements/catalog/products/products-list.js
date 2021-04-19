export const PRODUCTS_LIST = {
  productsList: "[data-test-id][data-test='id']",
  productsNames: "[data-test='name']",
  createProductBtn: "[data-test='add-product']",
  searchProducts: "[placeholder='Search Products...']",
  emptyProductRow: "[class*='Skeleton']",
  productRowElements: {
    name: '[data-test="name"]',
    type: '[data-test="product-type"]',
    availability: '[data-test="availability"]',
    price: '[data-test="price"]'
  },
  tableHeaders: {
    name: "[data-test-id='colNameHeader']",
    type: "[data-test-id='colTypeHeader']",
    availability: "[data-test-id='colAvailabilityHeader']",
    price: "[data-test-id='colPriceHeader']"
  },
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
