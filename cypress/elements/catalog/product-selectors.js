/* eslint-disable sort-keys */
export const PRODUCTS_SELECTORS = {
  productsList: "[data-test='id']",
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
    "div[class*='Grid-root'] > div:nth-child(2) > div[class='MuiPaper-root MuiPaper-elevation0 MuiCard-root MuiPaper-rounded'] > div > div[class*='CardTitle-toolbar'] > button",
  channelsAvailabilityForm: "[class*='ChannelsAvailabilityContent-scroll']"
};
