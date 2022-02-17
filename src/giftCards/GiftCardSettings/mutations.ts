import { gql } from "@apollo/client";

export const giftCardSettingsUpdate = gql`
  mutation GiftCardSettingsUpdate($input: GiftCardSettingsUpdateInput!) {
    giftCardSettingsUpdate(input: $input) {
      errors {
        ...GiftCardSettingsError
      }
      giftCardSettings {
        ...GiftCardsSettings
      }
    }
  }
`;
