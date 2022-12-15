import { ApolloClient, ApolloError } from "@apollo/client";
import { IMessageContext } from "@saleor/components/messages";
import { DEMO_MODE } from "@saleor/config";
import { useUserDetailsQuery } from "@saleor/graphql";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import useNavigator from "@saleor/hooks/useNavigator";
import { commonMessages } from "@saleor/intl";
import {
  GetExternalAccessTokenData,
  LoginData,
  useAuth,
  useAuthState,
} from "@saleor/sdk";
import {
  isSupported as isCredentialsManagementAPISupported,
  login as loginWithCredentialsManagementAPI,
  saveCredentials,
} from "@saleor/utils/credentialsManagement";
import { getAppMountUriForRedirect } from "@saleor/utils/urls";
import { useEffect, useRef, useState } from "react";
import { IntlShape } from "react-intl";
import urlJoin from "url-join";

import { parseAuthError } from "../errors";
import {
  ExternalLoginInput,
  RequestExternalLoginInput,
  RequestExternalLogoutInput,
  UserContext,
  UserContextError,
} from "../types";
import { displayDemoMessage } from "../utils";

export interface UseAuthProviderOpts {
  intl: IntlShape;
  notify: IMessageContext;
  apolloClient: ApolloClient<any>;
}

export function useAuthProvider({
  intl,
  notify,
  apolloClient,
}: UseAuthProviderOpts): UserContext {
  const {
    login,
    getExternalAuthUrl,
    getExternalAccessToken,
    logout,
  } = useAuth();
  const navigate = useNavigator();
  const { authenticated, authenticating, user } = useAuthState();
  const [requestedExternalPluginId] = useLocalStorage(
    "requestedExternalPluginId",
    null,
  );
  const [errors, setErrors] = useState<UserContextError[]>([]);
  const permitCredentialsAPI = useRef(true);

  useEffect(() => {
    if (authenticating && errors.length) {
      setErrors([]);
    }
  }, [authenticating]);

  useEffect(() => {
    if (authenticated) {
      permitCredentialsAPI.current = true;
    }
  }, [authenticated]);

  useEffect(() => {
    if (
      !authenticated &&
      !authenticating &&
      !requestedExternalPluginId &&
      permitCredentialsAPI.current
    ) {
      permitCredentialsAPI.current = false;
      loginWithCredentialsManagementAPI(handleLogin);
    }
  }, [authenticated, authenticating]);

  const userDetails = useUserDetailsQuery({
    client: apolloClient,
    skip: !authenticated,
    // Don't change this to 'network-only' - update of intl provider's
    // state will cause an error
    fetchPolicy: "cache-and-network",
  });

  const handleLoginError = (error: ApolloError) => {
    const parsedErrors = parseAuthError(error);

    if (parsedErrors.length) {
      setErrors(parsedErrors);
    } else {
      setErrors(["unknownLoginError"]);
    }
  };

  const handleLogout = async () => {
    const returnTo = urlJoin(
      window.location.origin,
      getAppMountUriForRedirect(),
    );

    const result = await logout({
      input: JSON.stringify({
        returnTo,
      } as RequestExternalLogoutInput),
    });

    if (isCredentialsManagementAPISupported) {
      navigator.credentials.preventSilentAccess();
    }

    // Forget last logged in user data.
    // On next login, user details query will be refetched due to cache-and-network fetch policy.
    apolloClient.clearStore();

    const errors = result?.errors || [];

    const externalLogoutUrl = result
      ? JSON.parse(result.data?.externalLogout?.logoutData || null)?.logoutUrl
      : "";

    if (!errors.length) {
      if (externalLogoutUrl) {
        window.location.href = externalLogoutUrl;
      } else {
        navigate("/");
      }
    }

    return;
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({
        email,
        password,
        includeDetails: false,
      });

      if (result && !result.data.tokenCreate.errors.length) {
        if (DEMO_MODE) {
          displayDemoMessage(intl, notify);
        }
        saveCredentials(result.data.tokenCreate.user, password);
      } else {
        setErrors(["loginError"]);
      }

      await logoutNonStaffUser(result.data.tokenCreate);

      return result.data.tokenCreate;
    } catch (error) {
      if (error instanceof ApolloError) {
        handleLoginError(error);
      } else {
        setErrors(["unknownLoginError"]);
      }
    }
  };

  const handleRequestExternalLogin = async (
    pluginId: string,
    input: RequestExternalLoginInput,
  ) => {
    const result = await getExternalAuthUrl({
      pluginId,
      input: JSON.stringify(input),
    });

    return result?.data?.externalAuthenticationUrl;
  };

  const handleExternalLogin = async (
    pluginId: string,
    input: ExternalLoginInput,
  ) => {
    try {
      const result = await getExternalAccessToken({
        pluginId,
        input: JSON.stringify(input),
      });

      if (result && !result.data?.externalObtainAccessTokens.errors.length) {
        if (DEMO_MODE) {
          displayDemoMessage(intl, notify);
        }
      } else {
        setErrors(["externalLoginError"]);
      }

      await logoutNonStaffUser(result.data.externalObtainAccessTokens);

      return result?.data?.externalObtainAccessTokens;
    } catch (error) {
      if (error instanceof ApolloError) {
        handleLoginError(error);
      } else {
        setErrors(["unknownLoginError"]);
      }
    }
  };

  const logoutNonStaffUser = async (
    data: LoginData | GetExternalAccessTokenData,
  ) => {
    if (data.user && !data.user.isStaff) {
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.unauthorizedDashboardAccess),
        title: intl.formatMessage(commonMessages.insufficientPermissions),
      });
      await handleLogout();
    }
  };

  return {
    login: handleLogin,
    requestLoginByExternalPlugin: handleRequestExternalLogin,
    loginByExternalPlugin: handleExternalLogin,
    logout: handleLogout,
    authenticating: authenticating && !errors.length,
    authenticated: authenticated && user?.isStaff,
    user: userDetails.data?.me,
    errors,
  };
}
