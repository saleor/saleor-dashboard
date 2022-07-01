import { UserFragment } from "@saleor/graphql";
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

export type UserContextError =
  | "loginError"
  | "externalLoginError"
  | "serverError";

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
  error?: UserContextError;
}
