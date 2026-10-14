import { type AddressTypeInput } from "@dashboard/customers/types";
import { type AddressInput, CountryCode, type WarehouseCreateInput } from "@dashboard/graphql";
import { findValueInEnum } from "@dashboard/misc";

/** Address fields from a warehouse form, as the warehouse create and update mutations take them. */
export const warehouseAddressInput = (data: AddressTypeInput): AddressInput => ({
  companyName: data.companyName,
  city: data.city,
  cityArea: data.cityArea,
  country: findValueInEnum(data.country, CountryCode),
  countryArea: data.countryArea,
  phone: data.phone,
  postalCode: data.postalCode,
  streetAddress1: data.streetAddress1,
  streetAddress2: data.streetAddress2,
});

export type WarehouseInputFromForm = Pick<WarehouseCreateInput, "name" | "address">;

/** Name and address from the create-warehouse form, shared by every place that creates one. */
export const warehouseInputFromForm = (
  data: AddressTypeInput & { name: string },
): WarehouseInputFromForm => ({
  name: data.name,
  address: warehouseAddressInput(data),
});
