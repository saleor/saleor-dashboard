import { gql } from "@apollo/client";

export const shopSettingsUpdateStaging = gql`
  mutation ShopSettingsUpdateStaging(
    $shopSettingsInput: ShopSettingsInput!
    $addressInput: AddressInput
  ) {
    shopSettingsUpdate(input: $shopSettingsInput) {
      errors {
        code
        field
        message
      }
      shop {
        ...ShopStaging
      }
    }
    shopAddressUpdate(input: $addressInput) {
      errors {
        code
        field
        message
      }
      shop {
        companyAddress {
          ...Address
        }
      }
    }
  }
`;
