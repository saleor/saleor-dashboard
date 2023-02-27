import { gql } from "@apollo/client";

export const exportGiftCards = gql`
  mutation ExportGiftCards($input: ExportGiftCardsInput!) {
    exportGiftCards(input: $input) {
      errors {
        ...ExportError
      }
      exportFile {
        id
      }
    }
  }
`;
