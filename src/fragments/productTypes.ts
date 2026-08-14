import { gql } from "@apollo/client";

export const productTypeFragment = gql`
  fragment ProductType on ProductType {
    id
    name
    slug
    kind
    hasVariants
    isShippingRequired
    taxClass {
      id
      name
    }
  }
`;

export const productTypeDetailsFragment = gql`
  fragment ProductTypeDetails on ProductType {
    ...ProductType
    ...Metadata
    productAttributes {
      ...Attribute
      valueRequired
      choices(first: 1) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
    variantAttributes {
      ...Attribute
      valueRequired
    }
    assignedVariantAttributes {
      attribute {
        ...Attribute
        valueRequired
        choices(first: 1) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
      variantSelection
    }
    weight {
      unit
      value
    }
  }
`;
