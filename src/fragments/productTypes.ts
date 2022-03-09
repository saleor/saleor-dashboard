import { gql } from "@apollo/client";

export const productTypeFragment = gql`
  fragment ProductType on ProductType {
    id
    name
    kind
    hasVariants
    isShippingRequired
    taxType {
      description
      taxCode
    }
  }
`;

export const productTypeDetailsFragment = gql`
  fragment ProductTypeDetails on ProductType {
    ...ProductType
    ...Metadata
    productAttributes {
      ...Attribute
    }
    variantAttributes {
      ...Attribute
    }
    assignedVariantAttributes {
      attribute {
        ...Attribute
      }
      variantSelection
    }
    weight {
      unit
      value
    }
  }
`;
