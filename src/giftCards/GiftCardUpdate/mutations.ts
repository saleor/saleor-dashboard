import { giftCardErrorFragment } from "@saleor/fragments/errors";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import { giftCardDataFragment } from "./queries";
import {
  GiftCardAddNote,
  GiftCardAddNoteVariables
} from "./types/GiftCardAddNote";
import {
  GiftCardUpdate,
  GiftCardUpdateVariables
} from "./types/GiftCardUpdate";

const giftCardUpdate = gql`
  ${giftCardDataFragment}
  ${giftCardErrorFragment}
  mutation GiftCardUpdate($id: ID!, $input: GiftCardUpdateInput!) {
    giftCardUpdate(id: $id, input: $input) {
      errors {
        ...GiftCardError
      }
      giftCard {
        ...GiftCardData
      }
    }
  }
`;

export const useGiftCardUpdateMutation = makeMutation<
  GiftCardUpdate,
  GiftCardUpdateVariables
>(giftCardUpdate);

export const giftCardTimelineNoteAdd = gql`
  ${giftCardDataFragment}
  ${giftCardErrorFragment}
  mutation GiftCardAddNote($id: ID!, $input: GiftCardAddNoteInput!) {
    giftCardAddNote(id: $id, input: $input) {
      errors {
        ...GiftCardError
        message
      }
      giftCard {
        ...GiftCardData
      }
      event {
        expiryDate
        oldExpiryDate
        id
        date
        type
        user {
          ...UserBase
        }
        app {
          id
          name
        }
        message
        email
        orderId
        orderNumber
        tag
        oldTag
        balance {
          initialBalance {
            ...Money
          }
          currentBalance {
            ...Money
          }
          oldInitialBalance {
            ...Money
          }
          oldCurrentBalance {
            ...Money
          }
        }
      }
    }
  }
`;

export const useGiftCardTimelineNoteAddMutation = makeMutation<
  GiftCardAddNote,
  GiftCardAddNoteVariables
>(giftCardTimelineNoteAdd);
