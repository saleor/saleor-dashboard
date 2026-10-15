import { type WarehouseDetailsPageFormData } from "./types";

export interface WarehouseSaveComposition {
  hasGeneral: boolean;
  hasAddress: boolean;
  hasPickup: boolean;
}

const generalFields = ["name", "email"] as const;

const addressFields = [
  "city",
  "companyName",
  "country",
  "countryArea",
  "phone",
  "postalCode",
  "streetAddress1",
  "streetAddress2",
] as const;

const pickupFields = ["isPrivate", "clickAndCollectOption"] as const;

const fieldChanged = <TField extends keyof WarehouseDetailsPageFormData>(
  formData: WarehouseDetailsPageFormData,
  initialFormData: WarehouseDetailsPageFormData,
  fields: readonly TField[],
): boolean => fields.some(field => formData[field] !== initialFormData[field]);

export const buildWarehouseSaveComposition = (
  formData: WarehouseDetailsPageFormData,
  initialFormData: WarehouseDetailsPageFormData,
): WarehouseSaveComposition => ({
  hasGeneral: fieldChanged(formData, initialFormData, generalFields),
  hasAddress: fieldChanged(formData, initialFormData, addressFields),
  hasPickup: fieldChanged(formData, initialFormData, pickupFields),
});

export const hasWarehouseSaveComposition = (composition: WarehouseSaveComposition): boolean =>
  composition.hasGeneral || composition.hasAddress || composition.hasPickup;

export const EMPTY_WAREHOUSE_SAVE_COMPOSITION: WarehouseSaveComposition = {
  hasGeneral: false,
  hasAddress: false,
  hasPickup: false,
};
