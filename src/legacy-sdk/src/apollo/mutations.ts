import { gql } from "@apollo/client";

import {
  accountErrorFragment,
  addressFragment,
  userBaseFragment,
  userDetailsFragment,
} from "./fragments";

export const LOGIN_WITHOUT_DETAILS = gql`
  ${accountErrorFragment}
  ${userBaseFragment}
  mutation loginWithoutDetails($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      refreshToken
      token
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserBaseFragment
      }
    }
  }
`;

export const LOGIN = gql`
  ${accountErrorFragment}
  ${userDetailsFragment}
  mutation login($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      refreshToken
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserDetailsFragment
      }
    }
  }
`;

export const REGISTER = gql`
  ${accountErrorFragment}
  mutation register($input: AccountRegisterInput!) {
    accountRegister(input: $input) {
      errors {
        ...AccountErrorFragment
      }
      requiresConfirmation
    }
  }
`;

export const REFRESH_TOKEN = gql`
  ${accountErrorFragment}
  mutation refreshToken($refreshToken: String!) {
    tokenRefresh(refreshToken: $refreshToken) {
      token
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

// separate mutation so the request payload is minimal when user is not needed
// used for initial authentication
export const REFRESH_TOKEN_WITH_USER = gql`
  ${accountErrorFragment}
  ${userDetailsFragment}
  mutation refreshTokenWithUser($refreshToken: String!) {
    tokenRefresh(refreshToken: $refreshToken) {
      token
      user {
        ...UserDetailsFragment
      }
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const VERIFY_TOKEN = gql`
  ${accountErrorFragment}
  ${userDetailsFragment}
  mutation verifyToken($token: String!) {
    tokenVerify(token: $token) {
      isValid
      payload
      user {
        ...UserDetailsFragment
      }
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const EXTERNAL_AUTHENTICATION_URL = gql`
  ${accountErrorFragment}
  mutation externalAuthenticationUrl(
    $pluginId: String = "mirumee.authentication.openidconnect"
    $input: JSONString!
  ) {
    externalAuthenticationUrl(pluginId: $pluginId, input: $input) {
      authenticationData
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const OBTAIN_EXTERNAL_ACCESS_TOKEN = gql`
  ${accountErrorFragment}
  ${userDetailsFragment}
  mutation externalObtainAccessTokens(
    $pluginId: String = "mirumee.authentication.openidconnect"
    $input: JSONString!
  ) {
    externalObtainAccessTokens(pluginId: $pluginId, input: $input) {
      token
      refreshToken
      user {
        ...UserDetailsFragment
      }
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const EXTERNAL_REFRESH = gql`
  ${accountErrorFragment}
  mutation externalRefresh(
    $pluginId: String = "mirumee.authentication.openidconnect"
    $input: JSONString!
  ) {
    externalRefresh(pluginId: $pluginId, input: $input) {
      token
      refreshToken
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const EXTERNAL_REFRESH_WITH_USER = gql`
  ${accountErrorFragment}
  ${userDetailsFragment}
  mutation externalRefreshWithUser(
    $pluginId: String = "mirumee.authentication.openidconnect"
    $input: JSONString!
  ) {
    externalRefresh(pluginId: $pluginId, input: $input) {
      token
      refreshToken
      user {
        ...UserDetailsFragment
      }
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const EXTERNAL_VERIFY_TOKEN = gql`
  ${accountErrorFragment}
  ${userDetailsFragment}
  mutation externalVerify(
    $pluginId: String = "mirumee.authentication.openidconnect"
    $input: JSONString!
  ) {
    externalVerify(pluginId: $pluginId, input: $input) {
      isValid
      verifyData
      user {
        ...UserDetailsFragment
        userPermissions {
          code
          name
        }
      }
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const EXTERNAL_LOGOUT = gql`
  ${accountErrorFragment}
  mutation externalLogout(
    $pluginId: String = "mirumee.authentication.openidconnect"
    $input: JSONString!
  ) {
    externalLogout(pluginId: $pluginId, input: $input) {
      logoutData
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const CHANGE_USER_PASSWORD = gql`
  ${accountErrorFragment}
  mutation passwordChange($newPassword: String!, $oldPassword: String!) {
    passwordChange(newPassword: $newPassword, oldPassword: $oldPassword) {
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const REQUEST_PASSWORD_RESET = gql`
  ${accountErrorFragment}
  mutation sdk_requestPasswordReset($email: String!, $redirectUrl: String!, $channel: String!) {
    requestPasswordReset(email: $email, redirectUrl: $redirectUrl, channel: $channel) {
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const SET_PASSWORD = gql`
  ${userDetailsFragment}
  ${accountErrorFragment}
  mutation setPassword($token: String!, $email: String!, $password: String!) {
    setPassword(token: $token, email: $email, password: $password) {
      errors {
        ...AccountErrorFragment
      }
      token
      refreshToken
      user {
        ...UserDetailsFragment
      }
    }
  }
`;

export const REQUEST_EMAIL_CHANGE = gql`
  ${userDetailsFragment}
  ${accountErrorFragment}
  mutation requestEmailChange(
    $channel: String!
    $newEmail: String!
    $password: String!
    $redirectUrl: String!
  ) {
    requestEmailChange(
      channel: $channel
      newEmail: $newEmail
      password: $password
      redirectUrl: $redirectUrl
    ) {
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserDetailsFragment
      }
    }
  }
`;

export const CONFIRM_EMAIL_CHANGE = gql`
  ${userDetailsFragment}
  ${accountErrorFragment}
  mutation confirmEmailChange($channel: String!, $token: String!) {
    confirmEmailChange(channel: $channel, token: $token) {
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserDetailsFragment
      }
    }
  }
`;

export const REQUEST_DELETE_ACCOUNT = gql`
  ${accountErrorFragment}
  mutation accountRequestDeletion($channel: String!, $redirectUrl: String!) {
    accountRequestDeletion(channel: $channel, redirectUrl: $redirectUrl) {
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  ${userDetailsFragment}
  ${accountErrorFragment}
  mutation accountDelete($token: String!) {
    accountDelete(token: $token) {
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserDetailsFragment
      }
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  ${userDetailsFragment}
  ${accountErrorFragment}
  mutation accountUpdate($input: AccountInput!) {
    accountUpdate(input: $input) {
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserDetailsFragment
      }
    }
  }
`;

export const SET_ACCOUNT_DEFAULT_ADDRESS = gql`
  ${userDetailsFragment}
  ${accountErrorFragment}
  mutation setAccountDefaultAddress($id: ID!, $type: AddressTypeEnum!) {
    accountSetDefaultAddress(id: $id, type: $type) {
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserDetailsFragment
      }
    }
  }
`;

export const DELETE_ACCOUNT_ADDRESS = gql`
  ${userDetailsFragment}
  ${accountErrorFragment}
  mutation deleteAccountAddress($addressId: ID!) {
    accountAddressDelete(id: $addressId) {
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserDetailsFragment
      }
    }
  }
`;

export const CREATE_ACCOUNT_ADDRESS = gql`
  ${addressFragment}
  ${userDetailsFragment}
  ${accountErrorFragment}
  mutation createAccountAddress($input: AddressInput!) {
    accountAddressCreate(input: $input) {
      address {
        ...AddressFragment
      }
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserDetailsFragment
      }
    }
  }
`;

export const UPDATE_ACCOUNT_ADDRESS = gql`
  ${addressFragment}
  ${userDetailsFragment}
  ${accountErrorFragment}
  mutation updateAccountAddress($input: AddressInput!, $id: ID!) {
    accountAddressUpdate(input: $input, id: $id) {
      address {
        ...AddressFragment
      }
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserDetailsFragment
      }
    }
  }
`;

export const CONFIRM_ACCOUNT = gql`
  ${userDetailsFragment}
  ${accountErrorFragment}
  mutation accountConfirm($email: String!, $token: String!) {
    confirmAccount(email: $email, token: $token) {
      user {
        ...UserDetailsFragment
      }
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;
