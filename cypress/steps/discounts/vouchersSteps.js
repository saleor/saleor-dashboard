import { VOUCHERS_SELECTORS } from "../../elements/discounts/vouchers";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { selectChannelInDetailsPages } from "../channelsSteps";

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
  cy.get(BUTTON_SELECTORS.confirm).click();
}
