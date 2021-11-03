import { IMessageContext } from "@saleor/components/messages";
import { APP_DEFAULT_URI, APP_MOUNT_URI, DEMO_MODE } from "@saleor/config";
import { User } from "@saleor/fragments/types/User";
import { useAuth, useAuthState } from "@saleor/sdk";
import {
  AccountErrorFragment,
  CreateToken,
  ExternalAuthenticationUrl,
  ExternalObtainAccessTokens,
  MutationSetPasswordArgs,
  SetPasswordMutation,
  UserFragment
} from "@saleor/sdk/dist/apollo/types";
import {
  isSupported as isCredentialsManagementAPISupported,
  login as loginWithCredentialsManagementAPI,
  saveCredentials
} from "@saleor/utils/credentialsManagement";
import ApolloClient from "apollo-client";
import { FetchResult } from "apollo-link";
import { MutableRefObject, useEffect, useRef } from "react";
import { useQuery } from "react-apollo";
import { IntlShape } from "react-intl";
import urlJoin from "url-join";

import { userDetailsQuery } from "../queries";
import { UserDetails } from "../types/UserDetails";
import { displayDemoMessage } from "../utils";

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

export interface UseAuthProvider {
  login: (
    username: string,
    password: string
  ) => Promise<
    Pick<CreateToken, "csrfToken" | "token"> & {
      errors: AccountErrorFragment[];
      user: UserFragment;
    }
  >;
  requestLoginByExternalPlugin: (
    pluginId: string,
    input: RequestExternalLoginInput
  ) => Promise<
    Pick<ExternalAuthenticationUrl, "authenticationData"> & {
      errors: AccountErrorFragment[];
    }
  >;
  loginByExternalPlugin: (
    pluginId: string,
    input: ExternalLoginInput
  ) => Promise<
    Pick<ExternalObtainAccessTokens, "csrfToken" | "token"> & {
      user: UserFragment;
      errors: AccountErrorFragment[];
    }
  >;
  logout: () => Promise<void>;
  setPassword: (
    opts: MutationSetPasswordArgs
  ) => Promise<
    FetchResult<SetPasswordMutation, Record<string, any>, Record<string, any>>
  >;
  authenticated: boolean;
  authenticating: boolean;
  user?: User;
  autologinPromise?: MutableRefObject<Promise<any>>;
}
export interface UseAuthProviderOpts {
  intl: IntlShape;
  notify: IMessageContext;
  apolloClient: ApolloClient<any>;
}

export function useAuthProvider({
  intl,
  notify,
  apolloClient
}: UseAuthProviderOpts): UseAuthProvider {
  const {
    login,
    getExternalAuthUrl,
    getExternalAccessToken,
    logout,
    setPassword
  } = useAuth();
  const { authenticated, authenticating } = useAuthState();

  const autologinPromise = useRef<Promise<any>>();

  useEffect(() => {
    autologinPromise.current = loginWithCredentialsManagementAPI(handleLogin);
  }, []);

  const userDetails = useQuery<UserDetails>(userDetailsQuery, {
    client: apolloClient,
    skip: !authenticated || authenticating
  });

  const handleLogout = async () => {
    const result = await logout({
      input: JSON.stringify({
        returnTo: urlJoin(
          window.location.origin,
          APP_MOUNT_URI === APP_DEFAULT_URI ? "" : APP_MOUNT_URI
        )
      } as RequestExternalLogoutInput)
    });

    if (isCredentialsManagementAPISupported) {
      navigator.credentials.preventSilentAccess();
    }

    const errors = result?.errors || [];
    const logoutUrl = JSON.parse(
      result?.data?.externalLogout?.logoutData || "{}"
    ).logoutUrl;
    if (!errors.length && logoutUrl) {
      window.location.href = logoutUrl;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await login({
      email,
      password
    });

    if (result?.data.tokenCreate.errors.length > 0) {
      logout();
    }

    if (result && !result.data.tokenCreate.errors.length) {
      if (DEMO_MODE) {
        displayDemoMessage(intl, notify);
      }
      saveCredentials(result.data.tokenCreate.user, password);
    }

    return result.data.tokenCreate;
  };

  const handleRequestExternalLogin = async (
    pluginId: string,
    input: RequestExternalLoginInput
  ) => {
    const result = await getExternalAuthUrl({
      pluginId,
      input: JSON.stringify(input)
    });

    return result?.data?.externalAuthenticationUrl;
  };

  const handleExternalLogin = async (
    pluginId: string,
    input: ExternalLoginInput
  ) => {
    const result = await getExternalAccessToken({
      pluginId,
      input: JSON.stringify(input)
    });

    if (result?.data?.externalObtainAccessTokens.errors.length > 0) {
      logout();
    }

    if (result && !result.data?.externalObtainAccessTokens.errors.length) {
      if (DEMO_MODE) {
        displayDemoMessage(intl, notify);
      }
    }

    return result?.data?.externalObtainAccessTokens;
  };

  return {
    login: handleLogin,
    requestLoginByExternalPlugin: handleRequestExternalLogin,
    loginByExternalPlugin: handleExternalLogin,
    logout: handleLogout,
    setPassword,
    authenticating,
    authenticated,
    user: userDetails.data?.me,
    autologinPromise
  };
}
