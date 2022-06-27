import { VOUCHERS_SELECTORS } from "../../../elements/discounts/vouchers";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { urlList, voucherDetailsUrl } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { createCheckoutWithVoucher } from "../../api/utils/ordersUtils";
import { selectChannelInDetailsPages } from "../channelsPage";

export const discountOptions = {
  PERCENTAGE: VOUCHERS_SELECTORS.percentageDiscountRadioButton,
  FIXED: VOUCHERS_SELECTORS.fixedDiscountRadioButton,
  SHIPPING: VOUCHERS_SELECTORS.shippingDiscountRadioButton,
};

export function createVoucher({
  voucherCode,
  voucherValue,
  discountOption,
  channelName,
  usageLimit,
  applyOnePerCustomer,
  onlyStaff,
  minOrderValue,
  minAmountOfItems,
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
  if (usageLimit) {
    cy.get(VOUCHERS_SELECTORS.limits.usageLimitCheckbox)
      .click()
      .type(usageLimit);
  }
  if (applyOnePerCustomer) {
    cy.get(VOUCHERS_SELECTORS.limits.applyOncePerCustomerCheckbox).click();
  }
  if (onlyStaff) {
    cy.get(VOUCHERS_SELECTORS.limits.onlyForStaffCheckbox).click();
  }
  if (minOrderValue) {
    cy.get(VOUCHERS_SELECTORS.requirements.minOrderValueCheckbox)
      .click()
      .get(VOUCHERS_SELECTORS.requirements.minOrderValueInput)
      .type(minOrderValue);
  }
  if (minAmountOfItems) {
    cy.get(VOUCHERS_SELECTORS.requirements.minAmountOfItemsCheckbox)
      .click()
      .get(VOUCHERS_SELECTORS.requirements.minCheckoutItemsQuantityInput)
      .type(minAmountOfItems);
  }
  cy.get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldAppear();
}

export function setVoucherDate({
  voucherId,
  startDate,
  endDate,
  endTime,
  hasEndDate = false,
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

export function loginAndCreateCheckoutForVoucherWithDiscount({
  discount,
  voucherValue,
  voucherCode,
  channelName,
  dataForCheckout,
  usageLimit,
  applyOnePerCustomer,
  onlyStaff,
  minOrderValue,
  minAmountOfItems,
}) {
  cy.clearSessionData()
    .loginUserViaRequest("auth", ONE_PERMISSION_USERS.discount)
    .visit(urlList.vouchers);
  cy.expectSkeletonIsVisible();
  createVoucher({
    voucherCode,
    voucherValue,
    discountOption: discount,
    channelName,
    usageLimit,
    applyOnePerCustomer,
    onlyStaff,
    minOrderValue,
    minAmountOfItems,
  });
  dataForCheckout.voucherCode = voucherCode;
  return createCheckoutWithVoucher(dataForCheckout);
}
