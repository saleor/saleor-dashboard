export const VOUCHERS_SELECTORS = {
  createVoucherButton: "[data-test-id='create-voucher']",
  generateCode: "[data-test-id='generate-code']",
  discountRadioButtons: "[name='discountType']",
  percentageDiscountRadioButton: `${discountRadioButtons}[value='PERCENTAGE']`,
  discountValueInputs: "[name='value']"
};
