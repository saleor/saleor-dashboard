import { gql } from "@apollo/client";

export const shopSettingsUpdate = gql`
  mutation ShopSettingsUpdate(
    $shopDomainInput: SiteDomainInput!
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
    shopDomainUpdate(input: $shopDomainInput) @skip(if: $isCloudInstance) {
      errors {
        ...ShopError
      }
      shop {
        domain {
          host
          url
        }
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
