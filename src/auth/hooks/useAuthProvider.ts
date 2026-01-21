import { ApolloClient, ApolloError } from "@apollo/client";
import { INotificationCallback } from "@dashboard/components/notifications";
import { AccountErrorCode, useUserDetailsQuery } from "@dashboard/graphql";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import {
  checkIfCredentialsExist,
  isSupported as isCredentialsManagementAPISupported,
  login as loginWithCredentialsManagementAPI,
  saveCredentials,
} from "@dashboard/utils/credentialsManagement";
import { getAppMountUriForRedirect } from "@dashboard/utils/urls";
import { GetExternalAccessTokenData, LoginData, useAuth, useAuthState } from "@saleor/sdk";
import isEmpty from "lodash/isEmpty";
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
import { useLastLoginMethod } from "./useLastLoginMethod";

interface UseAuthProviderOpts {
  intl: IntlShape;
  notify: INotificationCallback;
  apolloClient: ApolloClient<any>;
}
type AuthErrorCodes = `${AccountErrorCode}`;

export function useAuthProvider({ intl, notify, apolloClient }: UseAuthProviderOpts): UserContext {
  const { login, getExternalAuthUrl, getExternalAccessToken, logout } = useAuth();
  const navigate = useNavigator();
  const { authenticated, authenticating, user } = useAuthState();
  const [requestedExternalPluginId] = useLocalStorage("requestedExternalPluginId", null);
  const [isCredentialsLogin, setIsCredentialsLogin] = useState(false);
  const [errors, setErrors] = useState<UserContextError[]>([]);
  const permitCredentialsAPI = useRef(true);
  const { setLastLoginMethod } = useLastLoginMethod();

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
    const returnTo = urlJoin(window.location.origin, getAppMountUriForRedirect());
    const result = await logout({
      input: JSON.stringify({
        returnTo,
      } as RequestExternalLogoutInput),
    });
    // Clear credentials from browser's credential manager only when exist.
    // Chrome 115 crash when calling preventSilentAccess() when no credentials exist.
    const hasCredentials = await checkIfCredentialsExist();

    if (isCredentialsManagementAPISupported && !!hasCredentials) {
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
  };

  const handleLogin = async (email: string, password: string) => {
    if (isCredentialsLogin) {
      return;
    }

    try {
      setIsCredentialsLogin(true);

      const result = await login({
        email,
        password,
        includeDetails: false,
      });

      const errorList = result.data?.tokenCreate?.errors?.map(
        ({ code }) => code,
        // SDK is deprecated and has outdated types - we need to use ones from Dashboard
      ) as AuthErrorCodes[];

      const userLoggedInButHasNoPermissions =
        result.data?.tokenCreate?.user && isEmpty(result.data?.tokenCreate?.user?.userPermissions);

      if (userLoggedInButHasNoPermissions) {
        setErrors(["noPermissionsError"]);
        await handleLogout();
      }

      const hasUser = !!result.data?.tokenCreate?.user;

      if (hasUser && !errorList?.length) {
        saveCredentials(result.data!.tokenCreate!.user!, password);
      } else {
        const userContextErrorList: UserContextError[] = [];

        errorList?.forEach(error => {
          switch (error) {
            case AccountErrorCode.LOGIN_ATTEMPT_DELAYED:
              userContextErrorList.push("loginAttemptDelay");
              break;
            case AccountErrorCode.INVALID_CREDENTIALS:
              userContextErrorList.push("invalidCredentials");
              break;
            default:
              userContextErrorList.push("loginError");
              break;
          }
        });

        setErrors(userContextErrorList);
      }

      await logoutNonStaffUser(result.data?.tokenCreate!);

      return result.data?.tokenCreate;
    } catch (error) {
      if (error instanceof ApolloError) {
        handleLoginError(error);
      } else {
        setErrors(["unknownLoginError"]);
      }
    } finally {
      setIsCredentialsLogin(false);
    }
  };
  const handleRequestExternalLogin = async (pluginId: string, input: RequestExternalLoginInput) => {
    let stringifyInput: string;

    try {
      stringifyInput = JSON.stringify(input);
    } catch (error) {
      setErrors(["externalLoginError"]);

      return;
    }

    const result = await getExternalAuthUrl({
      pluginId,
      input: stringifyInput,
    });

    return result?.data?.externalAuthenticationUrl;
  };
  const handleExternalLogin = async (pluginId: string | null, input: ExternalLoginInput) => {
    if (!pluginId) {
      return;
    }

    try {
      const result = await getExternalAccessToken({
        pluginId,
        input: JSON.stringify(input),
      });

      if (isEmpty(result.data?.externalObtainAccessTokens?.user?.userPermissions)) {
        setErrors(["noPermissionsError"]);
        await handleLogout();
      }

      if (!result || result.data?.externalObtainAccessTokens?.errors.length) {
        setErrors(["externalLoginError"]);
        await handleLogout();
      }

      await logoutNonStaffUser(result.data?.externalObtainAccessTokens!);

      setLastLoginMethod(pluginId);

      return result?.data?.externalObtainAccessTokens;
    } catch (error) {
      if (error instanceof ApolloError) {
        handleLoginError(error);
      } else {
        setErrors(["unknownLoginError"]);
      }
    }
  };
  const logoutNonStaffUser = async (data: LoginData | GetExternalAccessTokenData) => {
    if (data?.user && !data.user.isStaff) {
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
    isCredentialsLogin,
    authenticated: authenticated && !!user?.isStaff && !errors.length,
    user: userDetails.data?.me,
    refetchUser: userDetails.refetch,
    errors,
  };
}
