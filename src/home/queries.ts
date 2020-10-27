import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import { Home } from "./types/Home";

const home = gql`
  query Home($channel: String!) {
    salesToday: ordersTotal(period: TODAY, channel: $channel) {
      gross {
        amount
        currency
      }
    }
    ordersToday: orders(created: TODAY, channel: $channel) {
      totalCount
    }
    ordersToFulfill: orders(status: READY_TO_FULFILL, channel: $channel) {
      totalCount
    }
    ordersToCapture: orders(status: READY_TO_CAPTURE, channel: $channel) {
      totalCount
    }
    productsOutOfStock: products(
      stockAvailability: OUT_OF_STOCK
      channel: $channel
    ) {
      totalCount
    }
    productTopToday: reportProductSales(
      period: TODAY
      first: 5
      channel: $channel
    ) {
      edges {
        node {
          id
          revenue(period: TODAY) {
            gross {
              amount
              currency
            }
          }
          attributes {
            values {
              id
              name
            }
          }
          product {
            id
            name
            thumbnail {
              url
            }
          }
          quantityOrdered
        }
      }
    }
    activities: homepageEvents(last: 10) {
      edges {
        node {
          amount
          composedId
          date
          email
          emailType
          id
          message
          orderNumber
          oversoldItems
          quantity
          type
          user {
            id
            email
          }
        }
      }
    }
  }
`;
export const HomePageQuery = TypedQuery<Home, {}>(home);
