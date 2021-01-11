import gql from "graphql-tag";

import { metadataFragment } from "./metadata";

export const collectionFragment = gql`
  fragment CollectionFragment on Collection {
    id
    isPublished
    name
  }
`;

export const collectionDetailsFragment = gql`
  ${collectionFragment}
  ${metadataFragment}
  fragment CollectionDetailsFragment on Collection {
    ...CollectionFragment
    ...MetadataFragment
    backgroundImage {
      alt
      url
    }
    slug
    descriptionJson
    publicationDate
    seoDescription
    seoTitle
    isPublished
  }
`;

// This fragment is used to make sure that product's fields that are returned
// are always the same - fixes apollo cache
// https://github.com/apollographql/apollo-client/issues/2496
// https://github.com/apollographql/apollo-client/issues/3468
export const collectionProductFragment = gql`
  fragment CollectionProductFragment on Product {
    id
    isPublished
    name
    productType {
      id
      name
    }
    thumbnail {
      url
    }
  }
`;
