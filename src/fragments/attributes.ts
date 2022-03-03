import { gql } from "@apollo/client";

import { fileFragment } from "./file";
import { metadataFragment } from "./metadata";
import { pageInfoFragment } from "./pageInfo";

export const attributeValueFragment = gql`
  ${fileFragment}
  fragment AttributeValueFragment on AttributeValue {
    id
    name
    slug
    file {
      ...FileFragment
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
  fragment AttributeValueDetailsFragment on AttributeValue {
    ...AttributeValueFragment
    richText
  }
`;

export const attributeFragment = gql`
  fragment AttributeFragment on Attribute {
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
  ${attributeFragment}
  ${metadataFragment}
  fragment AttributeDetailsFragment on Attribute {
    ...AttributeFragment
    ...MetadataFragment
    availableInGrid
    inputType
    entityType
    unit
    storefrontSearchPosition
    valueRequired
  }
`;

export const attributeValueListFragment = gql`
  ${attributeValueDetailsFragment}
  ${pageInfoFragment}
  fragment AttributeValueListFragment on AttributeValueCountableConnection {
    pageInfo {
      ...PageInfoFragment
    }
    edges {
      cursor
      node {
        ...AttributeValueDetailsFragment
      }
    }
  }
`;

export const availableAttributeFragment = gql`
  fragment AvailableAttributeFragment on Attribute {
    id
    name
    slug
  }
`;
