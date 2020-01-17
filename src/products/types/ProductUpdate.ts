/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeValueInput, SeoInput, AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductUpdate
// ====================================================

export interface ProductUpdate_productUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
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

export interface ProductUpdate_productUpdate_product_basePrice {
  __typename: "Money";
  amount: number;
  currency: string;
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

export interface ProductUpdate_productUpdate_product_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductUpdate_productUpdate_product_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductUpdate_productUpdate_product_pricing_priceRange_start_net;
}

export interface ProductUpdate_productUpdate_product_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductUpdate_productUpdate_product_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductUpdate_productUpdate_product_pricing_priceRange_stop_net;
}

export interface ProductUpdate_productUpdate_product_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductUpdate_productUpdate_product_pricing_priceRange_start | null;
  stop: ProductUpdate_productUpdate_product_pricing_priceRange_stop | null;
}

export interface ProductUpdate_productUpdate_product_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductUpdate_productUpdate_product_pricing_priceRange | null;
}

export interface ProductUpdate_productUpdate_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductUpdate_productUpdate_product_variants_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductUpdate_productUpdate_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  priceOverride: ProductUpdate_productUpdate_product_variants_priceOverride | null;
  margin: number | null;
  quantity: number;
  quantityAllocated: number | null;
  stockQuantity: number;
}

export interface ProductUpdate_productUpdate_product_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface ProductUpdate_productUpdate_product {
  __typename: "Product";
  id: string;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: ProductUpdate_productUpdate_product_category | null;
  collections: (ProductUpdate_productUpdate_product_collections | null)[] | null;
  basePrice: ProductUpdate_productUpdate_product_basePrice | null;
  margin: ProductUpdate_productUpdate_product_margin | null;
  purchaseCost: ProductUpdate_productUpdate_product_purchaseCost | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  attributes: ProductUpdate_productUpdate_product_attributes[];
  pricing: ProductUpdate_productUpdate_product_pricing | null;
  images: (ProductUpdate_productUpdate_product_images | null)[] | null;
  variants: (ProductUpdate_productUpdate_product_variants | null)[] | null;
  productType: ProductUpdate_productUpdate_product_productType;
  url: string;
}

export interface ProductUpdate_productUpdate {
  __typename: "ProductUpdate";
  errors: ProductUpdate_productUpdate_errors[] | null;
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
}
