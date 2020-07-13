import { fragmentUser } from "@saleor/fragments/auth";
import { accountErrorFragment } from "@saleor/fragments/errors";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import { RefreshToken, RefreshTokenVariables } from "./types/RefreshToken";
import {
  RequestPasswordReset,
  RequestPasswordResetVariables
} from "./types/RequestPasswordReset";
import { SetPassword, SetPasswordVariables } from "./types/SetPassword";
import { TokenAuth, TokenAuthVariables } from "./types/TokenAuth";
import { VerifyToken, VerifyTokenVariables } from "./types/VerifyToken";

export const tokenAuthMutation = gql`
  ${fragmentUser}
  mutation TokenAuth($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      errors: accountErrors {
        field
        message
      }
      user {
        ...User
      }
    }
  }
`;
export const useTokenAuthMutation = makeMutation<TokenAuth, TokenAuthVariables>(
  tokenAuthMutation
);

export const tokenVerifyMutation = gql`
  ${fragmentUser}
  mutation VerifyToken($token: String!) {
    tokenVerify(token: $token) {
      payload
      user {
        ...User
      }
    }
  }
`;
export const useTokenVerifyMutation = makeMutation<
  VerifyToken,
  VerifyTokenVariables
>(tokenVerifyMutation);

const refreshToken = gql`
  mutation RefreshToken($token: String!) {
    tokenRefresh(csrfToken: $token) {
      token
    }
  }
`;
export const useTokenRefreshMutation = makeMutation<
  RefreshToken,
  RefreshTokenVariables
>(refreshToken);

export const requestPasswordReset = gql`
  ${accountErrorFragment}
  mutation RequestPasswordReset($email: String!, $redirectUrl: String!) {
    requestPasswordReset(email: $email, redirectUrl: $redirectUrl) {
      errors: accountErrors {
        ...AccountErrorFragment
      }
    }
  }
`;
export const RequestPasswordResetMutation = TypedMutation<
  RequestPasswordReset,
  RequestPasswordResetVariables
>(requestPasswordReset);

export const setPassword = gql`
  ${accountErrorFragment}
  ${fragmentUser}
  mutation SetPassword($email: String!, $password: String!, $token: String!) {
    setPassword(email: $email, password: $password, token: $token) {
      errors: accountErrors {
        ...AccountErrorFragment
      }
      token
      user {
        ...User
      }
    }
  }
`;
export const SetPasswordMutation = TypedMutation<
  SetPassword,
  SetPasswordVariables
>(setPassword);
