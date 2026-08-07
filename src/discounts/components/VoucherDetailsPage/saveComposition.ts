import { type ChannelVoucherData } from "@dashboard/channels/utils";
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
  "percentageDiscountValue",
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

const hasChannelListingsChanges = (
  channelListings: ChannelVoucherData[],
  baselineChannelListings: ChannelVoucherData[],
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
      listing.discountValue !== baseline.discountValue || listing.minSpent !== baseline.minSpent
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
  }: {
    hasCatalogue?: boolean;
    hasCountries?: boolean;
    pendingRemovedCodesCount?: number;
  } = {},
): VoucherSaveComposition => ({
  hasGeneral: GENERAL_FIELD_KEYS.some(field => changedFieldNames.includes(field)),
  hasSchedule: SCHEDULE_FIELD_KEYS.some(field => changedFieldNames.includes(field)),
  hasChannels: hasChannelListingsChanges(channelListings, baselineChannelListings),
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
