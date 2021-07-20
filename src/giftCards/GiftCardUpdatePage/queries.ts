import { metadataFragment } from "@saleor/fragments/metadata";
import { fragmentMoney } from "@saleor/fragments/products";
import gql from "graphql-tag";

export const giftCardDetails = gql`
  ${fragmentMoney}
  ${metadataFragment}
  query GiftCardDetails($id: ID!) {
    giftCard(id: $id) {
      ...MetadataFragment
      code
      user {
        id
        firstName
        lastName
      }
      usedBy {
        id
        firstName
        lastName
      }
      usedByEmail
      createdByEmail
      app {
        id
        name
      }
      created
      expiryDate
      expiryType
      expiryPeriod {
        amount
        type
      }
      lastUsedOn
      isActive
      initialBalance {
        ...Money
      }
      currentBalance {
        ...Money
      }
      id
      displayCode
      tag
    }
  }
`;
