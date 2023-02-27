import { gql } from "@apollo/client";

export const attributeValueFragment = gql`
  fragment AttributeValue on AttributeValue {
    id
    name
    slug
    file {
      ...File
    }
    reference
    boolean
    date
    dateTime
    value
  }
`;

export const attributeValueDetailsFragment = gql`
  ${attributeValueFragment}
  fragment AttributeValueDetails on AttributeValue {
    ...AttributeValue
    plainText
    richText
  }
`;

export const attributeFragment = gql`
  fragment Attribute on Attribute {
    id
    name
    slug
    type
    visibleInStorefront
    filterableInDashboard
    filterableInStorefront
    unit
    inputType
  }
`;

export const attributeDetailsFragment = gql`
  fragment AttributeDetails on Attribute {
    ...Attribute
    ...Metadata
    availableInGrid
    inputType
    entityType
    unit
    storefrontSearchPosition
    valueRequired
  }
`;

export const attributeValueListFragment = gql`
  fragment AttributeValueList on AttributeValueCountableConnection {
    pageInfo {
      ...PageInfo
    }
    edges {
      cursor
      node {
        ...AttributeValueDetails
      }
    }
  }
`;

export const availableAttributeFragment = gql`
  fragment AvailableAttribute on Attribute {
    id
    name
    slug
  }
`;
