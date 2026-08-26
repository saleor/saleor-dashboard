import { gql } from "@apollo/client";

// `exportGiftCards` was removed from `Mutation` in 3.24 — the whole operation, not just a field —
// so every entry point is gated behind `isMainSchema()`. The lock records that here.
export const exportGiftCards = gql`
  mutation ExportGiftCards($input: ExportGiftCardsInput!) @lockSchema(schema: "main") {
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
