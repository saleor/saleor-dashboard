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
    }
    assignedVariantAttributes {
      attribute {
        ...Attribute
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
