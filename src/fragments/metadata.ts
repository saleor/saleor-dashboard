import { gql } from "@apollo/client";

export const metadataFragment = gql`
  fragment MetadataItem on MetadataItem {
    key
    value
  }
  fragment MetadataFragment on ObjectWithMetadata {
    metadata {
      ...MetadataItem
    }
    privateMetadata {
      ...MetadataItem
    }
  }
`;
