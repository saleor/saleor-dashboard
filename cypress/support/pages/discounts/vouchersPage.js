import { VOUCHERS_SELECTORS } from "../../../elements/discounts/vouchers";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { voucherDetailsUrl } from "../../../fixtures/urlList";
import { selectChannelInDetailsPages } from "../channelsPage";

export const discountOptions = {
  PERCENTAGE: VOUCHERS_SELECTORS.percentageDiscountRadioButton,
  FIXED: VOUCHERS_SELECTORS.fixedDiscountRadioButton,
  SHIPPING: VOUCHERS_SELECTORS.shippingDiscountRadioButton
};

export function createVoucher({
  voucherCode,
  voucherValue,
  discountOption,
  channelName
}) {
  cy.get(VOUCHERS_SELECTORS.createVoucherButton).click();
  selectChannelInDetailsPages(channelName);
  cy.get(VOUCHERS_SELECTORS.voucherCodeInput)
    .type(voucherCode)
    .get(discountOption)
    .click();
  if (discountOption !== discountOptions.SHIPPING) {
    cy.get(VOUCHERS_SELECTORS.discountValueInputs).type(voucherValue);
  }
  cy.get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldDisappear();
}

export function setVoucherDate({
  voucherId,
  startDate,
  endDate,
  endTime,
  hasEndDate = false
}) {
  cy.visit(voucherDetailsUrl(voucherId)).waitForProgressBarToNotBeVisible();
  if (startDate) {
    cy.get(VOUCHERS_SELECTORS.startDateInput).type(startDate);
  }
  if (endDate) {
    if (hasEndDate) {
      cy.get(VOUCHERS_SELECTORS.hasEndDateCheckbox).click();
    }
    cy.get(VOUCHERS_SELECTORS.endDateInput)
      .type(endDate)
      .get(VOUCHERS_SELECTORS.endTimeInput)
      .type(endTime);
  }
  cy.addAliasToGraphRequest("VoucherUpdate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .wait("@VoucherUpdate");
}
