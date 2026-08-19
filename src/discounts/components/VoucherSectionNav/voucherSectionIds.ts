export const voucherSectionIds = {
  details: "voucher-section-details",
  codes: "voucher-section-codes",
  discount: "voucher-section-discount",
  catalogue: "voucher-section-catalogue",
  countries: "voucher-section-countries",
  requirements: "voucher-section-requirements",
  limits: "voucher-section-limits",
} as const;

export type VoucherSectionId = (typeof voucherSectionIds)[keyof typeof voucherSectionIds];
