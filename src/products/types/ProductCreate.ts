/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeValueInput, SeoInput, StockInput, ProductErrorCode, AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductCreate
// ====================================================

export interface ProductCreate_productCreate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductCreate_productCreate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductCreate_productCreate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductCreate_productCreate_product_attributes_attribute_values | null)[] | null;
}

export interface ProductCreate_productCreate_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductCreate_productCreate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductCreate_productCreate_product_attributes_attribute;
  values: (ProductCreate_productCreate_product_attributes_values | null)[];
}

export interface ProductCreate_productCreate_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductCreate_productCreate_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (ProductCreate_productCreate_product_productType_variantAttributes_values | null)[] | null;
  filterableInStorefront: boolean;
  visibleInStorefront: boolean;
}

export interface ProductCreate_productCreate_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductCreate_productCreate_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
}

export interface ProductCreate_productCreate_product_pricing_priceRangeUndiscounted_start_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductCreate_productCreate_product_pricing_priceRangeUndiscounted_start {
  __typename: "TaxedMoney";
  gross: ProductCreate_productCreate_product_pricing_priceRangeUndiscounted_start_gross;
}

export interface ProductCreate_productCreate_product_pricing_priceRangeUndiscounted_stop_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductCreate_productCreate_product_pricing_priceRangeUndiscounted_stop {
  __typename: "TaxedMoney";
  gross: ProductCreate_productCreate_product_pricing_priceRangeUndiscounted_stop_gross;
}

export interface ProductCreate_productCreate_product_pricing_priceRangeUndiscounted {
  __typename: "TaxedMoneyRange";
  start: ProductCreate_productCreate_product_pricing_priceRangeUndiscounted_start | null;
  stop: ProductCreate_productCreate_product_pricing_priceRangeUndiscounted_stop | null;
}

export interface ProductCreate_productCreate_product_pricing {
  __typename: "ProductPricingInfo";
  priceRangeUndiscounted: ProductCreate_productCreate_product_pricing_priceRangeUndiscounted | null;
}

export interface ProductCreate_productCreate_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductCreate_productCreate_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductCreate_productCreate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductCreate_productCreate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductCreate_productCreate_product_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface ProductCreate_productCreate_product_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductCreate_productCreate_product_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductCreate_productCreate_product_purchaseCost {
  __typename: "MoneyRange";
  start: ProductCreate_productCreate_product_purchaseCost_start | null;
  stop: ProductCreate_productCreate_product_purchaseCost_stop | null;
}

export interface ProductCreate_productCreate_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductCreate_productCreate_product_variants_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductCreate_productCreate_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductCreate_productCreate_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductCreate_productCreate_product_variants_stocks_warehouse;
}

export interface ProductCreate_productCreate_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  price: ProductCreate_productCreate_product_variants_price | null;
  margin: number | null;
  stocks: (ProductCreate_productCreate_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
}

export interface ProductCreate_productCreate_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductCreate_productCreate_product {
  __typename: "Product";
  id: string;
  attributes: ProductCreate_productCreate_product_attributes[];
  productType: ProductCreate_productCreate_product_productType;
  pricing: ProductCreate_productCreate_product_pricing | null;
  metadata: (ProductCreate_productCreate_product_metadata | null)[];
  privateMetadata: (ProductCreate_productCreate_product_privateMetadata | null)[];
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: ProductCreate_productCreate_product_category | null;
  collections: (ProductCreate_productCreate_product_collections | null)[] | null;
  margin: ProductCreate_productCreate_product_margin | null;
  purchaseCost: ProductCreate_productCreate_product_purchaseCost | null;
  isAvailableForPurchase: boolean | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  images: (ProductCreate_productCreate_product_images | null)[] | null;
  variants: (ProductCreate_productCreate_product_variants | null)[] | null;
  weight: ProductCreate_productCreate_product_weight | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductCreate_productCreate {
  __typename: "ProductCreate";
  errors: ProductCreate_productCreate_errors[];
  product: ProductCreate_productCreate_product | null;
}

export interface ProductCreate {
  productCreate: ProductCreate_productCreate | null;
}

export interface ProductCreateVariables {
  attributes?: (AttributeValueInput | null)[] | null;
  publicationDate?: any | null;
  category: string;
  chargeTaxes: boolean;
  collections?: (string | null)[] | null;
  descriptionJson?: any | null;
  isPublished: boolean;
  name: string;
  basePrice?: any | null;
  productType: string;
  sku?: string | null;
  seo?: SeoInput | null;
  stocks: StockInput[];
  trackInventory: boolean;
  weight?: any | null;
  visibleInListings?: boolean | null;
}
