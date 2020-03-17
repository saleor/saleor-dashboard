/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ShippingErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteShippingZone
// ====================================================

export interface DeleteShippingZone_shippingZoneDelete_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
}

export interface DeleteShippingZone_shippingZoneDelete {
  __typename: "ShippingZoneDelete";
  errors: DeleteShippingZone_shippingZoneDelete_errors[];
}

export interface DeleteShippingZone {
  shippingZoneDelete: DeleteShippingZone_shippingZoneDelete | null;
}

export interface DeleteShippingZoneVariables {
  id: string;
}
