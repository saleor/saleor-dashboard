export const PRODUCTS_LIST = {
  productsList: "[data-test-id][data-test='id']",
  productsNames: "[data-test='name']",
  createProductBtn: "[data-test='add-product']",
  searchProducts: "[placeholder='Search Products...']",
  emptyProductRow: "[data-test-id='skeleton']",
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
      category: '[data-test="filterGroupActive"][data-test-id="categories"]',
      collection: '[data-test="filterGroupActive"][data-test-id="collections"]',
      productType:
        '[data-test="filterGroupActive"][data-test-id="productType"]',
      stock: '[data-test="filterGroupActive"][data-test-id="stock"]',
      channel: '[data-test="filterGroupActive"][data-test-id="channel"]'
    },
    filterField: {
      category: '[data-test="filter-field"][data-test-id="categories"]',
      collection: '[data-test="filter-field"][data-test-id="collections"]',
      productType: '[data-test="filter-field"][data-test-id="productType"]',
      stock: '[data-test="filter-field"][data-test-id="stock"]',
      channel: '[data-test="filter-field"][data-test-id="channel"]'
    },
    filterBySearchInput: '[data-test*="filterField"][data-test*="Input"]'
  },
  nextPageButton: "[data-test='button-pagination-next']",
  previousPagePagination: "[data-test='button-pagination-back']",
  resultsOnPageSelect: "[data-test-id='rowNumberSelect']",
  rowNumberOption: "[data-test-id='rowNumberOption']"
};
