import { gql } from "@apollo/client";

export const giftCardUpdate = gql`
  mutation GiftCardUpdate($id: ID!, $input: GiftCardUpdateInput!, $showCreatedBy: Boolean!) {
    giftCardUpdate(id: $id, input: $input) {
      errors {
        ...GiftCardError
      }
      giftCard {
        ...GiftCardData
        createdBy @include(if: $showCreatedBy) {
          ...UserBase
        }
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

export const giftCardAssignUser = gql`
  mutation GiftCardAssignUser($id: ID!, $userId: ID!) {
    giftCardAssignUser(id: $id, userId: $userId) {
      errors {
        ...GiftCardError
      }
      giftCard {
        ...GiftCardData
      }
    }
  }
`;

export const giftCardUnassignUser = gql`
  mutation GiftCardUnassignUser($id: ID!) {
    giftCardUnassignUser(id: $id) {
      errors {
        ...GiftCardError
      }
      giftCard {
        ...GiftCardData
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
