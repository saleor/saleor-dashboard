export const ADD_CHANNEL_FORM_SELECTORS = {
  channelName: "[name='name']",
  slug: "[name='slug']",
  currency: "[data-test-id='channel-currency-select-input']",
  currencyOptions: "[data-test='singleautocomplete-select-option']",
  saveButton: "[data-test='button-bar-confirm']",
  backToChannelsList: "[data-test-id='app-header-back-button']",
  currencyValidationMessage: "[data-testid='currency-text-input-helper-text']",
  slugValidationMessage: "[data-testid='slug-text-input-helper-text']",
  currencyAutocompleteDropdown:
    "[data-test='singleautocomplete-select-option'][data-test-type='custom']",
  addShippingZoneButton: '[data-test-id="add-shipping-zone-button"]',
  shippingAutocompleteSelect: "[data-test-id='shippingAutoCompleteSelect']"
};
