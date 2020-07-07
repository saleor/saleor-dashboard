import gql from "graphql-tag";

export const attributeFragment = gql`
  fragment AttributeFragment on Attribute {
    id
    name
    slug
    visibleInStorefront
    filterableInDashboard
    filterableInStorefront
  }
`;

export const attributeDetailsFragment = gql`
  ${attributeFragment}
  fragment AttributeDetailsFragment on Attribute {
    ...AttributeFragment
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
