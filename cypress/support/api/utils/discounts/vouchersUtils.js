import {
  addChannelToVoucher,
  createVoucher,
  deleteVouchers,
  getVouchers,
} from "../../requests/Discounts/Vouchers";

export function deleteVouchersStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteVouchers, getVouchers, startsWith, "code");
}

export function createVoucherInChannel({
  name,
  productId,
  channelId,
  value,
  code = name,
  type,
  country,
}) {
  let voucherCreate;

  return createVoucher({ name, productId, code, type, country })
    .then(({ voucherCreate: voucherResp }) => {
      voucherCreate = voucherResp;
      addChannelToVoucher(voucherCreate.voucher.id, channelId, value);
    })
    .then(() => voucherCreate);
}
