import { gql } from "@apollo/client";

export const appFragment = gql`
  fragment App on App {
    id
    name
    created
    isActive
    type
    homepageUrl
    appUrl
    configurationUrl
    supportUrl
    version
    accessToken
    privateMetadata {
      key
      value
    }
    metadata {
      key
      value
    }
    tokens {
      authToken
      id
      name
    }
    webhooks {
      ...Webhook
    }
  }
`;
