import { type ShippingZoneUpdateFormData } from "@dashboard/shipping/components/ShippingZoneDetailsPage/types";
import { type Option } from "@saleor/macaw-ui-next";
import { useMemo } from "react";

function getOptionValues(options: Option[]): string[] {
  return options.map(option => option.value).sort();
}

function areMultiSelectOptionsEqual(current: Option[], initial: Option[]): boolean {
  const currentValues = getOptionValues(current);
  const initialValues = getOptionValues(initial);

  if (currentValues.length !== initialValues.length) {
    return false;
  }

  return currentValues.every((value, index) => value === initialValues[index]);
}

interface UseShippingZoneEditChangesOptions {
  formData: ShippingZoneUpdateFormData;
  initialFormData: ShippingZoneUpdateFormData;
}

export function useShippingZoneEditChanges({
  formData,
  initialFormData,
}: UseShippingZoneEditChangesOptions): boolean {
  return useMemo(() => {
    if (formData.name !== initialFormData.name) {
      return true;
    }

    if (formData.description !== initialFormData.description) {
      return true;
    }

    if (!areMultiSelectOptionsEqual(formData.warehouses, initialFormData.warehouses)) {
      return true;
    }

    if (!areMultiSelectOptionsEqual(formData.channels, initialFormData.channels)) {
      return true;
    }

    return false;
  }, [formData, initialFormData]);
}
