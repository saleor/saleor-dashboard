import gql from "graphql-tag";

import { metadataFragment } from "./metadata";

export const attributeFragment = gql`
  fragment AttributeFragment on Attribute {
    id
    name
    slug
    valueRequired
    visibleInStorefront
    filterableInDashboard
    filterableInStorefront
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
    storefrontSearchPosition
    valueRequired
    values {
      id
      name
      slug
      type
    }
  }
`;
