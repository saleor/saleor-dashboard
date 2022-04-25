import { gql } from "@apollo/client";

export const shopSettingsUpdate = gql`
  mutation ShopSettingsUpdate(
    $shopSettingsInput: ShopSettingsInput!
    $addressInput: AddressInput
    $isCloudInstance: Boolean!
  ) {
    shopSettingsUpdate(input: $shopSettingsInput) {
      errors {
        ...ShopError
      }
      shop {
        ...Shop
      }
    }
    shopAddressUpdate(input: $addressInput) {
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
