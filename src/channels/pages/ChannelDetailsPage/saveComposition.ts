import { type FormData } from "@dashboard/channels/components/ChannelForm/ChannelForm";
import isEqual from "lodash/isEqual";

import { getChannelUpdateComparableData } from "./channelFormPristine";

type ComparableChannelData = ReturnType<typeof getChannelUpdateComparableData>;

const GENERAL_KEYS = [
  "name",
  "slug",
  "currencyCode",
  "defaultCountry",
] as const satisfies ReadonlyArray<keyof ComparableChannelData>;

const ORDERS_KEYS = [
  "markAsPaidStrategy",
  "expireOrdersAfter",
  "deleteExpiredOrdersAfter",
  "allowUnpaidOrders",
  "automaticallyConfirmAllNewOrders",
  "automaticallyFulfillNonShippableGiftCard",
] as const satisfies ReadonlyArray<keyof ComparableChannelData>;

const PAYMENTS_KEYS = [
  "defaultTransactionFlowStrategy",
  "releaseFundsForExpiredCheckouts",
  "checkoutTtlBeforeReleasingFunds",
  "automaticallyCompleteCheckouts",
  "automaticCompletionDelay",
  "automaticCompletionCutOffDate",
  "automaticCompletionCutOffTime",
  "allowLegacyGiftCardUse",
] as const satisfies ReadonlyArray<keyof ComparableChannelData>;

export interface ChannelSaveComposition {
  hasGeneral: boolean;
  hasOrders: boolean;
  hasPayments: boolean;
  hasInventory: boolean;
  hasDelivery: boolean;
}

const isGroupDirty = (
  current: ComparableChannelData,
  baseline: ComparableChannelData,
  keys: ReadonlyArray<keyof ComparableChannelData>,
): boolean => keys.some(key => !isEqual(current[key], baseline[key]));

export const buildChannelSaveComposition = (
  data: FormData,
  initialData: FormData,
): ChannelSaveComposition => {
  const current = getChannelUpdateComparableData(data);
  const baseline = getChannelUpdateComparableData(initialData);

  return {
    hasGeneral: isGroupDirty(current, baseline, GENERAL_KEYS),
    hasOrders: isGroupDirty(current, baseline, ORDERS_KEYS),
    hasPayments: isGroupDirty(current, baseline, PAYMENTS_KEYS),
    hasInventory:
      !isEqual(current.allocationStrategy, baseline.allocationStrategy) ||
      !isEqual(current.warehouseIds, baseline.warehouseIds),
    hasDelivery: !isEqual(current.shippingZoneIds, baseline.shippingZoneIds),
  };
};

export const hasChannelSaveComposition = (composition: ChannelSaveComposition): boolean =>
  composition.hasGeneral ||
  composition.hasOrders ||
  composition.hasPayments ||
  composition.hasInventory ||
  composition.hasDelivery;

export const EMPTY_CHANNEL_SAVE_COMPOSITION: ChannelSaveComposition = {
  hasGeneral: false,
  hasOrders: false,
  hasPayments: false,
  hasInventory: false,
  hasDelivery: false,
};
