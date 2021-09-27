/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AttributeValueFragment
// ====================================================

export interface AttributeValueFragment_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface AttributeValueFragment {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: AttributeValueFragment_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
  date: any | null;
  dateTime: any | null;
  value: string | null;
}
