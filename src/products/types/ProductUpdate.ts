/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeValueInput, SeoInput, ProductErrorCode, AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductUpdate
// ====================================================

export interface ProductUpdate_productUpdate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductUpdate_productUpdate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductUpdate_productUpdate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductUpdate_productUpdate_product_attributes_attribute_values | null)[] | null;
}

export interface ProductUpdate_productUpdate_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductUpdate_productUpdate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductUpdate_productUpdate_product_attributes_attribute;
  values: (ProductUpdate_productUpdate_product_attributes_values | null)[];
}

export interface ProductUpdate_productUpdate_product_productType_availableAttributes_edges_node_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductUpdate_productUpdate_product_productType_availableAttributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (ProductUpdate_productUpdate_product_productType_availableAttributes_edges_node_values | null)[] | null;
  filterableInDashboard: boolean;
  visibleInStorefront: boolean;
}

export interface ProductUpdate_productUpdate_product_productType_availableAttributes_edges {
  __typename: "AttributeCountableEdge";
  node: ProductUpdate_productUpdate_product_productType_availableAttributes_edges_node;
}

export interface ProductUpdate_productUpdate_product_productType_availableAttributes {
  __typename: "AttributeCountableConnection";
  edges: ProductUpdate_productUpdate_product_productType_availableAttributes_edges[];
}

export interface ProductUpdate_productUpdate_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductUpdate_productUpdate_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (ProductUpdate_productUpdate_product_productType_variantAttributes_values | null)[] | null;
  filterableInDashboard: boolean;
  visibleInStorefront: boolean;
}

export interface ProductUpdate_productUpdate_product_productType {
  __typename: "ProductType";
  id: string;
  availableAttributes: ProductUpdate_productUpdate_product_productType_availableAttributes | null;
  variantAttributes: (ProductUpdate_productUpdate_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
}

export interface ProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_start_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_start {
  __typename: "TaxedMoney";
  gross: ProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_start_gross;
}

export interface ProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_stop_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_stop {
  __typename: "TaxedMoney";
  gross: ProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_stop_gross;
}

export interface ProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted {
  __typename: "TaxedMoneyRange";
  start: ProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_start | null;
  stop: ProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_stop | null;
}

export interface ProductUpdate_productUpdate_product_pricing {
  __typename: "ProductPricingInfo";
  priceRangeUndiscounted: ProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted | null;
}

export interface ProductUpdate_productUpdate_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductUpdate_productUpdate_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductUpdate_productUpdate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductUpdate_productUpdate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductUpdate_productUpdate_product_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface ProductUpdate_productUpdate_product_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductUpdate_productUpdate_product_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductUpdate_productUpdate_product_purchaseCost {
  __typename: "MoneyRange";
  start: ProductUpdate_productUpdate_product_purchaseCost_start | null;
  stop: ProductUpdate_productUpdate_product_purchaseCost_stop | null;
}

export interface ProductUpdate_productUpdate_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductUpdate_productUpdate_product_variants_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductUpdate_productUpdate_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductUpdate_productUpdate_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductUpdate_productUpdate_product_variants_stocks_warehouse;
}

export interface ProductUpdate_productUpdate_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  price: ProductUpdate_productUpdate_product_variants_price | null;
  margin: number | null;
  stocks: (ProductUpdate_productUpdate_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
}

export interface ProductUpdate_productUpdate_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductUpdate_productUpdate_product {
  __typename: "Product";
  id: string;
  attributes: ProductUpdate_productUpdate_product_attributes[];
  productType: ProductUpdate_productUpdate_product_productType;
  pricing: ProductUpdate_productUpdate_product_pricing | null;
  metadata: (ProductUpdate_productUpdate_product_metadata | null)[];
  privateMetadata: (ProductUpdate_productUpdate_product_privateMetadata | null)[];
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: ProductUpdate_productUpdate_product_category | null;
  collections: (ProductUpdate_productUpdate_product_collections | null)[] | null;
  margin: ProductUpdate_productUpdate_product_margin | null;
  purchaseCost: ProductUpdate_productUpdate_product_purchaseCost | null;
  isAvailableForPurchase: boolean | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  images: (ProductUpdate_productUpdate_product_images | null)[] | null;
  variants: (ProductUpdate_productUpdate_product_variants | null)[] | null;
  weight: ProductUpdate_productUpdate_product_weight | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductUpdate_productUpdate {
  __typename: "ProductUpdate";
  errors: ProductUpdate_productUpdate_errors[];
  product: ProductUpdate_productUpdate_product | null;
}

export interface ProductUpdate {
  productUpdate: ProductUpdate_productUpdate | null;
}

export interface ProductUpdateVariables {
  id: string;
  attributes?: (AttributeValueInput | null)[] | null;
  publicationDate?: any | null;
  category?: string | null;
  chargeTaxes: boolean;
  collections?: (string | null)[] | null;
  descriptionJson?: any | null;
  isPublished: boolean;
  name?: string | null;
  basePrice?: any | null;
  seo?: SeoInput | null;
  visibleInListings?: boolean | null;
}
