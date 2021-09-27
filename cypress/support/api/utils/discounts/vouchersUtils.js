import { deleteVouchers, getVouchers } from "../../requests/Discounts/Vouchers";

export function deleteVouchersStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteVouchers, getVouchers, startsWith, "code");
}
