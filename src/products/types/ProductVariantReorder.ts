/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ReorderInput, ProductErrorCode, AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductVariantReorder
// ====================================================

export interface ProductVariantReorder_productVariantReorder_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductVariantReorder_productVariantReorder_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariantReorder_productVariantReorder_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductVariantReorder_productVariantReorder_product_attributes_attribute_values | null)[] | null;
}

export interface ProductVariantReorder_productVariantReorder_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariantReorder_productVariantReorder_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariantReorder_productVariantReorder_product_attributes_attribute;
  values: (ProductVariantReorder_productVariantReorder_product_attributes_values | null)[];
}

export interface ProductVariantReorder_productVariantReorder_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariantReorder_productVariantReorder_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (ProductVariantReorder_productVariantReorder_product_productType_variantAttributes_values | null)[] | null;
}

export interface ProductVariantReorder_productVariantReorder_product_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductVariantReorder_productVariantReorder_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductVariantReorder_productVariantReorder_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
  taxType: ProductVariantReorder_productVariantReorder_product_productType_taxType | null;
}

export interface ProductVariantReorder_productVariantReorder_product_pricing_priceRangeUndiscounted_start_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantReorder_productVariantReorder_product_pricing_priceRangeUndiscounted_start {
  __typename: "TaxedMoney";
  gross: ProductVariantReorder_productVariantReorder_product_pricing_priceRangeUndiscounted_start_gross;
}

export interface ProductVariantReorder_productVariantReorder_product_pricing_priceRangeUndiscounted_stop_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantReorder_productVariantReorder_product_pricing_priceRangeUndiscounted_stop {
  __typename: "TaxedMoney";
  gross: ProductVariantReorder_productVariantReorder_product_pricing_priceRangeUndiscounted_stop_gross;
}

export interface ProductVariantReorder_productVariantReorder_product_pricing_priceRangeUndiscounted {
  __typename: "TaxedMoneyRange";
  start: ProductVariantReorder_productVariantReorder_product_pricing_priceRangeUndiscounted_start | null;
  stop: ProductVariantReorder_productVariantReorder_product_pricing_priceRangeUndiscounted_stop | null;
}

export interface ProductVariantReorder_productVariantReorder_product_pricing {
  __typename: "ProductPricingInfo";
  priceRangeUndiscounted: ProductVariantReorder_productVariantReorder_product_pricing_priceRangeUndiscounted | null;
}

export interface ProductVariantReorder_productVariantReorder_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariantReorder_productVariantReorder_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariantReorder_productVariantReorder_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductVariantReorder_productVariantReorder_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductVariantReorder_productVariantReorder_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductVariantReorder_productVariantReorder_product_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface ProductVariantReorder_productVariantReorder_product_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantReorder_productVariantReorder_product_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantReorder_productVariantReorder_product_purchaseCost {
  __typename: "MoneyRange";
  start: ProductVariantReorder_productVariantReorder_product_purchaseCost_start | null;
  stop: ProductVariantReorder_productVariantReorder_product_purchaseCost_stop | null;
}

export interface ProductVariantReorder_productVariantReorder_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductVariantReorder_productVariantReorder_product_variants_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantReorder_productVariantReorder_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductVariantReorder_productVariantReorder_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductVariantReorder_productVariantReorder_product_variants_stocks_warehouse;
}

export interface ProductVariantReorder_productVariantReorder_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  price: ProductVariantReorder_productVariantReorder_product_variants_price | null;
  margin: number | null;
  stocks: (ProductVariantReorder_productVariantReorder_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
}

export interface ProductVariantReorder_productVariantReorder_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductVariantReorder_productVariantReorder_product_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductVariantReorder_productVariantReorder_product {
  __typename: "Product";
  id: string;
  attributes: ProductVariantReorder_productVariantReorder_product_attributes[];
  productType: ProductVariantReorder_productVariantReorder_product_productType;
  pricing: ProductVariantReorder_productVariantReorder_product_pricing | null;
  metadata: (ProductVariantReorder_productVariantReorder_product_metadata | null)[];
  privateMetadata: (ProductVariantReorder_productVariantReorder_product_privateMetadata | null)[];
  name: string;
  slug: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  defaultVariant: ProductVariantReorder_productVariantReorder_product_defaultVariant | null;
  category: ProductVariantReorder_productVariantReorder_product_category | null;
  collections: (ProductVariantReorder_productVariantReorder_product_collections | null)[] | null;
  margin: ProductVariantReorder_productVariantReorder_product_margin | null;
  purchaseCost: ProductVariantReorder_productVariantReorder_product_purchaseCost | null;
  isAvailableForPurchase: boolean | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  images: (ProductVariantReorder_productVariantReorder_product_images | null)[] | null;
  variants: (ProductVariantReorder_productVariantReorder_product_variants | null)[] | null;
  weight: ProductVariantReorder_productVariantReorder_product_weight | null;
  taxType: ProductVariantReorder_productVariantReorder_product_taxType | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductVariantReorder_productVariantReorder {
  __typename: "ProductVariantReorder";
  errors: ProductVariantReorder_productVariantReorder_errors[];
  product: ProductVariantReorder_productVariantReorder_product | null;
}

export interface ProductVariantReorder {
  productVariantReorder: ProductVariantReorder_productVariantReorder | null;
}

export interface ProductVariantReorderVariables {
  move: ReorderInput;
  productId: string;
}
