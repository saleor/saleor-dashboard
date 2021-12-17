import { IMessageContext } from "@saleor/components/messages";
import { APP_DEFAULT_URI, APP_MOUNT_URI, DEMO_MODE } from "@saleor/config";
import { commonMessages } from "@saleor/intl";
import {
  GetExternalAccessTokenData,
  LoginData,
  useAuth,
  useAuthState
} from "@saleor/sdk";
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
  const { authenticated, authenticating, user } = useAuthState();
  const [error, setError] = useState<UserContextError>();

  useEffect(() => {
    if (authenticating && error) {
      setError(undefined);
    }
  }, [authenticating]);

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
    try {
      const result = await login({
        email,
        password
      });

      if (result && !result.data.tokenCreate.errors.length) {
        if (DEMO_MODE) {
          displayDemoMessage(intl, notify);
        }
        saveCredentials(result.data.tokenCreate.user, password);
      } else {
        setError("loginError");
      }

      await logoutNonStaffUser(result.data.tokenCreate);

      return result.data.tokenCreate;
    } catch (error) {
      setError("serverError");
    }
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
    try {
      const result = await getExternalAccessToken({
        pluginId,
        input: JSON.stringify(input)
      });

      if (result && !result.data?.externalObtainAccessTokens.errors.length) {
        if (DEMO_MODE) {
          displayDemoMessage(intl, notify);
        }
      } else {
        setError("externalLoginError");
      }

      await logoutNonStaffUser(result.data.externalObtainAccessTokens);

      return result?.data?.externalObtainAccessTokens;
    } catch (error) {
      setError("serverError");
    }
  };

  const logoutNonStaffUser = async (
    data: LoginData | GetExternalAccessTokenData
  ) => {
    if (data.user && !data.user.isStaff) {
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.unauthorizedDashboardAccess),
        title: intl.formatMessage(commonMessages.insufficientPermissions)
      });
      await handleLogout();
    }
  };

  return {
    login: handleLogin,
    requestLoginByExternalPlugin: handleRequestExternalLogin,
    loginByExternalPlugin: handleExternalLogin,
    logout: handleLogout,
    authenticating: authenticating && !error,
    authenticated: authenticated && user?.isStaff,
    user: userDetails.data?.me,
    error
  };
}
