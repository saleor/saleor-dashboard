/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode, AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductImageUpdate
// ====================================================

export interface ProductImageUpdate_productImageUpdate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductImageUpdate_productImageUpdate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductImageUpdate_productImageUpdate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductImageUpdate_productImageUpdate_product_attributes_attribute_values | null)[] | null;
}

export interface ProductImageUpdate_productImageUpdate_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductImageUpdate_productImageUpdate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductImageUpdate_productImageUpdate_product_attributes_attribute;
  values: (ProductImageUpdate_productImageUpdate_product_attributes_values | null)[];
}

export interface ProductImageUpdate_productImageUpdate_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductImageUpdate_productImageUpdate_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (ProductImageUpdate_productImageUpdate_product_productType_variantAttributes_values | null)[] | null;
  filterableInStorefront: boolean;
  visibleInStorefront: boolean;
}

export interface ProductImageUpdate_productImageUpdate_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductImageUpdate_productImageUpdate_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
}

export interface ProductImageUpdate_productImageUpdate_product_pricing_priceRangeUndiscounted_start_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageUpdate_productImageUpdate_product_pricing_priceRangeUndiscounted_start {
  __typename: "TaxedMoney";
  gross: ProductImageUpdate_productImageUpdate_product_pricing_priceRangeUndiscounted_start_gross;
}

export interface ProductImageUpdate_productImageUpdate_product_pricing_priceRangeUndiscounted_stop_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageUpdate_productImageUpdate_product_pricing_priceRangeUndiscounted_stop {
  __typename: "TaxedMoney";
  gross: ProductImageUpdate_productImageUpdate_product_pricing_priceRangeUndiscounted_stop_gross;
}

export interface ProductImageUpdate_productImageUpdate_product_pricing_priceRangeUndiscounted {
  __typename: "TaxedMoneyRange";
  start: ProductImageUpdate_productImageUpdate_product_pricing_priceRangeUndiscounted_start | null;
  stop: ProductImageUpdate_productImageUpdate_product_pricing_priceRangeUndiscounted_stop | null;
}

export interface ProductImageUpdate_productImageUpdate_product_pricing {
  __typename: "ProductPricingInfo";
  priceRangeUndiscounted: ProductImageUpdate_productImageUpdate_product_pricing_priceRangeUndiscounted | null;
}

export interface ProductImageUpdate_productImageUpdate_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductImageUpdate_productImageUpdate_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductImageUpdate_productImageUpdate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductImageUpdate_productImageUpdate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductImageUpdate_productImageUpdate_product_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface ProductImageUpdate_productImageUpdate_product_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageUpdate_productImageUpdate_product_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageUpdate_productImageUpdate_product_purchaseCost {
  __typename: "MoneyRange";
  start: ProductImageUpdate_productImageUpdate_product_purchaseCost_start | null;
  stop: ProductImageUpdate_productImageUpdate_product_purchaseCost_stop | null;
}

export interface ProductImageUpdate_productImageUpdate_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductImageUpdate_productImageUpdate_product_variants_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageUpdate_productImageUpdate_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductImageUpdate_productImageUpdate_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductImageUpdate_productImageUpdate_product_variants_stocks_warehouse;
}

export interface ProductImageUpdate_productImageUpdate_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  price: ProductImageUpdate_productImageUpdate_product_variants_price | null;
  margin: number | null;
  stocks: (ProductImageUpdate_productImageUpdate_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
}

export interface ProductImageUpdate_productImageUpdate_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductImageUpdate_productImageUpdate_product {
  __typename: "Product";
  id: string;
  attributes: ProductImageUpdate_productImageUpdate_product_attributes[];
  productType: ProductImageUpdate_productImageUpdate_product_productType;
  pricing: ProductImageUpdate_productImageUpdate_product_pricing | null;
  metadata: (ProductImageUpdate_productImageUpdate_product_metadata | null)[];
  privateMetadata: (ProductImageUpdate_productImageUpdate_product_privateMetadata | null)[];
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: ProductImageUpdate_productImageUpdate_product_category | null;
  collections: (ProductImageUpdate_productImageUpdate_product_collections | null)[] | null;
  margin: ProductImageUpdate_productImageUpdate_product_margin | null;
  purchaseCost: ProductImageUpdate_productImageUpdate_product_purchaseCost | null;
  isAvailableForPurchase: boolean | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  images: (ProductImageUpdate_productImageUpdate_product_images | null)[] | null;
  variants: (ProductImageUpdate_productImageUpdate_product_variants | null)[] | null;
  weight: ProductImageUpdate_productImageUpdate_product_weight | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductImageUpdate_productImageUpdate {
  __typename: "ProductImageUpdate";
  errors: ProductImageUpdate_productImageUpdate_errors[];
  product: ProductImageUpdate_productImageUpdate_product | null;
}

export interface ProductImageUpdate {
  productImageUpdate: ProductImageUpdate_productImageUpdate | null;
}

export interface ProductImageUpdateVariables {
  id: string;
  alt: string;
}
