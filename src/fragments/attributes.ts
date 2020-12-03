import gql from "graphql-tag";

import { metadataFragment } from "./metadata";

export const attributeValueFragment = gql`
  fragment AttributeValueFragment on AttributeValue {
    id
    name
    slug
    file {
      url
      contentType
    }
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
  }
`;

export const attributeDetailsFragment = gql`
  ${attributeFragment}
  ${metadataFragment}
  ${attributeValueFragment}
  fragment AttributeDetailsFragment on Attribute {
    ...AttributeFragment
    ...MetadataFragment
    availableInGrid
    inputType
    storefrontSearchPosition
    valueRequired
    values {
      ...AttributeValueFragment
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
