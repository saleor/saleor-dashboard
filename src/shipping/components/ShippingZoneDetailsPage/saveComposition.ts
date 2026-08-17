import { type ShippingZoneUpdateFormData } from "@dashboard/shipping/components/ShippingZoneDetailsPage/types";
import { type Option } from "@saleor/macaw-ui-next";

export interface ShippingZoneSaveComposition {
  hasGeneral: boolean;
  hasChannels: boolean;
  hasWarehouses: boolean;
}

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

export const buildShippingZoneSaveComposition = (
  formData: ShippingZoneUpdateFormData,
  initialFormData: ShippingZoneUpdateFormData,
): ShippingZoneSaveComposition => ({
  hasGeneral:
    formData.name !== initialFormData.name || formData.description !== initialFormData.description,
  hasChannels: !areMultiSelectOptionsEqual(formData.channels, initialFormData.channels),
  hasWarehouses: !areMultiSelectOptionsEqual(formData.warehouses, initialFormData.warehouses),
});

export const hasShippingZoneSaveComposition = (composition: ShippingZoneSaveComposition): boolean =>
  composition.hasGeneral || composition.hasChannels || composition.hasWarehouses;

export const EMPTY_SHIPPING_ZONE_SAVE_COMPOSITION: ShippingZoneSaveComposition = {
  hasGeneral: false,
  hasChannels: false,
  hasWarehouses: false,
};
