/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: CheckIfOrderExists
// ====================================================

export interface CheckIfOrderExists_order {
  __typename: "Order";
  id: string;
  status: OrderStatus;
}

export interface CheckIfOrderExists {
  order: CheckIfOrderExists_order | null;
}

export interface CheckIfOrderExistsVariables {
  id: string;
}
