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
  searchProducts: "[placeholder='Search Products...']",
  availableManageButton:
    "[data-test-id='channels-availiability-manage-button']",
  channelsAvailabilityForm:
    "[data-test-id='manage-products-channels-availiability-list']",
  channelAvailabilityColumn:
    "[data-test='availability'][data-test-availability='true']",
  channelAvailabilityList: "ul[role='menu']",
  goBackButton: "[data-test-id='app-header-back-button']",
  assignedChannels: "[data-test='channel-availability-item']",
  publishedRadioButton: "[role=radiogroup]",
  addVariantsButton: "[data-test*='button-add-variant']",
  publishedRadioButtons: "[name*='isPublished']",
  availableForPurchaseRadioButtons: "[name*='isAvailableForPurchase']",
  radioButtonsValueTrue: "[value='true']",
  radioButtonsValueFalse: "[value='false']",
  visibleInListingsButton: "[name*='visibleInListings']",
  emptyProductRow: "[class*='Skeleton']"
};
