/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: Product
// ====================================================

export interface Product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface Product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (Product_attributes_attribute_values | null)[] | null;
}

export interface Product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface Product_attributes {
  __typename: "SelectedAttribute";
  attribute: Product_attributes_attribute;
  values: (Product_attributes_values | null)[];
}

export interface Product_productType_availableAttributes_edges_node_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface Product_productType_availableAttributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (Product_productType_availableAttributes_edges_node_values | null)[] | null;
  filterableInDashboard: boolean;
  visibleInStorefront: boolean;
}

export interface Product_productType_availableAttributes_edges {
  __typename: "AttributeCountableEdge";
  node: Product_productType_availableAttributes_edges_node;
}

export interface Product_productType_availableAttributes {
  __typename: "AttributeCountableConnection";
  edges: Product_productType_availableAttributes_edges[];
}

export interface Product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface Product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (Product_productType_variantAttributes_values | null)[] | null;
  filterableInDashboard: boolean;
  visibleInStorefront: boolean;
}

export interface Product_productType {
  __typename: "ProductType";
  id: string;
  availableAttributes: Product_productType_availableAttributes | null;
  variantAttributes: (Product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
}

export interface Product_pricing_priceRangeUndiscounted_start_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Product_pricing_priceRangeUndiscounted_start {
  __typename: "TaxedMoney";
  gross: Product_pricing_priceRangeUndiscounted_start_gross;
}

export interface Product_pricing_priceRangeUndiscounted_stop_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Product_pricing_priceRangeUndiscounted_stop {
  __typename: "TaxedMoney";
  gross: Product_pricing_priceRangeUndiscounted_stop_gross;
}

export interface Product_pricing_priceRangeUndiscounted {
  __typename: "TaxedMoneyRange";
  start: Product_pricing_priceRangeUndiscounted_start | null;
  stop: Product_pricing_priceRangeUndiscounted_stop | null;
}

export interface Product_pricing {
  __typename: "ProductPricingInfo";
  priceRangeUndiscounted: Product_pricing_priceRangeUndiscounted | null;
}

export interface Product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface Product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface Product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface Product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface Product_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface Product_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Product_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Product_purchaseCost {
  __typename: "MoneyRange";
  start: Product_purchaseCost_start | null;
  stop: Product_purchaseCost_stop | null;
}

export interface Product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface Product_variants_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface Product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: Product_variants_stocks_warehouse;
}

export interface Product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  price: Product_variants_price | null;
  margin: number | null;
  stocks: (Product_variants_stocks | null)[] | null;
  trackInventory: boolean;
}

export interface Product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface Product {
  __typename: "Product";
  id: string;
  attributes: Product_attributes[];
  productType: Product_productType;
  pricing: Product_pricing | null;
  metadata: (Product_metadata | null)[];
  privateMetadata: (Product_privateMetadata | null)[];
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: Product_category | null;
  collections: (Product_collections | null)[] | null;
  margin: Product_margin | null;
  purchaseCost: Product_purchaseCost | null;
  isAvailableForPurchase: boolean | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  images: (Product_images | null)[] | null;
  variants: (Product_variants | null)[] | null;
  weight: Product_weight | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}
