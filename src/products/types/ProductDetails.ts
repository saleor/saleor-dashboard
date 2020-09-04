/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductDetails
// ====================================================

export interface ProductDetails_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductDetails_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductDetails_product_attributes_attribute_values | null)[] | null;
}

export interface ProductDetails_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductDetails_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductDetails_product_attributes_attribute;
  values: (ProductDetails_product_attributes_values | null)[];
}

export interface ProductDetails_product_productType_availableAttributes_edges_node_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductDetails_product_productType_availableAttributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (ProductDetails_product_productType_availableAttributes_edges_node_values | null)[] | null;
  filterableInDashboard: boolean;
  visibleInStorefront: boolean;
}

export interface ProductDetails_product_productType_availableAttributes_edges {
  __typename: "AttributeCountableEdge";
  node: ProductDetails_product_productType_availableAttributes_edges_node;
}

export interface ProductDetails_product_productType_availableAttributes {
  __typename: "AttributeCountableConnection";
  edges: ProductDetails_product_productType_availableAttributes_edges[];
}

export interface ProductDetails_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductDetails_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (ProductDetails_product_productType_variantAttributes_values | null)[] | null;
  filterableInDashboard: boolean;
  visibleInStorefront: boolean;
}

export interface ProductDetails_product_productType {
  __typename: "ProductType";
  id: string;
  availableAttributes: ProductDetails_product_productType_availableAttributes | null;
  variantAttributes: (ProductDetails_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
}

export interface ProductDetails_product_pricing_priceRangeUndiscounted_start_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductDetails_product_pricing_priceRangeUndiscounted_start {
  __typename: "TaxedMoney";
  gross: ProductDetails_product_pricing_priceRangeUndiscounted_start_gross;
}

export interface ProductDetails_product_pricing_priceRangeUndiscounted_stop_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductDetails_product_pricing_priceRangeUndiscounted_stop {
  __typename: "TaxedMoney";
  gross: ProductDetails_product_pricing_priceRangeUndiscounted_stop_gross;
}

export interface ProductDetails_product_pricing_priceRangeUndiscounted {
  __typename: "TaxedMoneyRange";
  start: ProductDetails_product_pricing_priceRangeUndiscounted_start | null;
  stop: ProductDetails_product_pricing_priceRangeUndiscounted_stop | null;
}

export interface ProductDetails_product_pricing {
  __typename: "ProductPricingInfo";
  priceRangeUndiscounted: ProductDetails_product_pricing_priceRangeUndiscounted | null;
}

export interface ProductDetails_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductDetails_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductDetails_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductDetails_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductDetails_product_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface ProductDetails_product_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductDetails_product_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductDetails_product_purchaseCost {
  __typename: "MoneyRange";
  start: ProductDetails_product_purchaseCost_start | null;
  stop: ProductDetails_product_purchaseCost_stop | null;
}

export interface ProductDetails_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductDetails_product_variants_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductDetails_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductDetails_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductDetails_product_variants_stocks_warehouse;
}

export interface ProductDetails_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  price: ProductDetails_product_variants_price | null;
  margin: number | null;
  stocks: (ProductDetails_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
}

export interface ProductDetails_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductDetails_product {
  __typename: "Product";
  id: string;
  attributes: ProductDetails_product_attributes[];
  productType: ProductDetails_product_productType;
  pricing: ProductDetails_product_pricing | null;
  metadata: (ProductDetails_product_metadata | null)[];
  privateMetadata: (ProductDetails_product_privateMetadata | null)[];
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: ProductDetails_product_category | null;
  collections: (ProductDetails_product_collections | null)[] | null;
  margin: ProductDetails_product_margin | null;
  purchaseCost: ProductDetails_product_purchaseCost | null;
  isAvailableForPurchase: boolean | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  images: (ProductDetails_product_images | null)[] | null;
  variants: (ProductDetails_product_variants | null)[] | null;
  weight: ProductDetails_product_weight | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductDetails {
  product: ProductDetails_product | null;
}

export interface ProductDetailsVariables {
  id: string;
}
