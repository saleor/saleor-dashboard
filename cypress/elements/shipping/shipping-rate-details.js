export const SHIPPING_RATE_DETAILS = {
  inputName: "[name='name']",
  priceInput: "[name='price']",
  includePostalCodesCheckbox: '[value="INCLUDE"]',
  excludePostalCodesCheckbox: '[value="EXCLUDE"]',
  addPostalCodesButton: '[data-test="add-postal-code-range"]',
  postalCodesForm: {
    min: '[name="min"]',
    max: '[name="max"]'
  },
  maxWeightInput: '[name*="maxValue"]',
  minWeightInput: '[name*="minValue"]',
  minDeliveryTimeInput: '[name="minDays"]',
  maxDeliveryTimeInput: '[name="maxDays"]',
  restrictWeightLimitCheckbox: '[name="orderValueRestricted"]'
};
