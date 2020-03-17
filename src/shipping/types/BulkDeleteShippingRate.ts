/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ShippingErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: BulkDeleteShippingRate
// ====================================================

export interface BulkDeleteShippingRate_shippingPriceBulkDelete_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
}

export interface BulkDeleteShippingRate_shippingPriceBulkDelete {
  __typename: "ShippingPriceBulkDelete";
  errors: BulkDeleteShippingRate_shippingPriceBulkDelete_errors[];
}

export interface BulkDeleteShippingRate {
  shippingPriceBulkDelete: BulkDeleteShippingRate_shippingPriceBulkDelete | null;
}

export interface BulkDeleteShippingRateVariables {
  ids: (string | null)[];
}
