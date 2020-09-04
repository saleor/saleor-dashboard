/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ProductVariantAttributesFragment
// ====================================================

export interface ProductVariantAttributesFragment_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariantAttributesFragment_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductVariantAttributesFragment_attributes_attribute_values | null)[] | null;
}

export interface ProductVariantAttributesFragment_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariantAttributesFragment_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariantAttributesFragment_attributes_attribute;
  values: (ProductVariantAttributesFragment_attributes_values | null)[];
}

export interface ProductVariantAttributesFragment_productType_availableAttributes_edges_node_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariantAttributesFragment_productType_availableAttributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (ProductVariantAttributesFragment_productType_availableAttributes_edges_node_values | null)[] | null;
  filterableInDashboard: boolean;
  visibleInStorefront: boolean;
}

export interface ProductVariantAttributesFragment_productType_availableAttributes_edges {
  __typename: "AttributeCountableEdge";
  node: ProductVariantAttributesFragment_productType_availableAttributes_edges_node;
}

export interface ProductVariantAttributesFragment_productType_availableAttributes {
  __typename: "AttributeCountableConnection";
  edges: ProductVariantAttributesFragment_productType_availableAttributes_edges[];
}

export interface ProductVariantAttributesFragment_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariantAttributesFragment_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (ProductVariantAttributesFragment_productType_variantAttributes_values | null)[] | null;
  filterableInDashboard: boolean;
  visibleInStorefront: boolean;
}

export interface ProductVariantAttributesFragment_productType {
  __typename: "ProductType";
  id: string;
  availableAttributes: ProductVariantAttributesFragment_productType_availableAttributes | null;
  variantAttributes: (ProductVariantAttributesFragment_productType_variantAttributes | null)[] | null;
}

export interface ProductVariantAttributesFragment_pricing_priceRangeUndiscounted_start_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantAttributesFragment_pricing_priceRangeUndiscounted_start {
  __typename: "TaxedMoney";
  gross: ProductVariantAttributesFragment_pricing_priceRangeUndiscounted_start_gross;
}

export interface ProductVariantAttributesFragment_pricing_priceRangeUndiscounted_stop_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantAttributesFragment_pricing_priceRangeUndiscounted_stop {
  __typename: "TaxedMoney";
  gross: ProductVariantAttributesFragment_pricing_priceRangeUndiscounted_stop_gross;
}

export interface ProductVariantAttributesFragment_pricing_priceRangeUndiscounted {
  __typename: "TaxedMoneyRange";
  start: ProductVariantAttributesFragment_pricing_priceRangeUndiscounted_start | null;
  stop: ProductVariantAttributesFragment_pricing_priceRangeUndiscounted_stop | null;
}

export interface ProductVariantAttributesFragment_pricing {
  __typename: "ProductPricingInfo";
  priceRangeUndiscounted: ProductVariantAttributesFragment_pricing_priceRangeUndiscounted | null;
}

export interface ProductVariantAttributesFragment {
  __typename: "Product";
  id: string;
  attributes: ProductVariantAttributesFragment_attributes[];
  productType: ProductVariantAttributesFragment_productType;
  pricing: ProductVariantAttributesFragment_pricing | null;
}
