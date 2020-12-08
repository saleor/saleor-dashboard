/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShippingZoneFragment
// ====================================================

export interface ShippingZoneFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingZoneFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingZoneFragment_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShippingZoneFragment {
  __typename: "ShippingZone";
  metadata: (ShippingZoneFragment_metadata | null)[];
  privateMetadata: (ShippingZoneFragment_privateMetadata | null)[];
  id: string;
  countries: (ShippingZoneFragment_countries | null)[] | null;
  name: string;
}
