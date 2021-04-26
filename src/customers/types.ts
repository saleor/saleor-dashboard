export interface AddressTypeInput {
  city: string;
  cityArea?: string;
  companyName?: string;
  country: string;
  countryArea?: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  postalCode: string;
  streetAddress1: string;
  streetAddress2?: string;
}
export type ShippingAddressTypeInput = {
    [K in keyof AddressTypeInput as `shipping_${K}`]: AddressTypeInput[K]
}
export type BillingAddressTypeInput = {
    [K in keyof AddressTypeInput as `billing_${K}`]: AddressTypeInput[K]
}

export interface AddressType {
  id: string;
  city: string;
  cityArea?: string;
  companyName?: string;
  country: {
    code: string;
    country: string;
  };
  countryArea?: string;
  firstName: string;
  lastName: string;
  phone: string;
  postalCode: string;
  streetAddress1: string;
  streetAddress2?: string;
}
export type ShippingAddressType = {
  [K in keyof AddressType as `shipping_${K}`]: AddressType[K]
}
export type BillingAddressType = {
  [K in keyof AddressType as `billing_${K}`]: AddressType[K]
}
