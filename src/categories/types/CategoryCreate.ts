/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CategoryInput, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: CategoryCreate
// ====================================================

export interface CategoryCreate_categoryCreate_category_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CategoryCreate_categoryCreate_category_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CategoryCreate_categoryCreate_category_backgroundImage {
  __typename: "Image";
  alt: string | null;
  url: string;
}

export interface CategoryCreate_categoryCreate_category_parent {
  __typename: "Category";
  id: string;
}

export interface CategoryCreate_categoryCreate_category {
  __typename: "Category";
  id: string;
  metadata: (CategoryCreate_categoryCreate_category_metadata | null)[];
  privateMetadata: (CategoryCreate_categoryCreate_category_privateMetadata | null)[];
  backgroundImage: CategoryCreate_categoryCreate_category_backgroundImage | null;
  name: string;
  slug: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  parent: CategoryCreate_categoryCreate_category_parent | null;
}

export interface CategoryCreate_categoryCreate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface CategoryCreate_categoryCreate {
  __typename: "CategoryCreate";
  category: CategoryCreate_categoryCreate_category | null;
  errors: CategoryCreate_categoryCreate_errors[];
}

export interface CategoryCreate {
  categoryCreate: CategoryCreate_categoryCreate | null;
}

export interface CategoryCreateVariables {
  parent?: string | null;
  input: CategoryInput;
}
