// @ts-strict-ignore
import { gql } from "@apollo/client";
import { getOperationAST } from "graphql";

export const giftCardDetails = gql`
  query GiftCardDetails($id: ID!, $canSeeApp: Boolean!, $canSeeUser: Boolean!) {
    giftCard(id: $id) {
      ...GiftCardData
      events {
        ...GiftCardEvent
        app @include(if: $canSeeApp) {
          id
          name
          brand {
            logo {
              default(size: 128)
            }
          }
        }
        user @include(if: $canSeeUser) {
          ...UserBase
          email
          avatar(size: 128) {
            url
          }
        }
      }
    }
  }
`;

export const GIFT_CARD_DETAILS_QUERY = getOperationAST(giftCardDetails).name.value;
