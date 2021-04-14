/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShopLimitFragment
// ====================================================

export interface ShopLimitFragment_limits_currentUsage {
  __typename: "Limits";
  channels: number | null;
  orders: number | null;
  productVariants: number | null;
  staffUsers: number | null;
  warehouses: number | null;
}

export interface ShopLimitFragment_limits_allowedUsage {
  __typename: "Limits";
  channels: number | null;
  orders: number | null;
  productVariants: number | null;
  staffUsers: number | null;
  warehouses: number | null;
}

export interface ShopLimitFragment_limits {
  __typename: "LimitInfo";
  currentUsage: ShopLimitFragment_limits_currentUsage;
  allowedUsage: ShopLimitFragment_limits_allowedUsage;
}

export interface ShopLimitFragment {
  __typename: "Shop";
  limits: ShopLimitFragment_limits;
}
