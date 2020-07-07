import gql from "graphql-tag";

export const collectionFragment = gql`
  fragment CollectionFragment on Collection {
    id
    isPublished
    name
  }
`;

export const collectionDetailsFragment = gql`
  ${collectionFragment}
  fragment CollectionDetailsFragment on Collection {
    ...CollectionFragment
    backgroundImage {
      alt
      url
    }
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
