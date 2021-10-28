import gql from "graphql-tag";

import { attributeFragment } from "./attributes";
import { metadataFragment } from "./metadata";

export const productTypeFragment = gql`
  fragment ProductTypeFragment on ProductType {
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
  ${attributeFragment}
  ${productTypeFragment}
  ${metadataFragment}
  fragment ProductTypeDetailsFragment on ProductType {
    ...ProductTypeFragment
    ...MetadataFragment
    productAttributes {
      ...AttributeFragment
    }
    variantAttributes {
      ...AttributeFragment
    }
    assignedVariantAttributes {
      attribute {
        ...AttributeFragment
      }
      variantSelection
    }
    weight {
      unit
      value
    }
  }
`;
