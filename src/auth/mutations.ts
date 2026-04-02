import { gql } from "@apollo/client";

export const requestPasswordReset = gql`
  mutation RequestPasswordReset($email: String!, $redirectUrl: String!) {
    requestPasswordReset(email: $email, redirectUrl: $redirectUrl) {
      errors {
        ...AccountError
      }
    }
  }
`;

export const refreshTokenWithUser = gql`
  mutation RefreshTokenWithUser($refreshToken: String!) {
    tokenRefresh(refreshToken: $refreshToken) {
      token
      user {
        ...User
      }
      errors {
        ...AccountError
      }
    }
  }
`;

export const externalRefreshWithUser = gql`
  mutation ExternalRefreshWithUser(
    $pluginId: String = "mirumee.authentication.openidconnect"
    $input: JSONString!
  ) {
    externalRefresh(pluginId: $pluginId, input: $input) {
      token
      refreshToken
      user {
        ...User
      }
      errors {
        ...AccountError
      }
    }
  }
`;

export const login = gql`
  mutation Login($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      refreshToken
      errors {
        ...AccountError
      }
      user {
        ...User
      }
    }
  }
`;

export const externalAuthenticationUrl = gql`
  mutation ExternalAuthenticationUrl(
    $pluginId: String = "mirumee.authentication.openidconnect"
    $input: JSONString!
  ) {
    externalAuthenticationUrl(pluginId: $pluginId, input: $input) {
      authenticationData
      errors {
        ...AccountError
      }
    }
  }
`;

export const externalObtainAccessTokens = gql`
  mutation ExternalObtainAccessTokens(
    $pluginId: String = "mirumee.authentication.openidconnect"
    $input: JSONString!
  ) {
    externalObtainAccessTokens(pluginId: $pluginId, input: $input) {
      token
      refreshToken
      user {
        ...User
      }
      errors {
        ...AccountError
      }
    }
  }
`;

export const externalLogout = gql`
  mutation ExternalLogout(
    $pluginId: String = "mirumee.authentication.openidconnect"
    $input: JSONString!
  ) {
    externalLogout(pluginId: $pluginId, input: $input) {
      logoutData
      errors {
        ...AccountError
      }
    }
  }
`;

export const setPassword = gql`
  mutation SetPassword($token: String!, $email: String!, $password: String!) {
    setPassword(token: $token, email: $email, password: $password) {
      errors {
        ...AccountError
      }
      token
      refreshToken
      user {
        ...User
      }
    }
  }
`;
