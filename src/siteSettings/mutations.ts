import { fragmentAddress } from "@saleor/fragments/address";
import { shopErrorFragment } from "@saleor/fragments/errors";
import { shopFragment } from "@saleor/fragments/shop";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import {
  AuthorizationKeyAdd,
  AuthorizationKeyAddVariables
} from "./types/AuthorizationKeyAdd";
import {
  AuthorizationKeyDelete,
  AuthorizationKeyDeleteVariables
} from "./types/AuthorizationKeyDelete";
import {
  ShopSettingsUpdate,
  ShopSettingsUpdateVariables
} from "./types/ShopSettingsUpdate";

const authorizationKeyAdd = gql`
  ${shopErrorFragment}
  ${shopFragment}
  mutation AuthorizationKeyAdd(
    $input: AuthorizationKeyInput!
    $keyType: AuthorizationKeyType!
  ) {
    authorizationKeyAdd(input: $input, keyType: $keyType) {
      errors: shopErrors {
        ...ShopErrorFragment
      }
      shop {
        ...ShopFragment
      }
    }
  }
`;
export const useAuthorizationKeyAdd = makeMutation<
  AuthorizationKeyAdd,
  AuthorizationKeyAddVariables
>(authorizationKeyAdd);

const authorizationKeyDelete = gql`
  ${shopErrorFragment}
  ${shopFragment}
  mutation AuthorizationKeyDelete($keyType: AuthorizationKeyType!) {
    authorizationKeyDelete(keyType: $keyType) {
      errors: shopErrors {
        ...ShopErrorFragment
      }
      shop {
        ...ShopFragment
      }
    }
  }
`;
export const useAuthorizationKeyDelete = makeMutation<
  AuthorizationKeyDelete,
  AuthorizationKeyDeleteVariables
>(authorizationKeyDelete);

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
export const useShopSettingsUpdate = makeMutation<
  ShopSettingsUpdate,
  ShopSettingsUpdateVariables
>(shopSettingsUpdate);
