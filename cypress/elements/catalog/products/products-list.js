export const PRODUCTS_LIST = {
  productsList: "[data-test-id][data-test='id']",
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
  }
};
