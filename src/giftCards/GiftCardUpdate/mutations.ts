import { giftCardErrorFragment } from "@saleor/fragments/errors";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import { giftCardDataFragment, giftCardEventsFragment } from "./queries";
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
  ${giftCardEventsFragment}
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

export const useGiftCardUpdateMutation = makeMutation<
  GiftCardUpdate,
  GiftCardUpdateVariables
>(giftCardUpdate);

export const giftCardTimelineNoteAdd = gql`
  ${giftCardDataFragment}
  ${giftCardErrorFragment}
  ${giftCardEventsFragment}
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
        ...GiftCardEvent
      }
    }
  }
`;

export const useGiftCardTimelineNoteAddMutation = makeMutation<
  GiftCardAddNote,
  GiftCardAddNoteVariables
>(giftCardTimelineNoteAdd);
