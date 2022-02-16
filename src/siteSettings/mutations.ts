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
        ...ShopErrorFragment
      }
      shop {
        ...ShopFragment
      }
    }
    shopDomainUpdate(input: $shopDomainInput) @skip(if: $isCloudInstance) {
      errors {
        ...ShopErrorFragment
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
        ...ShopErrorFragment
      }
      shop {
        companyAddress {
          ...AddressFragment
        }
      }
    }
  }
`;
