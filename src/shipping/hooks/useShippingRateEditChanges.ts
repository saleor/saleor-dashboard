import { type ChannelShippingData } from "@dashboard/channels/utils";
import { type ShippingZoneRateUpdateFormData } from "@dashboard/shipping/components/ShippingZoneRatesPage/types";
import { areChannelListingsEqual } from "@dashboard/shipping/utils/channelPricingState";
import { useEffect, useMemo } from "react";

const comparableFormFields = [
  "name",
  "minDays",
  "maxDays",
  "minValue",
  "maxValue",
  "taxClassId",
] as const satisfies ReadonlyArray<keyof ShippingZoneRateUpdateFormData>;

interface UseShippingRateEditChangesOptions {
  formData: Omit<ShippingZoneRateUpdateFormData, "description">;
  initialFormData: Omit<ShippingZoneRateUpdateFormData, "description">;
  shippingChannels: ChannelShippingData[];
  savedShippingChannels: ChannelShippingData[];
  hasPostalCodeChanges?: boolean;
  isDescriptionDirty?: boolean;
  triggerChange: (isDirty?: boolean) => void;
}

export function useShippingRateEditChanges({
  formData,
  initialFormData,
  shippingChannels,
  savedShippingChannels,
  hasPostalCodeChanges = false,
  isDescriptionDirty = false,
  triggerChange,
}: UseShippingRateEditChangesOptions) {
  const hasFormFieldChanges = useMemo(
    () => comparableFormFields.some(field => formData[field] !== initialFormData[field]),
    [formData, initialFormData],
  );
  const hasChannelChanges = useMemo(
    () => !areChannelListingsEqual(shippingChannels, savedShippingChannels),
    [savedShippingChannels, shippingChannels],
  );
  const hasChanges =
    hasFormFieldChanges || hasChannelChanges || hasPostalCodeChanges || isDescriptionDirty;

  useEffect(() => {
    triggerChange(hasChanges);
  }, [hasChanges, triggerChange]);

  return hasChanges;
}
