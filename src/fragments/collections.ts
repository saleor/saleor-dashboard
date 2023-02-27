import { gql } from "@apollo/client";

export const collectionFragment = gql`
  fragment Collection on Collection {
    id
    name
    channelListings {
      isPublished
      publicationDate
      channel {
        id
        name
      }
    }
  }
`;

export const collectionDetailsFragment = gql`
  fragment CollectionDetails on Collection {
    ...Collection
    ...Metadata
    backgroundImage {
      alt
      url
    }
    slug
    description
    seoDescription
    seoTitle
  }
`;

export const collectionProductFragment = gql`
  fragment CollectionProduct on Product {
    id
    name
    productType {
      id
      name
    }
    thumbnail {
      url
    }
    channelListings {
      ...ChannelListingProductWithoutPricing
    }
  }
`;
