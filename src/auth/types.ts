import {
  type ExternalAuthenticationUrlMutation,
  type ExternalObtainAccessTokensMutation,
  type LoginMutation,
  type UserFragment,
} from "@dashboard/graphql";

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

export type LoginData = LoginMutation["tokenCreate"];
export type GetExternalAccessTokenData =
  ExternalObtainAccessTokensMutation["externalObtainAccessTokens"];
export type GetExternalAuthUrlData = ExternalAuthenticationUrlMutation["externalAuthenticationUrl"];

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
  refetchUser?: () => Promise<unknown>;
}
