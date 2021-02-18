/* eslint-disable sort-keys */
export const PRODUCTS_SELECTORS = {
  productsList: "[data-test-id][data-test='id']",
  products: "[data-test='submenu-item-label'][data-test-id='products']",
  createProductBtn: "[data-test='add-product']",
  productNameInput: "[name='name']",
  productTypeInput: "[data-test='product-type']",
  categoryInput: "[data-test='category']",
  categoryItem: "[data-test='singleautocomplete-select-option']",
  autocompleteDropdown: "[data-test='autocomplete-dropdown']",
  firstCategoryItem: "#downshift-0-item-0",
  visibleRadioBtn: "[name='isPublished']",
  saveBtn: "[data-test='button-bar-confirm']",
  confirmationMsg: "[data-test='notification-success']",
  channelAvailabilityItem: "[data-test='channel-availability-item']",
  availableManageButton:
    "[data-test-id='channels-availiability-manage-button']",
  channelsAvailabilityForm:
    "[data-test-id='manage-products-channels-availiability-list']",
  emptyProductRow: "[class*='Skeleton']"
};
