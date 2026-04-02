import { type ApolloClient, ApolloError } from "@apollo/client";
import { storage } from "@dashboard/auth/tokenStorage";
import { type INotificationCallback } from "@dashboard/components/notifications";
import {
  AccountErrorCode,
  ExternalAuthenticationUrlDocument,
  type ExternalAuthenticationUrlMutation,
  type ExternalAuthenticationUrlMutationVariables,
  ExternalLogoutDocument,
  type ExternalLogoutMutation,
  type ExternalLogoutMutationVariables,
  ExternalObtainAccessTokensDocument,
  type ExternalObtainAccessTokensMutation,
  type ExternalObtainAccessTokensMutationVariables,
  ExternalRefreshWithUserDocument,
  type ExternalRefreshWithUserMutation,
  type ExternalRefreshWithUserMutationVariables,
  LoginDocument,
  type LoginMutation,
  type LoginMutationVariables,
  RefreshTokenWithUserDocument,
  type RefreshTokenWithUserMutation,
  type RefreshTokenWithUserMutationVariables,
  type UserFragment,
} from "@dashboard/graphql";
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
import jwtDecode from "jwt-decode";
import isEmpty from "lodash/isEmpty";
import { useCallback, useEffect, useRef, useState } from "react";
import { type IntlShape } from "react-intl";
import urlJoin from "url-join";

import { parseAuthError } from "../errors";
import {
  type ExternalLoginInput,
  type GetExternalAccessTokenData,
  type LoginData,
  type RequestExternalLoginInput,
  type RequestExternalLogoutInput,
  type UserContext,
  type UserContextError,
} from "../types";
import { useLastLoginMethod } from "./useLastLoginMethod";

interface UseAuthProviderOpts {
  intl: IntlShape;
  notify: INotificationCallback;
  apolloClient: ApolloClient<any>;
}
type AuthErrorCodes = `${AccountErrorCode}`;

interface JWTToken {
  owner: string;
}

const isInternalToken = (owner: string): boolean => owner === "saleor";

