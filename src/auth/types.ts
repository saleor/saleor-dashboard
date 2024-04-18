import { ApolloQueryResult } from "@apollo/client";
import { UserDetailsQuery, UserFragment } from "@dashboard/graphql";
import { GetExternalAccessTokenData, GetExternalAuthUrlData, LoginData } from "@saleor/sdk";

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
  unknownLoginError: "unknownLoginError",
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
  authenticated: boolean;
  errors: UserContextError[];
  refetchUser?: () => Promise<ApolloQueryResult<UserDetailsQuery>>;
}
