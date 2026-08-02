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
    channelProducts: products(channel: $channelSlug, filter: { isPublished: true })
      @include(if: $canFetchProducts) {
      totalCount
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
