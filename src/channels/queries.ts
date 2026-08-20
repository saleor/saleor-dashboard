import { gql } from "@apollo/client";

export const channelsListBase = gql`
  query BaseChannels {
    channels {
      ...Channel
    }
  }
`;

export const channelsList = gql`
  query Channels {
    channels {
      ...ChannelDetails
    }
  }
`;

/**
 * Zone→channel coverage for the channels list (single page, API max first: 100).
 * Callers must treat `hasNextPage` as incomplete/unknown — do not paginate on list mount.
 */
export const channelsListShippingCoverage = gql`
  query ChannelsListShippingCoverage {
    shippingZones(first: 100) {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          channels {
            id
          }
        }
      }
    }
  }
`;

export const channelDetails = gql`
  query Channel($id: ID!) {
    channel(id: $id) {
      ...ChannelDetails
      ...Metadata
    }
  }
`;

export const channelBySlug = gql`
  query ChannelBySlug($slug: String!) {
    channel(slug: $slug) {
      id
      slug
    }
  }
`;

export const defaultGraphiQLQuery = `query ChannelDetails($id: ID!) {
  channel(id: $id) {
    id
    name
    slug
    isActive
    currencyCode
    defaultCountry {
      code
      country
    }
  }
}`;

export const channelSetupReviewStats = gql`
  query ChannelSetupReviewStats($channelSlug: String!, $canFetchProducts: Boolean!) {
    allProducts: products @include(if: $canFetchProducts) {
      totalCount
    }
    listedInChannel: products(channel: $channelSlug) @include(if: $canFetchProducts) {
      totalCount
    }
    channelProducts: products(channel: $channelSlug, filter: { isPublished: true })
      @include(if: $canFetchProducts) {
      totalCount
    }
    unpublishedInChannel: products(channel: $channelSlug, filter: { isPublished: false })
      @include(if: $canFetchProducts) {
      totalCount
    }
    recentlyPublishedProducts: products(
      channel: $channelSlug
      first: 3
      filter: { isPublished: true }
      sortBy: { field: PUBLISHED_AT, direction: DESC }
    ) @include(if: $canFetchProducts) {
      edges {
        node {
          id
          name
          thumbnail(size: 128) {
            url
          }
        }
      }
    }
  }
`;

export const channelPaymentApps = gql`
  query ChannelPaymentApps {
    apps(first: 100, filter: { isActive: true, type: THIRDPARTY }) {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          name
          isActive
          type
          appUrl
          permissions {
            code
          }
          brand {
            logo {
              default(format: WEBP, size: 64)
            }
          }
        }
      }
    }
  }
`;

export const bulkPublishProductsData = gql`
  query BulkPublishProductsData($ids: [ID!]!, $first: Int!) {
    products(first: $first, where: { ids: $ids }) {
      edges {
        node {
          id
          name
          category {
            id
          }
          channelListings {
            channel {
              id
            }
          }
          productVariants(first: 1) {
            totalCount
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export const bulkPublishProductPrices = gql`
  query BulkPublishProductPrices($ids: [ID!]!, $first: Int!, $variantsFirst: Int!) {
    products(first: $first, where: { ids: $ids }) {
      edges {
        node {
          id
          productVariants(first: $variantsFirst) {
            totalCount
            edges {
              node {
                id
                channelListings {
                  id
                  channel {
                    id
                  }
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const bulkPublishProductVariants = gql`
  query BulkPublishProductVariants($id: ID!, $first: Int!, $after: String) {
    product(id: $id) {
      id
      productVariants(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            channelListings {
              id
              channel {
                id
              }
              price {
                amount
              }
            }
            stocks {
              id
              warehouse {
                id
              }
            }
          }
        }
      }
    }
  }
`;
