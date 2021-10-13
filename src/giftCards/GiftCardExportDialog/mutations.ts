import { exportErrorFragment } from "@saleor/fragments/errors";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

const exportGiftCards = gql`
  ${exportErrorFragment}
  mutation ExportGiftCards($input: ExportGiftCardsInput!) {
    exportGiftCards(input: $input) {
      errors {
        ...ExportErrorFragment
      }
    }
  }
`;

export const useGiftCardExportMutation = makeMutation<
  ExportGiftCards,
  ExportGiftCardsVariables
>(exportGiftCards);
