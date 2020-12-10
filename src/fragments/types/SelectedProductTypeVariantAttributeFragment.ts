/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: SelectedProductTypeVariantAttributeFragment
// ====================================================

export interface SelectedProductTypeVariantAttributeFragment_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SelectedProductTypeVariantAttributeFragment_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SelectedProductTypeVariantAttributeFragment_values_file | null;
}

export interface SelectedProductTypeVariantAttributeFragment {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (SelectedProductTypeVariantAttributeFragment_values | null)[] | null;
}
