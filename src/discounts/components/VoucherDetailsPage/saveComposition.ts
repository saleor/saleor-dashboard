import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { DiscountTypeEnum } from "@dashboard/discounts/types";
import { arrayDiff } from "@dashboard/utils/arrays";

export interface VoucherSaveComposition {
  hasGeneral: boolean;
  hasSchedule: boolean;
  hasChannels: boolean;
  hasCodes: boolean;
  hasCatalogue: boolean;
  hasCountries: boolean;
}

const GENERAL_FIELD_KEYS = [
  "name",
  "discountType",
  "type",
  "applyOncePerOrder",
  "applyOncePerCustomer",
  "onlyForStaff",
  "singleUse",
  "hasUsageLimit",
  "usageLimit",
  "requirementsPicker",
  "minCheckoutItemsQuantity",
] as const;

const SCHEDULE_FIELD_KEYS = ["startDate", "startTime", "endDate", "endTime", "hasEndDate"] as const;

const hasChannelAmountChanged = ({
  listing,
  baseline,
  discountType,
}: {
  listing: ChannelVoucherData;
  baseline: ChannelVoucherData;
  discountType: DiscountTypeEnum;
}): boolean => {
  // Inactive %/fixed drafts are cleared at save — don't dirty Save for them.
  if (discountType === DiscountTypeEnum.VALUE_PERCENTAGE) {
    return listing.percentageDiscountValue !== baseline.percentageDiscountValue;
  }

  if (discountType === DiscountTypeEnum.VALUE_FIXED) {
    return listing.discountValue !== baseline.discountValue;
  }

  return false;
};

const hasChannelListingsChanges = (
  channelListings: ChannelVoucherData[],
  baselineChannelListings: ChannelVoucherData[],
  discountType: DiscountTypeEnum,
): boolean => {
  const initialIds = baselineChannelListings.map(channel => channel.id);
  const modifiedIds = channelListings.map(channel => channel.id);
  const idsDiff = arrayDiff(initialIds, modifiedIds);

  if (idsDiff.added.length > 0 || idsDiff.removed.length > 0) {
    return true;
  }

  return channelListings.some(listing => {
    const baseline = baselineChannelListings.find(channel => channel.id === listing.id);

    if (!baseline) {
      return false;
    }

    return (
      hasChannelAmountChanged({ listing, baseline, discountType }) ||
      listing.minSpent !== baseline.minSpent
    );
  });
};

export const buildVoucherSaveComposition = (
  changedFieldNames: ReadonlyArray<string>,
  channelListings: ChannelVoucherData[],
  baselineChannelListings: ChannelVoucherData[],
  draftCodesCount = 0,
  {
    hasCatalogue = false,
    hasCountries = false,
    pendingRemovedCodesCount = 0,
    discountType = DiscountTypeEnum.VALUE_FIXED,
  }: {
    hasCatalogue?: boolean;
    hasCountries?: boolean;
    pendingRemovedCodesCount?: number;
    discountType?: DiscountTypeEnum;
  } = {},
): VoucherSaveComposition => ({
  hasGeneral: GENERAL_FIELD_KEYS.some(field => changedFieldNames.includes(field)),
  hasSchedule: SCHEDULE_FIELD_KEYS.some(field => changedFieldNames.includes(field)),
  hasChannels: hasChannelListingsChanges(channelListings, baselineChannelListings, discountType),
  hasCodes: draftCodesCount > 0 || pendingRemovedCodesCount > 0,
  hasCatalogue,
  hasCountries,
});
export const hasVoucherSaveComposition = (composition: VoucherSaveComposition): boolean =>
  composition.hasGeneral ||
  composition.hasSchedule ||
  composition.hasChannels ||
  composition.hasCodes ||
  composition.hasCatalogue ||
  composition.hasCountries;

export const EMPTY_VOUCHER_SAVE_COMPOSITION: VoucherSaveComposition = {
  hasGeneral: false,
  hasSchedule: false,
  hasChannels: false,
  hasCodes: false,
  hasCatalogue: false,
  hasCountries: false,
};
