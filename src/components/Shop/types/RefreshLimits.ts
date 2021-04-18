/* tslint:disable */
/* eslint-disable */
// @generated
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

export interface RefreshLimits_shop_limits_allowedUsage {
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
  allowedUsage: RefreshLimits_shop_limits_allowedUsage;
}

export interface RefreshLimits_shop {
  __typename: "Shop";
  limits: RefreshLimits_shop_limits;
}

export interface RefreshLimits {
  shop: RefreshLimits_shop;
}

export interface RefreshLimitsVariables {
  channels: boolean;
  orders: boolean;
  productVariants: boolean;
  staffUsers: boolean;
  warehouses: boolean;
}
