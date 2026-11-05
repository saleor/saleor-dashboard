import { gql } from "@apollo/client";

export const shopSettingsUpdate = gql`
  mutation ShopSettingsUpdate(
    $shopSettingsInput: ShopSettingsInput!
    $addressInput: AddressInput
    $updateAddress: Boolean!
  ) {
    shopSettingsUpdate(input: $shopSettingsInput) {
      errors {
        ...ShopError
      }
      shop {
        ...Shop
      }
    }
    shopAddressUpdate(input: $addressInput) @include(if: $updateAddress) {
      errors {
        ...ShopError
      }
      shop {
        companyAddress {
          ...Address
        }
      }
    }
  }
`;
