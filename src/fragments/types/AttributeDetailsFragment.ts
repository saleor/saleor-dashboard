/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeValueType } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: AttributeDetailsFragment
// ====================================================

export interface AttributeDetailsFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AttributeDetailsFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AttributeDetailsFragment_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeValueType | null;
}

export interface AttributeDetailsFragment {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
  metadata: (AttributeDetailsFragment_metadata | null)[];
  privateMetadata: (AttributeDetailsFragment_privateMetadata | null)[];
  availableInGrid: boolean;
  inputType: AttributeInputTypeEnum | null;
  storefrontSearchPosition: number;
  values: (AttributeDetailsFragment_values | null)[] | null;
}
