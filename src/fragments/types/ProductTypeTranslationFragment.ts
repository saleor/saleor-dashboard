/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProductTypeTranslationFragment
// ====================================================

export interface ProductTypeTranslationFragment_product_productType_productAttributes_translation {
  __typename: "AttributeTranslation";
  id: string;
  name: string;
}

export interface ProductTypeTranslationFragment_product_productType_productAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  translation: ProductTypeTranslationFragment_product_productType_productAttributes_translation | null;
}

export interface ProductTypeTranslationFragment_product_productType_variantAttributes_translation {
  __typename: "AttributeTranslation";
  id: string;
  name: string;
}

export interface ProductTypeTranslationFragment_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  translation: ProductTypeTranslationFragment_product_productType_variantAttributes_translation | null;
}

export interface ProductTypeTranslationFragment_product_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  productAttributes: (ProductTypeTranslationFragment_product_productType_productAttributes | null)[] | null;
  variantAttributes: (ProductTypeTranslationFragment_product_productType_variantAttributes | null)[] | null;
}

export interface ProductTypeTranslationFragment_product {
  __typename: "Product";
  productType: ProductTypeTranslationFragment_product_productType;
}

export interface ProductTypeTranslationFragment {
  __typename: "ProductTranslatableContent";
  product: ProductTypeTranslationFragment_product | null;
}
