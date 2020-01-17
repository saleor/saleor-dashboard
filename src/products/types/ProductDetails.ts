/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductDetails
// ====================================================

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

export interface ProductDetails_product_basePrice {
  __typename: "Money";
  amount: number;
  currency: string;
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

export interface ProductDetails_product_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductDetails_product_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductDetails_product_pricing_priceRange_start_net;
}

export interface ProductDetails_product_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductDetails_product_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductDetails_product_pricing_priceRange_stop_net;
}

export interface ProductDetails_product_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductDetails_product_pricing_priceRange_start | null;
  stop: ProductDetails_product_pricing_priceRange_stop | null;
}

export interface ProductDetails_product_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductDetails_product_pricing_priceRange | null;
}

export interface ProductDetails_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductDetails_product_variants_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductDetails_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  priceOverride: ProductDetails_product_variants_priceOverride | null;
  margin: number | null;
  quantity: number;
  quantityAllocated: number | null;
  stockQuantity: number;
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
  values: (ProductDetails_product_productType_variantAttributes_values | null)[] | null;
}

export interface ProductDetails_product_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
  variantAttributes: (ProductDetails_product_productType_variantAttributes | null)[] | null;
}

export interface ProductDetails_product {
  __typename: "Product";
  id: string;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: ProductDetails_product_category | null;
  collections: (ProductDetails_product_collections | null)[] | null;
  basePrice: ProductDetails_product_basePrice | null;
  margin: ProductDetails_product_margin | null;
  purchaseCost: ProductDetails_product_purchaseCost | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  attributes: ProductDetails_product_attributes[];
  pricing: ProductDetails_product_pricing | null;
  images: (ProductDetails_product_images | null)[] | null;
  variants: (ProductDetails_product_variants | null)[] | null;
  productType: ProductDetails_product_productType;
  url: string;
}

export interface ProductDetails {
  product: ProductDetails_product | null;
}

export interface ProductDetailsVariables {
  id: string;
}
