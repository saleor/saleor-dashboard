import {
  VoucherDetailsPageTab,
  type VoucherTabItemsCount,
} from "@dashboard/discounts/components/VoucherDetailsPage/VoucherDetailsPage";

/** Catalogue accordion order — same as Eligible products rows. */
export const VOUCHER_CATALOGUE_TAB_ORDER: readonly VoucherDetailsPageTab[] = [
  VoucherDetailsPageTab.categories,
  VoucherDetailsPageTab.collections,
  VoucherDetailsPageTab.products,
  VoucherDetailsPageTab.variants,
];

/**
 * First catalogue group that already has assignments.
 * Falls back to categories when every group is empty.
 */
export const getPreferredVoucherCatalogueTab = (
  tabItemsCount: VoucherTabItemsCount,
): VoucherDetailsPageTab => {
  for (const tab of VOUCHER_CATALOGUE_TAB_ORDER) {
    if ((tabItemsCount[tab] ?? 0) > 0) {
      return tab;
    }
  }

  return VoucherDetailsPageTab.categories;
};
