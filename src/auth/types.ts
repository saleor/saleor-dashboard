import { UserFragment } from "@dashboard/graphql";
import {
  GetExternalAccessTokenData,
  GetExternalAuthUrlData,
  LoginData,
} from "@saleor/sdk";

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

export type UserContextError =
  (typeof UserContextError)[keyof typeof UserContextError];

export interface UserContext {
  login: (username: string, password: string) => Promise<LoginData>;
  loginByExternalPlugin: (
    pluginId: string,
    input: ExternalLoginInput,
  ) => Promise<GetExternalAccessTokenData>;
  logout: () => Promise<void>;
  requestLoginByExternalPlugin: (
    pluginId: string,
    input: RequestExternalLoginInput,
  ) => Promise<GetExternalAuthUrlData>;
  user?: UserFragment;
  authenticating: boolean;
  authenticated: boolean;
  errors: UserContextError[];
}
