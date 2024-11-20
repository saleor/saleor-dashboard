import { gql } from "@apollo/client";

export const newHomeNotifications = gql`
  query homeNotifications($channel: String!) {
    productsOutOfStock: products(filter: { stockAvailability: OUT_OF_STOCK }, channel: $channel) {
      totalCount
    }
  }
`;
