import { gql } from "@apollo/client";

export const giftCardUpdate = gql`
  mutation GiftCardUpdate($id: ID!, $input: GiftCardUpdateInput!) {
    giftCardUpdate(id: $id, input: $input) {
      errors {
        ...GiftCardError
      }
      giftCard {
        ...GiftCardData
        events {
          ...GiftCardEvent
        }
      }
    }
  }
`;

export const giftCardTimelineNoteAdd = gql`
  mutation GiftCardAddNote($id: ID!, $input: GiftCardAddNoteInput!) {
    giftCardAddNote(id: $id, input: $input) {
      errors {
        ...GiftCardError
      }
      giftCard {
        ...GiftCardData
      }
      event {
        ...GiftCardEvent
      }
    }
  }
`;

export const giftCardBulkActivate = gql`
  mutation GiftCardBulkActivate($ids: [ID!]!) {
    giftCardBulkActivate(ids: $ids) {
      errors {
        ...GiftCardError
      }
      count
    }
  }
`;

export const giftCardBulkDeactivate = gql`
  mutation GiftCardBulkDeactivate($ids: [ID!]!) {
    giftCardBulkDeactivate(ids: $ids) {
      errors {
        ...GiftCardError
      }
      count
    }
  }
`;
