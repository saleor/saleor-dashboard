import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import { fragmentAddress } from "../orders/queries";
import { shopFragment } from "./queries";
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

const shopErrorFragment = gql`
  fragment ShopErrorFragment on ShopError {
    code
    field
  }
`;
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
export const TypedAuthorizationKeyAdd = TypedMutation<
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
export const TypedAuthorizationKeyDelete = TypedMutation<
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
export const TypedShopSettingsUpdate = TypedMutation<
  ShopSettingsUpdate,
  ShopSettingsUpdateVariables
>(shopSettingsUpdate);
