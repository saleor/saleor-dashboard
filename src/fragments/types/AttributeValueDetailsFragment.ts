/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AttributeValueDetailsFragment
// ====================================================

export interface AttributeValueDetailsFragment_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface AttributeValueDetailsFragment {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: AttributeValueDetailsFragment_file | null;
  reference: string | null;
  boolean: boolean | null;
  date: any | null;
  dateTime: any | null;
  value: string | null;
  richText: any | null;
}
