import { gql } from "@apollo/client";

export const giftCardSettingsUpdate = gql`
  mutation GiftCardSettingsUpdate($input: GiftCardSettingsUpdateInput!) {
    giftCardSettingsUpdate(input: $input) {
      errors {
        ...GiftCardSettingsErrorFragment
      }
      giftCardSettings {
        ...GiftCardsSettingsFragment
      }
    }
  }
`;
