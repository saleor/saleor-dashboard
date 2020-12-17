import { fragmentAddress } from "@saleor/fragments/address";
import { shopErrorFragment } from "@saleor/fragments/errors";
import { shopFragment } from "@saleor/fragments/shop";
import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import {
  ShopSettingsUpdate,
  ShopSettingsUpdateVariables
} from "./types/ShopSettingsUpdate";

const shopSettingsUpdate = gql`
  ${shopErrorFragment}
  ${shopFragment}
  ${fragmentAddress}
  mutation ShopSettingsUpdate(
    $shopDomainInput: SiteDomainInput!
    $shopSettingsInput: ShopSettingsInput!
    $addressInput: AddressInput
  ) {
    shopSettingsUpdate(input: $shopSettingsInput) {
      errors: shopErrors {
        ...ShopErrorFragment
      }
      shop {
        ...ShopFragment
      }
    }
    shopDomainUpdate(input: $shopDomainInput) {
      errors: shopErrors {
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
      errors: shopErrors {
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
export const TypedShopSettingsUpdate = TypedMutation<
  ShopSettingsUpdate,
  ShopSettingsUpdateVariables
>(shopSettingsUpdate);
