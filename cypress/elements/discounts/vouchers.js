export const VOUCHERS_SELECTORS = {
  createVoucherButton: "[data-test-id='create-voucher']",
  voucherCodeInput: "[name='code']",
  discountRadioButtons: "[name='discountType']",
  percentageDiscountRadioButton:
    "[name='discountType'][value='VALUE_PERCENTAGE']",
  fixedDiscountRadioButton: "[name='discountType'][value='VALUE_FIXED']",
  shippingDiscountRadioButton: "[name='discountType'][value='SHIPPING']",
  discountValueInputs: "[name='value']",
  startDateInput: '[name="startDate"]',
  endDateInput: '[name="endDate"]',
  hasEndDateCheckbox: '[name="hasEndDate"]',
  endTimeInput: '[name="endTime"]',
  assignCountryButton: '[data-test-id="assign-country"]',
  countriesDropdownIcon: '[data-test-id="countries-drop-down-icon"]',
  limits: {
    usageLimitCheckbox: '[data-test-id="has-usage-limit"]',
    usageLimitTextField: '[data-test-id="usage-limit"]',
    applyOncePerCustomerCheckbox: '[data-test-id="apply-once-per-customer"]',
    onlyForStaffCheckbox: '[data-test-id="only-for-staff"]'
  },
  requirements: {
    minOrderValueCheckbox: '[name="requirementsPicker"][value="ORDER"]',
    minAmountOfItemsCheckbox: '[name="requirementsPicker"][value="ITEM"]',
    minCheckoutItemsQuantityInput: '[name="minCheckoutItemsQuantity"]',
    minOrderValueInput: '[name="minSpent"]'
  }
};
