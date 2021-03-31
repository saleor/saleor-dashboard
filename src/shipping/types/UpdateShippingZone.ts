/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ShippingZoneUpdateInput, ShippingErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateShippingZone
// ====================================================

export interface UpdateShippingZone_shippingZoneUpdate_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
}

export interface UpdateShippingZone_shippingZoneUpdate_shippingZone_countries {
  __typename: "CountryDisplay";
  country: string;
  code: string;
}

export interface UpdateShippingZone_shippingZoneUpdate_shippingZone {
  __typename: "ShippingZone";
  countries: (UpdateShippingZone_shippingZoneUpdate_shippingZone_countries | null)[] | null;
  default: boolean;
  id: string;
  name: string;
}

export interface UpdateShippingZone_shippingZoneUpdate {
  __typename: "ShippingZoneUpdate";
  errors: UpdateShippingZone_shippingZoneUpdate_errors[];
  shippingZone: UpdateShippingZone_shippingZoneUpdate_shippingZone | null;
}

export interface UpdateShippingZone {
  shippingZoneUpdate: UpdateShippingZone_shippingZoneUpdate | null;
}

export interface UpdateShippingZoneVariables {
  id: string;
  input: ShippingZoneUpdateInput;
}
