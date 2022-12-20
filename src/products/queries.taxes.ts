import { gql } from "@apollo/client";

export const productDetailsWithTaxesQuery = gql`
  query ProductDetailsWithTaxes(
    $id: ID!
    $channel: String
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    product(id: $id, channel: $channel) {
      ...ProductVariantAttributes
      ...Metadata
      name
      slug
      description
      seoTitle
      seoDescription
      rating
      defaultVariant {
        id
      }
      category {
        id
        name
      }
      collections {
        id
        name
      }
      channelListings {
        ...ChannelListingProductWithoutPricing
      }
      media {
        ...ProductMedia
      }
      isAvailable
      variants {
        ...ProductDetailsVariant
      }
      productType {
        id
        name
        hasVariants
      }
      weight {
        ...Weight
      }
      taxClass {
        id
        name
      }
    }
  }
`;
