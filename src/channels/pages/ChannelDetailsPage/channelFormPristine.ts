import { type FormData } from "@dashboard/channels/components/ChannelForm/ChannelForm";
import isEqual from "lodash/isEqual";

/** Normalize values that the UI / submit path treat as equivalent. */
const normalizeNullableNumber = (value: number | string | null | undefined): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const asNumber = Number(value);

  return Number.isNaN(asNumber) ? null : asNumber;
};

/**
 * Fields that affect Save / leave-without-saving. Ignores GraphQL extras
 * spread onto the form from the channel fragment.
 *
 * Assignment dirtiness is derived from displayed membership/order only — not
 * the add/remove delta arrays. Those deltas are cleared when the saved baseline
 * refreshes (see `mergeChannelFormData`); comparing them left the form dirty
 * after a successful Save.
 */
export const getChannelUpdateComparableData = (data: FormData) => ({
  name: data.name,
  slug: data.slug,
  currencyCode: data.currencyCode,
  defaultCountry: data.defaultCountry,
  allocationStrategy: data.allocationStrategy,
  markAsPaidStrategy: data.markAsPaidStrategy,
  // Submit uses `expireOrdersAfter || 0`; treat null/0 as the same pristine state.
  expireOrdersAfter: data.expireOrdersAfter || 0,
  deleteExpiredOrdersAfter: data.deleteExpiredOrdersAfter,
  allowUnpaidOrders: data.allowUnpaidOrders,
  automaticallyConfirmAllNewOrders: data.automaticallyConfirmAllNewOrders,
  automaticallyFulfillNonShippableGiftCard: data.automaticallyFulfillNonShippableGiftCard,
  defaultTransactionFlowStrategy: data.defaultTransactionFlowStrategy,
  releaseFundsForExpiredCheckouts: data.releaseFundsForExpiredCheckouts,
  checkoutTtlBeforeReleasingFunds: normalizeNullableNumber(data.checkoutTtlBeforeReleasingFunds),
  automaticallyCompleteCheckouts: data.automaticallyCompleteCheckouts,
  automaticCompletionDelay: normalizeNullableNumber(data.automaticCompletionDelay),
  automaticCompletionCutOffDate: data.automaticCompletionCutOffDate || "",
  automaticCompletionCutOffTime: data.automaticCompletionCutOffTime || "",
  allowLegacyGiftCardUse: !!data.allowLegacyGiftCardUse,
  // Order matters for warehouse allocation priority.
  warehouseIds: data.warehousesToDisplay.map(warehouse => warehouse.id),
  shippingZoneIds: (data.shippingZonesToDisplay ?? []).map(zone => zone.id),
});

export const isChannelUpdateFormPristine = (data: FormData, initialData: FormData): boolean =>
  isEqual(getChannelUpdateComparableData(data), getChannelUpdateComparableData(initialData));

const ids = (items: ReadonlyArray<{ id: string }> | undefined): string[] =>
  (items ?? []).map(item => item.id);

/**
 * Clear staged add/remove when the form's displayed membership already matches
 * the saved baseline. Empty `[]` baselines alone never overwrite staged ids
 * (same value in prevData and data), which left Save/exit dirty after Save.
 *
 * In-progress staging is kept: displayed ids still differ from the baseline.
 */
const shouldClearAssignmentDeltas = (
  displayed: Array<{ id: string }> | undefined,
  baseline: Array<{ id: string }> | undefined,
): boolean => isEqual(ids(displayed), ids(baseline));

/**
 * Like useForm's default merge, plus clearing assignment deltas once the UI
 * has caught up to the saved warehouse/shipping lists.
 */
export const mergeChannelFormData = (
  prevData: FormData,
  prevState: FormData,
  data: FormData,
): FormData => {
  const merged: FormData = Object.keys(prevState).reduce(
    (acc, key) => {
      const field = key as keyof FormData;

      if (!isEqual(data[field], prevData[field])) {
        return { ...acc, [field]: data[field] };
      }

      return acc;
    },
    { ...prevState },
  );

  return {
    ...merged,
    ...(shouldClearAssignmentDeltas(merged.warehousesToDisplay, data.warehousesToDisplay)
      ? {
          warehousesIdsToAdd: data.warehousesIdsToAdd,
          warehousesIdsToRemove: data.warehousesIdsToRemove,
        }
      : {}),
    ...(shouldClearAssignmentDeltas(
      merged.shippingZonesToDisplay ?? [],
      data.shippingZonesToDisplay ?? [],
    )
      ? {
          shippingZonesIdsToAdd: data.shippingZonesIdsToAdd,
          shippingZonesIdsToRemove: data.shippingZonesIdsToRemove,
        }
      : {}),
  };
};
