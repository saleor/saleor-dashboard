export const GIFT_CARD_DIALOG = {
  amountInput: '[name="balanceAmount"]',
  currencySelectButton: '[id="mui-component-select-balanceCurrency"]',
  currenciesOptions: '[data-test="selectFieldOption"]',
  expirationOptions: {
    setExpiryDateCheckbox: '[name="expirySelected"]',
    neverExpireRadioButton: '[value="NEVER_EXPIRE"]',
    expiryPeriodRadioButton: '[value="EXPIRY_PERIOD"]',
    expiryDateRadioButton: '[value="EXPIRY_DATE"]',
    expiryPeriodAmount: '[name="expiryPeriodAmount"]',
    expiryPeriodTypeButton: '[id*="select-expiryPeriodType"]',
    expiryPeriodMonthType: '[data-test-id="MONTH"]',
    expiryDateInput: '[name="expiryDate"]'
  },
  noteInput: '[name="note"]',
  cardCodeText: '[data-test-id="cardCode"]',
  tagInput: '[data-test-id="gift-card-tag-select-field"]'
};
