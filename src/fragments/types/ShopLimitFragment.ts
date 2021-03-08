/* tslint:disable */
/* eslint-disable */
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

export interface ShopLimitFragment_limits_maximumUsage {
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
  maximumUsage: ShopLimitFragment_limits_maximumUsage;
}

export interface ShopLimitFragment {
  __typename: "Shop";
  limits: ShopLimitFragment_limits;
}
