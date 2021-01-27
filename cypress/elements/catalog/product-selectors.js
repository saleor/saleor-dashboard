/* eslint-disable sort-keys */
export const PRODUCTS_SELECTORS = {
  products: "[href='/dashboard/products?']",
  createProductBtn: "[data-test='add-product']",
  productNameInput: "[name='name']",
  productTypeInput: "[data-test='product-type']",
  categoryInput: "[data-test='category']",
  categoryItem: "[data-test='singleautocomplete-select-option']",
  autocompleteDropdown: "[data-test='autocomplete-dropdown']",
  firstCategoryItem: "#downshift-0-item-0",
  visibleRadioBtn: "[name='isPublished']",
  saveBtn: "[data-test='button-bar-confirm']",
  confirmationMsg: "[data-test='notification']"
};
