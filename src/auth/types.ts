import { type ApolloQueryResult, type FetchResult } from "@apollo/client";
import {
  type ExternalAuthenticationUrlMutation,
  type ExternalAuthenticationUrlMutationVariables,
  type ExternalLogoutMutation,
  type ExternalLogoutMutationVariables,
  type ExternalObtainAccessTokensMutation,
  type ExternalObtainAccessTokensMutationVariables,
  type ExternalRefreshMutation,
  type LoginMutation,
  type LoginMutationVariables,
  type RefreshTokenMutation,
  type SetPasswordMutation,
  type SetPasswordMutationVariables,
  type UserDetailsQuery,
  type UserFragment,
} from "@dashboard/graphql";

// Auth SDK method opts
export type LoginOpts = LoginMutationVariables;
export type SetPasswordOpts = SetPasswordMutationVariables;
export type GetExternalAuthUrlOpts = ExternalAuthenticationUrlMutationVariables;
export type GetExternalAccessTokenOpts = ExternalObtainAccessTokensMutationVariables;
export type LogoutOpts = Pick<ExternalLogoutMutationVariables, "input">;

// Auth SDK method results
export type LoginResult = FetchResult<LoginMutation>;
export type LoginData = LoginMutation["tokenCreate"];
export type LogoutResult = FetchResult<ExternalLogoutMutation> | null;
export type RefreshTokenResult = FetchResult<RefreshTokenMutation>;
export type SetPasswordResult = FetchResult<SetPasswordMutation>;
export type GetExternalAuthUrlResult = FetchResult<ExternalAuthenticationUrlMutation>;
export type GetExternalAuthUrlData = ExternalAuthenticationUrlMutation["externalAuthenticationUrl"];
export type GetExternalAccessTokenResult = FetchResult<ExternalObtainAccessTokensMutation>;
export type GetExternalAccessTokenData =
  ExternalObtainAccessTokensMutation["externalObtainAccessTokens"];
export type RefreshExternalTokenResult = FetchResult<ExternalRefreshMutation>;

export interface RequestExternalLoginInput {
  redirectUri: string;
}

export interface ExternalLoginInput {
  code: string;
  state: string;
}

export interface RequestExternalLogoutInput {
  returnTo: string;
}

export const UserContextError = {
  loginError: "loginError",
  serverError: "serverError",
  noPermissionsError: "noPermissionsError",
  externalLoginError: "externalLoginError",
  loginAttemptDelay: "loginAttemptDelay",
  unknownLoginError: "unknownLoginError",
  invalidCredentials: "invalidCredentials",
} as const;

export type UserContextError = (typeof UserContextError)[keyof typeof UserContextError];

export interface UserContext {
  login?: (username: string, password: string) => Promise<LoginData | undefined>;
  loginByExternalPlugin?: (
    pluginId: string | null,
    input: ExternalLoginInput,
  ) => Promise<GetExternalAccessTokenData | undefined>;
  logout?: () => Promise<void>;
  requestLoginByExternalPlugin?: (
    pluginId: string,
    input: RequestExternalLoginInput,
  ) => Promise<GetExternalAuthUrlData | undefined>;
  user?: UserFragment | null;
  authenticating: boolean;
  isCredentialsLogin: boolean;
  authenticated: boolean;
  errors: UserContextError[];
  refetchUser?: () => Promise<ApolloQueryResult<UserDetailsQuery>>;
}
