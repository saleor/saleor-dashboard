/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ShippingErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: BulkDeleteShippingZone
// ====================================================

export interface BulkDeleteShippingZone_shippingZoneBulkDelete_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
}

export interface BulkDeleteShippingZone_shippingZoneBulkDelete {
  __typename: "ShippingZoneBulkDelete";
  errors: BulkDeleteShippingZone_shippingZoneBulkDelete_errors[];
}

export interface BulkDeleteShippingZone {
  shippingZoneBulkDelete: BulkDeleteShippingZone_shippingZoneBulkDelete | null;
}

export interface BulkDeleteShippingZoneVariables {
  ids: (string | null)[];
}
