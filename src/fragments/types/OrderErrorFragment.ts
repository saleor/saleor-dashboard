/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderErrorCode, AddressTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: OrderErrorFragment
// ====================================================

export interface OrderErrorFragment {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
  addressType: AddressTypeEnum | null;
}
