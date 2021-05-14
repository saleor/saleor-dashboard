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
  }
`;

export const attributeDetailsFragment = gql`
  ${attributeFragment}
  ${metadataFragment}
  ${attributeValueFragment}
  ${pageInfoFragment}
  fragment AttributeDetailsFragment on Attribute {
    ...AttributeFragment
    ...MetadataFragment
    availableInGrid
    inputType
    entityType
    unit
    storefrontSearchPosition
    valueRequired
    values(
      first: $firstValues
      after: $afterValues
      last: $lastValues
      before: $beforeValues
    ) {
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
  }
`;

export const availableAttributeFragment = gql`
  fragment AvailableAttributeFragment on Attribute {
    id
    name
    slug
  }
`;