export function useAuthProvider({ intl, notify, apolloClient }: UseAuthProviderOpts): UserContext {
  const navigate = useNavigator();
  const [requestedExternalPluginId] = useLocalStorage("requestedExternalPluginId", null);
  const [isCredentialsLogin, setIsCredentialsLogin] = useState(false);
  const [errors, setErrors] = useState<UserContextError[]>([]);
  const [userDetails, setUserDetails] = useState<UserFragment | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(!!storage?.getRefreshToken());
  const permitCredentialsAPI = useRef(true);
  const autologinAttempted = useRef(false);
  const { setLastLoginMethod } = useLastLoginMethod();

  const performAutologin = useCallback(async () => {
    const refreshToken = storage.getRefreshToken();

    if (!refreshToken) {
      setAuthenticating(false);

      return;
    }

    try {
      const owner = jwtDecode<JWTToken>(refreshToken).owner;

      if (isInternalToken(owner)) {
        const result = await apolloClient.mutate<
          RefreshTokenWithUserMutation,
          RefreshTokenWithUserMutationVariables
        >({
          mutation: RefreshTokenWithUserDocument,
          variables: { refreshToken },
        });

        const data = result.data?.tokenRefresh;

        if (data?.token && data.user) {
          storage.setAccessToken(data.token);
          setUserDetails(data.user);
          setAuthenticated(true);
        }
      } else {
        const authPluginId = storage.getAuthPluginId();
        const result = await apolloClient.mutate<
          ExternalRefreshWithUserMutation,
          ExternalRefreshWithUserMutationVariables
        >({
          mutation: ExternalRefreshWithUserDocument,
          variables: {
            pluginId: authPluginId,
            input: JSON.stringify({ refreshToken }),
          },
        });

        const data = result.data?.externalRefresh;

        if (data?.token && data.user) {
          storage.setTokens({
            accessToken: data.token,
            refreshToken: data.refreshToken,
          });
          setUserDetails(data.user);
          setAuthenticated(true);
        }
      }
    } catch {
      // Token refresh failed — user will need to re-login
    } finally {
      setAuthenticating(false);
    }
  }, [apolloClient]);

  const refetchUser = useCallback(async () => {
    const refreshToken = storage.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const result = await apolloClient.mutate<
      RefreshTokenWithUserMutation,
      RefreshTokenWithUserMutationVariables
    >({
      mutation: RefreshTokenWithUserDocument,
      variables: { refreshToken },
    });

    const data = result.data?.tokenRefresh;

    if (data?.token && data.user) {
      storage.setAccessToken(data.token);
      setUserDetails(data.user);
    }

    return result;
  }, [apolloClient]);

  // Autologin: refresh token + fetch user in a single network call
  useEffect(() => {
    if (!autologinAttempted.current) {
      autologinAttempted.current = true;
      performAutologin();
    }
  }, [performAutologin]);

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

  const handleLoginError = (error: ApolloError) => {
    const parsedErrors = parseAuthError(error);

    if (parsedErrors.length) {
      setErrors(parsedErrors);
    } else {
      setErrors(["unknownLoginError"]);
    }
  };
  const handleLogout = async () => {
    const authPluginId = storage.getAuthPluginId();
    const returnTo = urlJoin(window.location.origin, getAppMountUriForRedirect());

    storage.clear();
    setAuthenticated(false);
    setUserDetails(null);

    let externalLogoutUrl = "";

    if (authPluginId) {
      const result = await apolloClient.mutate<
        ExternalLogoutMutation,
        ExternalLogoutMutationVariables
      >({
        mutation: ExternalLogoutDocument,
        variables: {
          pluginId: authPluginId,
          input: JSON.stringify({ returnTo } as RequestExternalLogoutInput),
        },
      });

      externalLogoutUrl = JSON.parse(result.data?.externalLogout?.logoutData || null)?.logoutUrl;
    }

    // Clear credentials from browser's credential manager only when exist.
    // Chrome 115 crash when calling preventSilentAccess() when no credentials exist.
    const hasCredentials = await checkIfCredentialsExist();

    if (isCredentialsManagementAPISupported && !!hasCredentials) {
      navigator.credentials.preventSilentAccess();
    }

    apolloClient.clearStore();

    if (externalLogoutUrl) {
      window.location.href = externalLogoutUrl;
    } else {
      navigate("/");
    }
  };

  const handleLogin = async (email: string, password: string) => {
    if (isCredentialsLogin) {
      return;
    }

    try {
      setIsCredentialsLogin(true);

      const result = await apolloClient.mutate<LoginMutation, LoginMutationVariables>({
        mutation: LoginDocument,
        variables: { email, password },
      });

      const tokenCreate = result.data?.tokenCreate;

      if (tokenCreate?.token) {
        storage.setTokens({
          accessToken: tokenCreate.token,
          refreshToken: tokenCreate.refreshToken,
        });
      }

      const errorList = tokenCreate?.errors?.map(({ code }) => code) as AuthErrorCodes[];

      const userLoggedInButHasNoPermissions =
        tokenCreate?.user && isEmpty(tokenCreate?.user?.userPermissions);

      if (userLoggedInButHasNoPermissions) {
        setErrors(["noPermissionsError"]);
        await handleLogout();
      }

      const hasUser = !!tokenCreate?.user;

      if (hasUser && !errorList?.length) {
        setAuthenticated(true);
        setUserDetails(tokenCreate!.user!);
        saveCredentials(tokenCreate!.user!, password);
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

      await logoutNonStaffUser(tokenCreate);

      return tokenCreate;
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

    const result = await apolloClient.mutate<
      ExternalAuthenticationUrlMutation,
      ExternalAuthenticationUrlMutationVariables
    >({
      mutation: ExternalAuthenticationUrlDocument,
      variables: { pluginId, input: stringifyInput },
    });

    return result.data?.externalAuthenticationUrl;
  };
  const handleExternalLogin = async (pluginId: string | null, input: ExternalLoginInput) => {
    if (!pluginId) {
      return;
    }

    try {
      const result = await apolloClient.mutate<
        ExternalObtainAccessTokensMutation,
        ExternalObtainAccessTokensMutationVariables
      >({
        mutation: ExternalObtainAccessTokensDocument,
        variables: { pluginId, input: JSON.stringify(input) },
      });

      const data = result.data?.externalObtainAccessTokens;

      if (data?.token) {
        storage.setAuthPluginId(pluginId);
        storage.setTokens({
          accessToken: data.token,
          refreshToken: data.refreshToken,
        });
      }

      if (isEmpty(data?.user?.userPermissions)) {
        setErrors(["noPermissionsError"]);
        await handleLogout();
      }

      if (!result || result.data?.externalObtainAccessTokens?.errors.length) {
        setErrors(["externalLoginError"]);
        await handleLogout();
      }

      if (data?.user) {
        setAuthenticated(true);
        setUserDetails(data.user);
      }

      await logoutNonStaffUser(data);

      setLastLoginMethod(pluginId);

      return data;
    } catch (error) {
      if (error instanceof ApolloError) {
        handleLoginError(error);
      } else {
        setErrors(["unknownLoginError"]);
      }
    }
  };
  const logoutNonStaffUser = async (data: LoginData | GetExternalAccessTokenData | undefined) => {
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
    authenticated: authenticated && !!userDetails?.isStaff && !errors.length,
    user: userDetails,
    refetchUser,
    errors,
  };
}
