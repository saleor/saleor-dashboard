// @ts-strict-ignore
import { gql } from "@apollo/client";
import { getOperationAST } from "graphql";

// `User.giftCards` is the canonical "this user's gift cards" resolver. Note
// that, like the top-level `giftCards(filter: { usedBy })` query, it only
// returns cards the customer has *redeemed* — its dataloader filters by
// `used_by_id` (see `GiftCardsByUserLoader` in Saleor core). Saleor's data
// model has no persisted "issued to" link on `GiftCard`, so cards just issued
// from the dashboard appear here only after the customer applies the code at
// checkout. We still prefer this resolver over the top-level filter because
// it doesn't require MANAGE_GIFT_CARD on the requestor (storefront-friendly).
export const customerGiftCardListQuery = gql`
  query CustomerGiftCardList($userId: ID!, $first: Int) {
    user(id: $userId) {
      id
      giftCards(first: $first) {
        edges {
          node {
            ...CustomerGiftCard
          }
        }
      }
    }
  }
`;

export const CUSTOMER_GIFT_CARD_LIST_QUERY = getOperationAST(customerGiftCardListQuery).name.value;
