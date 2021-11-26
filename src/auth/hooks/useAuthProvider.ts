import { IMessageContext } from "@saleor/components/messages";
import { APP_DEFAULT_URI, APP_MOUNT_URI, DEMO_MODE } from "@saleor/config";
import { useAuth, useAuthState } from "@saleor/sdk";
import {
  isSupported as isCredentialsManagementAPISupported,
  login as loginWithCredentialsManagementAPI,
  saveCredentials
} from "@saleor/utils/credentialsManagement";
import ApolloClient from "apollo-client";
import { useEffect, useState } from "react";
import { useQuery } from "react-apollo";
import { IntlShape } from "react-intl";
import urlJoin from "url-join";

import { userDetailsQuery } from "../queries";
import {
  ExternalLoginInput,
  RequestExternalLoginInput,
  RequestExternalLogoutInput,
  UserContext,
  UserContextError
} from "../types";
import { UserDetails } from "../types/UserDetails";
import { displayDemoMessage } from "../utils";

export interface UseAuthProviderOpts {
  intl: IntlShape;
  notify: IMessageContext;
  apolloClient: ApolloClient<any>;
}

export function useAuthProvider({
  intl,
  notify,
  apolloClient
}: UseAuthProviderOpts): UserContext {
  const {
    login,
    getExternalAuthUrl,
    getExternalAccessToken,
    logout
  } = useAuth();
  const { authenticated, authenticating } = useAuthState();
  const [error, setError] = useState<UserContextError>();

  useEffect(() => {
    if (!authenticated && !authenticating) {
      loginWithCredentialsManagementAPI(handleLogin);
    }
  }, [authenticated, authenticating]);

  const userDetails = useQuery<UserDetails>(userDetailsQuery, {
    client: apolloClient,
    skip: !authenticated
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

    if (!result) {
      return;
    }

    const errors = result.errors || [];
    const logoutUrl = JSON.parse(
      result.data?.externalLogout?.logoutData || null
    )?.logoutUrl;
    if (!errors.length && logoutUrl) {
      window.location.href = logoutUrl;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await login({
      email,
      password
    });

    if (result && !result.data.tokenCreate.errors.length) {
      if (DEMO_MODE) {
        displayDemoMessage(intl, notify);
      }
      saveCredentials(result.data.tokenCreate.user, password);
      setError(undefined);
    } else {
      setError("loginError");
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

    if (result && !result.data?.externalObtainAccessTokens.errors.length) {
      if (DEMO_MODE) {
        displayDemoMessage(intl, notify);
      }
      setError(undefined);
    } else {
      setError("externalLoginError");
    }

    return result?.data?.externalObtainAccessTokens;
  };

  return {
    login: handleLogin,
    requestLoginByExternalPlugin: handleRequestExternalLogin,
    loginByExternalPlugin: handleExternalLogin,
    logout: handleLogout,
    authenticating,
    authenticated,
    user: userDetails.data?.me,
    error
  };
}
