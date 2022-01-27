export const VOUCHERS_SELECTORS = {
  createVoucherButton: "[data-test-id='create-voucher']",
  voucherCodeInput: "[name='code']",
  discountRadioButtons: "[name='discountType']",
  percentageDiscountRadioButton:
    "[name='discountType'][value='VALUE_PERCENTAGE']",
  fixedDiscountRadioButton: "[name='discountType'][value='VALUE_FIXED']",
  shippingDiscountRadioButton: "[name='discountType'][value='SHIPPING']",
  discountValueInputs: "[name='value']",
  limits: {
    usageLimitCheckbox: '[data-test-id="has-usage-limit"]',
    usageLimitTextField: '[data-test-id="usage-limit"]',
    applyOncePerCustomerCheckbox: '[data-test-id="apply-once-per-customer"]',
    onlyForStaffCheckbox: '[data-test-id="only-for-staff"]'
  }
};
