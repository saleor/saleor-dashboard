import {
  deleteVouchers,
  getVouchers
} from "../../apiRequests/Discounts/Vouchers";

export function deleteVouchersStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteVouchers, getVouchers, startsWith, "code");
}
