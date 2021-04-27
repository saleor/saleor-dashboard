/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DraftOrderCreateInput, OrderErrorCode, AddressTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderDraftCreate
// ====================================================

export interface OrderDraftCreate_draftOrderCreate_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
  addressType: AddressTypeEnum | null;
}

export interface OrderDraftCreate_draftOrderCreate_order {
  __typename: "Order";
  id: string;
}

export interface OrderDraftCreate_draftOrderCreate {
  __typename: "DraftOrderCreate";
  errors: OrderDraftCreate_draftOrderCreate_errors[];
  order: OrderDraftCreate_draftOrderCreate_order | null;
}

export interface OrderDraftCreate {
  draftOrderCreate: OrderDraftCreate_draftOrderCreate | null;
}

export interface OrderDraftCreateVariables {
  input: DraftOrderCreateInput;
}
