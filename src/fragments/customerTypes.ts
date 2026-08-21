import { gql } from "@apollo/client";

export const customerTypeFragment = gql`
  fragment CustomerType on CustomerType {
    id
    name
    slug
    isDefault
  }
`;

export const customerTypeDetailsFragment = gql`
  fragment CustomerTypeDetails on CustomerType {
    ...CustomerType
    # Saleor currently 500s on CustomerType.privateMetadata (MODEL_TO_TYPE_MAP).
    # Restore ...Metadata once that resolver maps CustomerType.
    metadata {
      ...MetadataItem
    }
    attributes {
      ...Attribute
      valueRequired
    }
  }
`;
