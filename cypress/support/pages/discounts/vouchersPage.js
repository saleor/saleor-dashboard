import { VOUCHERS_SELECTORS } from "../../../elements/discounts/vouchers";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { urlList } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { createCheckoutWithVoucher } from "../../api/utils/ordersUtils";
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

export function loginAndCreateCheckoutForVoucherWithDiscount({
  discount,
  voucherValue,
  voucherCode,
  channelName,
  dataForCheckout
}) {
  cy.clearSessionData()
    .loginUserViaRequest("auth", ONE_PERMISSION_USERS.discount)
    .visit(urlList.vouchers);
  cy.softExpectSkeletonIsVisible();
  createVoucher({
    voucherCode,
    voucherValue,
    discountOption: discount,
    channelName
  });
  dataForCheckout.voucherCode = voucherCode;
  return createCheckoutWithVoucher(dataForCheckout).its(
    "addPromoCodeResp.checkout.totalPrice.gross.amount"
  );
}
