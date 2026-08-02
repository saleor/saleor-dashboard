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
  query ChannelSetupReviewStats(
    $channelSlug: String!
    $canFetchApps: Boolean!
    $canFetchProducts: Boolean!
  ) {
    allProducts: products @include(if: $canFetchProducts) {
      totalCount
    }
    channelProducts: products(channel: $channelSlug, filter: { isPublished: true })
      @include(if: $canFetchProducts) {
      totalCount
    }
    apps(first: 100, filter: { isActive: true }) @include(if: $canFetchApps) {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          permissions {
            code
          }
        }
      }
    }
  }
`;
