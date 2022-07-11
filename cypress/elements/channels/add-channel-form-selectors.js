export const ADD_CHANNEL_FORM_SELECTORS = {
  channelName: "[name='name']",
  slug: "[name='slug']",
  currency: "[data-test-id='channel-currency-select-input']",
  currencyOptions: "[data-test-id='single-autocomplete-select-option']",
  saveButton: "[data-test='button-bar-confirm']",
  backToChannelsList: "[data-test-id='app-header-back-button']",
  currencyValidationMessage: "[data-test-id='currency-text-input-helper-text']",
  slugValidationMessage: "[data-test-id='slug-text-input-helper-text']",
  currencyAutocompleteDropdown:
    "[data-test-id='single-autocomplete-select-option'][data-test-type='custom']",
  addShippingZoneButton: '[data-test-id="shipping-add-button"]',
  addWarehouseButton: '[data-test-id="warehouse-add-button"]',
  shippingAutocompleteSelect: "[data-test-id='shipping-auto-complete-select']",
  warehouseAutocompleteSelect:
    "[data-test-id='warehouse-auto-complete-select']",
  countryAutocompleteInput: '[data-test-id="country-select-input"]',
};
