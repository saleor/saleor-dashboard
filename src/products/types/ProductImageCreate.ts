/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode, AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductImageCreate
// ====================================================

export interface ProductImageCreate_productImageCreate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductImageCreate_productImageCreate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductImageCreate_productImageCreate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductImageCreate_productImageCreate_product_attributes_attribute_values | null)[] | null;
}

export interface ProductImageCreate_productImageCreate_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductImageCreate_productImageCreate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductImageCreate_productImageCreate_product_attributes_attribute;
  values: (ProductImageCreate_productImageCreate_product_attributes_values | null)[];
}

export interface ProductImageCreate_productImageCreate_product_productType_availableAttributes_edges_node_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductImageCreate_productImageCreate_product_productType_availableAttributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (ProductImageCreate_productImageCreate_product_productType_availableAttributes_edges_node_values | null)[] | null;
  filterableInDashboard: boolean;
  visibleInStorefront: boolean;
}

export interface ProductImageCreate_productImageCreate_product_productType_availableAttributes_edges {
  __typename: "AttributeCountableEdge";
  node: ProductImageCreate_productImageCreate_product_productType_availableAttributes_edges_node;
}

export interface ProductImageCreate_productImageCreate_product_productType_availableAttributes {
  __typename: "AttributeCountableConnection";
  edges: ProductImageCreate_productImageCreate_product_productType_availableAttributes_edges[];
}

export interface ProductImageCreate_productImageCreate_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductImageCreate_productImageCreate_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (ProductImageCreate_productImageCreate_product_productType_variantAttributes_values | null)[] | null;
  filterableInDashboard: boolean;
  visibleInStorefront: boolean;
}

export interface ProductImageCreate_productImageCreate_product_productType {
  __typename: "ProductType";
  id: string;
  availableAttributes: ProductImageCreate_productImageCreate_product_productType_availableAttributes | null;
  variantAttributes: (ProductImageCreate_productImageCreate_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
}

export interface ProductImageCreate_productImageCreate_product_pricing_priceRangeUndiscounted_start_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageCreate_productImageCreate_product_pricing_priceRangeUndiscounted_start {
  __typename: "TaxedMoney";
  gross: ProductImageCreate_productImageCreate_product_pricing_priceRangeUndiscounted_start_gross;
}

export interface ProductImageCreate_productImageCreate_product_pricing_priceRangeUndiscounted_stop_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageCreate_productImageCreate_product_pricing_priceRangeUndiscounted_stop {
  __typename: "TaxedMoney";
  gross: ProductImageCreate_productImageCreate_product_pricing_priceRangeUndiscounted_stop_gross;
}

export interface ProductImageCreate_productImageCreate_product_pricing_priceRangeUndiscounted {
  __typename: "TaxedMoneyRange";
  start: ProductImageCreate_productImageCreate_product_pricing_priceRangeUndiscounted_start | null;
  stop: ProductImageCreate_productImageCreate_product_pricing_priceRangeUndiscounted_stop | null;
}

export interface ProductImageCreate_productImageCreate_product_pricing {
  __typename: "ProductPricingInfo";
  priceRangeUndiscounted: ProductImageCreate_productImageCreate_product_pricing_priceRangeUndiscounted | null;
}

export interface ProductImageCreate_productImageCreate_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductImageCreate_productImageCreate_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductImageCreate_productImageCreate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductImageCreate_productImageCreate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductImageCreate_productImageCreate_product_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface ProductImageCreate_productImageCreate_product_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageCreate_productImageCreate_product_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageCreate_productImageCreate_product_purchaseCost {
  __typename: "MoneyRange";
  start: ProductImageCreate_productImageCreate_product_purchaseCost_start | null;
  stop: ProductImageCreate_productImageCreate_product_purchaseCost_stop | null;
}

export interface ProductImageCreate_productImageCreate_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductImageCreate_productImageCreate_product_variants_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageCreate_productImageCreate_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductImageCreate_productImageCreate_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductImageCreate_productImageCreate_product_variants_stocks_warehouse;
}

export interface ProductImageCreate_productImageCreate_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  price: ProductImageCreate_productImageCreate_product_variants_price | null;
  margin: number | null;
  stocks: (ProductImageCreate_productImageCreate_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
}

export interface ProductImageCreate_productImageCreate_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductImageCreate_productImageCreate_product {
  __typename: "Product";
  id: string;
  attributes: ProductImageCreate_productImageCreate_product_attributes[];
  productType: ProductImageCreate_productImageCreate_product_productType;
  pricing: ProductImageCreate_productImageCreate_product_pricing | null;
  metadata: (ProductImageCreate_productImageCreate_product_metadata | null)[];
  privateMetadata: (ProductImageCreate_productImageCreate_product_privateMetadata | null)[];
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: ProductImageCreate_productImageCreate_product_category | null;
  collections: (ProductImageCreate_productImageCreate_product_collections | null)[] | null;
  margin: ProductImageCreate_productImageCreate_product_margin | null;
  purchaseCost: ProductImageCreate_productImageCreate_product_purchaseCost | null;
  isAvailableForPurchase: boolean | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  images: (ProductImageCreate_productImageCreate_product_images | null)[] | null;
  variants: (ProductImageCreate_productImageCreate_product_variants | null)[] | null;
  weight: ProductImageCreate_productImageCreate_product_weight | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductImageCreate_productImageCreate {
  __typename: "ProductImageCreate";
  errors: ProductImageCreate_productImageCreate_errors[];
  product: ProductImageCreate_productImageCreate_product | null;
}

export interface ProductImageCreate {
  productImageCreate: ProductImageCreate_productImageCreate | null;
}

export interface ProductImageCreateVariables {
  product: string;
  image: any;
  alt?: string | null;
}
