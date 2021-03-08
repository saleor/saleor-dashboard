/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: RefreshLimits
// ====================================================

export interface RefreshLimits_shop_limits_currentUsage {
  __typename: "Limits";
  channels: number | null;
  orders: number | null;
  productVariants: number | null;
  staffUsers: number | null;
  warehouses: number | null;
}

export interface RefreshLimits_shop_limits_maximumUsage {
  __typename: "Limits";
  channels: number | null;
  orders: number | null;
  productVariants: number | null;
  staffUsers: number | null;
  warehouses: number | null;
}

export interface RefreshLimits_shop_limits {
  __typename: "LimitInfo";
  currentUsage: RefreshLimits_shop_limits_currentUsage;
  maximumUsage: RefreshLimits_shop_limits_maximumUsage;
}

export interface RefreshLimits_shop {
  __typename: "Shop";
  limits: RefreshLimits_shop_limits;
}

export interface RefreshLimits {
  shop: RefreshLimits_shop;
}
