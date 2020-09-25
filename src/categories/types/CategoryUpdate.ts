/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CategoryInput, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: CategoryUpdate
// ====================================================

export interface CategoryUpdate_categoryUpdate_category_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CategoryUpdate_categoryUpdate_category_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CategoryUpdate_categoryUpdate_category_backgroundImage {
  __typename: "Image";
  alt: string | null;
  url: string;
}

export interface CategoryUpdate_categoryUpdate_category_parent {
  __typename: "Category";
  id: string;
}

export interface CategoryUpdate_categoryUpdate_category {
  __typename: "Category";
  id: string;
  metadata: (CategoryUpdate_categoryUpdate_category_metadata | null)[];
  privateMetadata: (CategoryUpdate_categoryUpdate_category_privateMetadata | null)[];
  backgroundImage: CategoryUpdate_categoryUpdate_category_backgroundImage | null;
  name: string;
  slug: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  parent: CategoryUpdate_categoryUpdate_category_parent | null;
}

export interface CategoryUpdate_categoryUpdate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface CategoryUpdate_categoryUpdate {
  __typename: "CategoryUpdate";
  category: CategoryUpdate_categoryUpdate_category | null;
  errors: CategoryUpdate_categoryUpdate_errors[];
}

export interface CategoryUpdate {
  categoryUpdate: CategoryUpdate_categoryUpdate | null;
}

export interface CategoryUpdateVariables {
  id: string;
  input: CategoryInput;
}
