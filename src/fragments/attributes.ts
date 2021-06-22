import gql from "graphql-tag";

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
    richText
    boolean
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
  ${attributeValueFragment}
  ${pageInfoFragment}
  fragment AttributeValueListFragment on AttributeValueCountableConnection {
    pageInfo {
      ...PageInfoFragment
    }
    edges {
      cursor
      node {
        ...AttributeValueFragment
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
