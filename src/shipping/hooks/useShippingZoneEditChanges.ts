import {
  buildShippingZoneSaveComposition,
  hasShippingZoneSaveComposition,
} from "@dashboard/shipping/components/ShippingZoneDetailsPage/saveComposition";
import { type ShippingZoneUpdateFormData } from "@dashboard/shipping/components/ShippingZoneDetailsPage/types";
import { useMemo } from "react";

interface UseShippingZoneEditChangesOptions {
  formData: ShippingZoneUpdateFormData;
  initialFormData: ShippingZoneUpdateFormData;
}

export function useShippingZoneEditChanges({
  formData,
  initialFormData,
}: UseShippingZoneEditChangesOptions): boolean {
  return useMemo(
    () =>
      hasShippingZoneSaveComposition(buildShippingZoneSaveComposition(formData, initialFormData)),
    [formData, initialFormData],
  );
}
