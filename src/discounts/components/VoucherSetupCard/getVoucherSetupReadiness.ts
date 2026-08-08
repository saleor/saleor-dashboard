import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { DiscountTypeEnum } from "@dashboard/discounts/types";
import { VoucherTypeEnum } from "@dashboard/graphql";
import { validatePrice } from "@dashboard/products/utils/validation";

import { type VoucherCode } from "../VoucherCodesDatagrid/types";
import {
  type VoucherDetailsPageFormData,
  type VoucherDetailsPageVoucher,
  type VoucherTabItemsCount,
} from "../VoucherDetailsPage/VoucherDetailsPage";

export interface VoucherSetupReadinessInput {
  voucher: VoucherDetailsPageVoucher | null | undefined;
  formData: Pick<
    VoucherDetailsPageFormData,
    "discountType" | "type" | "percentageDiscountValue" | "channelListings" | "codes"
  >;
  voucherCodes: VoucherCode[];
  /** Server codes staged for delete on Save — subtract from saved totals. */
  pendingRemovedCodesCount?: number;
  tabItemsCount: VoucherTabItemsCount;
  /** Shipping vouchers: empty list means worldwide. */
  countriesCount?: number;
}

export interface VoucherSetupReadiness {
  hasCodes: boolean;
  hasChannels: boolean;
  hasDiscountValue: boolean;
  needsCatalogue: boolean;
  hasCatalogue: boolean;
  /** Free-shipping vouchers — empty countries means worldwide. */
  needsCountries: boolean;
  /** True when at least one country is assigned (restricted, not worldwide). */
  hasCountries: boolean;
  codesCount: number;
  channelCount: number;
  catalogueCount: number;
  countriesCount: number;
  /** True when every required-to-redeem step is done. */
  coreReady: boolean;
}

const countCatalogueItems = (tabItemsCount: VoucherTabItemsCount): number =>
  (tabItemsCount.categories ?? 0) +
  (tabItemsCount.collections ?? 0) +
  (tabItemsCount.products ?? 0) +
  (tabItemsCount.variants ?? 0);

const hasValidChannelDiscount = (
  channelListings: ChannelVoucherData[],
  discountType: DiscountTypeEnum,
): boolean => {
  if (channelListings.length === 0) {
    return false;
  }

  return !channelListings.some(channel =>
    validatePrice(
      String(
        (discountType === DiscountTypeEnum.VALUE_PERCENTAGE
          ? channel.percentageDiscountValue
          : channel.discountValue) ?? "",
      ),
    ),
  );
};

export const getVoucherSetupReadiness = ({
  voucher,
  formData,
  voucherCodes,
  pendingRemovedCodesCount = 0,
  tabItemsCount,
  countriesCount: countriesCountInput,
}: VoucherSetupReadinessInput): VoucherSetupReadiness => {
  const savedCodesCount = voucher?.codesCount?.totalCount ?? 0;
  const listedCodesCount = voucherCodes.length;
  const draftCodesCount = formData.codes.length;
  // Prefer the server total when present; otherwise fall back to listed / draft codes.
  // Pending removals are already excluded from `voucherCodes` but not from the server total.
  const codesCount =
    savedCodesCount > 0
      ? Math.max(0, savedCodesCount - pendingRemovedCodesCount) + draftCodesCount
      : listedCodesCount + draftCodesCount;
  const hasCodes = codesCount > 0 || draftCodesCount > 0;

  const channelListings = formData.channelListings;
  const channelCount = channelListings.length;
  const hasChannels = channelCount > 0;

  const isShipping = formData.discountType === DiscountTypeEnum.SHIPPING;
  const hasDiscountValue = isShipping
    ? true
    : hasValidChannelDiscount(channelListings, formData.discountType);

  const needsCatalogue = formData.type === VoucherTypeEnum.SPECIFIC_PRODUCT;
  const catalogueCount = countCatalogueItems(tabItemsCount);
  const hasCatalogue = !needsCatalogue || catalogueCount > 0;

  const needsCountries = isShipping;
  const countriesCount = countriesCountInput ?? voucher?.countries?.length ?? 0;
  const hasCountries = countriesCount > 0;
  // Empty country list = worldwide and redeemable — countries are not a redeem blocker.

  const coreReady = hasCodes && hasChannels && hasDiscountValue && hasCatalogue;

  return {
    hasCodes,
    hasChannels,
    hasDiscountValue,
    needsCatalogue,
    hasCatalogue,
    needsCountries,
    hasCountries,
    codesCount,
    channelCount,
    catalogueCount,
    countriesCount,
    coreReady,
  };
};
