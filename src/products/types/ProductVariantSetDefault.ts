/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode, AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductVariantSetDefault
// ====================================================

export interface ProductVariantSetDefault_productVariantSetDefault_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductVariantSetDefault_productVariantSetDefault_product_attributes_attribute_values | null)[] | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariantSetDefault_productVariantSetDefault_product_attributes_attribute;
  values: (ProductVariantSetDefault_productVariantSetDefault_product_attributes_values | null)[];
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (ProductVariantSetDefault_productVariantSetDefault_product_productType_variantAttributes_values | null)[] | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductVariantSetDefault_productVariantSetDefault_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
  taxType: ProductVariantSetDefault_productVariantSetDefault_product_productType_taxType | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_pricing_priceRangeUndiscounted_start_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_pricing_priceRangeUndiscounted_start {
  __typename: "TaxedMoney";
  gross: ProductVariantSetDefault_productVariantSetDefault_product_pricing_priceRangeUndiscounted_start_gross;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_pricing_priceRangeUndiscounted_stop_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_pricing_priceRangeUndiscounted_stop {
  __typename: "TaxedMoney";
  gross: ProductVariantSetDefault_productVariantSetDefault_product_pricing_priceRangeUndiscounted_stop_gross;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_pricing_priceRangeUndiscounted {
  __typename: "TaxedMoneyRange";
  start: ProductVariantSetDefault_productVariantSetDefault_product_pricing_priceRangeUndiscounted_start | null;
  stop: ProductVariantSetDefault_productVariantSetDefault_product_pricing_priceRangeUndiscounted_stop | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_pricing {
  __typename: "ProductPricingInfo";
  priceRangeUndiscounted: ProductVariantSetDefault_productVariantSetDefault_product_pricing_priceRangeUndiscounted | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_purchaseCost {
  __typename: "MoneyRange";
  start: ProductVariantSetDefault_productVariantSetDefault_product_purchaseCost_start | null;
  stop: ProductVariantSetDefault_productVariantSetDefault_product_purchaseCost_stop | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_variants_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductVariantSetDefault_productVariantSetDefault_product_variants_stocks_warehouse;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  price: ProductVariantSetDefault_productVariantSetDefault_product_variants_price | null;
  margin: number | null;
  stocks: (ProductVariantSetDefault_productVariantSetDefault_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product {
  __typename: "Product";
  id: string;
  attributes: ProductVariantSetDefault_productVariantSetDefault_product_attributes[];
  productType: ProductVariantSetDefault_productVariantSetDefault_product_productType;
  pricing: ProductVariantSetDefault_productVariantSetDefault_product_pricing | null;
  metadata: (ProductVariantSetDefault_productVariantSetDefault_product_metadata | null)[];
  privateMetadata: (ProductVariantSetDefault_productVariantSetDefault_product_privateMetadata | null)[];
  name: string;
  slug: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  defaultVariant: ProductVariantSetDefault_productVariantSetDefault_product_defaultVariant | null;
  category: ProductVariantSetDefault_productVariantSetDefault_product_category | null;
  collections: (ProductVariantSetDefault_productVariantSetDefault_product_collections | null)[] | null;
  margin: ProductVariantSetDefault_productVariantSetDefault_product_margin | null;
  purchaseCost: ProductVariantSetDefault_productVariantSetDefault_product_purchaseCost | null;
  isAvailableForPurchase: boolean | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  images: (ProductVariantSetDefault_productVariantSetDefault_product_images | null)[] | null;
  variants: (ProductVariantSetDefault_productVariantSetDefault_product_variants | null)[] | null;
  weight: ProductVariantSetDefault_productVariantSetDefault_product_weight | null;
  taxType: ProductVariantSetDefault_productVariantSetDefault_product_taxType | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductVariantSetDefault_productVariantSetDefault {
  __typename: "ProductVariantSetDefault";
  errors: ProductVariantSetDefault_productVariantSetDefault_errors[];
  product: ProductVariantSetDefault_productVariantSetDefault_product | null;
}

export interface ProductVariantSetDefault {
  productVariantSetDefault: ProductVariantSetDefault_productVariantSetDefault | null;
}

export interface ProductVariantSetDefaultVariables {
  productId: string;
  variantId: string;
}
