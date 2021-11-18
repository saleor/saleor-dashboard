import {
  addChannelToVoucher,
  createVoucher,
  deleteVouchers,
  getVouchers
} from "../../requests/Discounts/Vouchers";

export function deleteVouchersStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteVouchers, getVouchers, startsWith, "code");
}

export function createVoucherInChannel({
  name,
  productId,
  channelId,
  value,
  code = name
}) {
  let voucher;
  return createVoucher({ name, productId, code })
    .then(({ voucher: voucherResp }) => {
      voucher = voucherResp;
      addChannelToVoucher(voucher.id, channelId, value);
    })
    .then(() => voucher);
}
