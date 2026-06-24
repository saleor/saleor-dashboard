import { type ChannelShippingData } from "@dashboard/channels/utils";
import { type ShippingZoneRateUpdateFormData } from "@dashboard/shipping/components/ShippingZoneRatesPage/types";
import {
  areChannelListingsEqual,
  normalizeComparableNumericString,
} from "@dashboard/shipping/utils/channelPricingState";
import { useMemo } from "react";

const comparableFormFields = [
  "name",
  "minDays",
  "maxDays",
  "minValue",
  "maxValue",
  "taxClassId",
] as const satisfies ReadonlyArray<keyof ShippingZoneRateUpdateFormData>;

const numericFormFields = new Set<keyof ShippingZoneRateUpdateFormData>([
  "minDays",
  "maxDays",
  "minValue",
  "maxValue",
]);

function areFormFieldValuesEqual(
  field: (typeof comparableFormFields)[number],
  currentValue: string,
  initialValue: string,
): boolean {
  if (currentValue === initialValue) {
    return true;
  }

  if (!numericFormFields.has(field)) {
    return false;
  }

  return (
    normalizeComparableNumericString(currentValue) ===
    normalizeComparableNumericString(initialValue)
  );
}

interface UseShippingRateEditChangesOptions {
  formData: Omit<ShippingZoneRateUpdateFormData, "description">;
  initialFormData: Omit<ShippingZoneRateUpdateFormData, "description">;
  shippingChannels: ChannelShippingData[];
  savedShippingChannels: ChannelShippingData[];
  hasPostalCodeChanges?: boolean;
  isDescriptionDirty?: boolean;
}

export function useShippingRateEditChanges({
  formData,
  initialFormData,
  shippingChannels,
  savedShippingChannels,
  hasPostalCodeChanges = false,
  isDescriptionDirty = false,
}: UseShippingRateEditChangesOptions) {
  const hasFormFieldChanges = useMemo(
    () =>
      comparableFormFields.some(
        field => !areFormFieldValuesEqual(field, formData[field], initialFormData[field]),
      ),
    [formData, initialFormData],
  );
  const hasChannelChanges = useMemo(
    () => !areChannelListingsEqual(shippingChannels, savedShippingChannels),
    [savedShippingChannels, shippingChannels],
  );
  const hasChanges =
    hasFormFieldChanges || hasChannelChanges || hasPostalCodeChanges || isDescriptionDirty;

  return hasChanges;
}
