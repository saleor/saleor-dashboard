import { gql } from "@apollo/client";

export const appFailedPendingWebhooks = gql`
  query AppFailedPendingWebhooks($PERMISSION_MANAGE_APPS: Boolean!) {
    apps(first: 50, filter: { type: THIRDPARTY }) {
      edges {
        node {
          ...AppEventDeliveries
        }
      }
    }
  }
`;
