import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import {
  GiftCardUpdate,
  GiftCardUpdateVariables
} from "./types/GiftCardUpdate";

const giftCardUpdate = gql`
  mutation GiftCardUpdate($id: ID!, $input: GiftCardUpdateInput!) {
    giftCardUpdate(id: $id, input: $input) {
      errors {
        code
        field
      }
    }
  }
`;

export const useGiftCardUpdateMutation = makeMutation<
  GiftCardUpdate,
  GiftCardUpdateVariables
>(giftCardUpdate);
