import { DEMO_MODE } from "@saleor/config";
import { User } from "@saleor/fragments/types/User";
import { SetLocalStorage } from "@saleor/hooks/useLocalStorage";
import { commonMessages } from "@saleor/intl";
import { getMutationStatus } from "@saleor/misc";
import errorTracker from "@saleor/services/errorTracking";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-apollo";

import {
  externalAuthenticationUrlMutation,
  externalObtainAccessTokensMutation,
  externalTokenRefreshMutation,
  externalTokenVerifyMutation
} from "../mutations";
import {
  ExternalAuthenticationUrl,
  ExternalAuthenticationUrlVariables
} from "../types/ExternalAuthenticationUrl";
import {
  ExternalObtainAccessTokens,
  ExternalObtainAccessTokens_externalObtainAccessTokens,
  ExternalObtainAccessTokensVariables
} from "../types/ExternalObtainAccessTokens";
import {
  ExternalRefreshToken,
  ExternalRefreshTokenVariables
} from "../types/ExternalRefreshToken";
import {
  ExternalVerifyToken,
  ExternalVerifyTokenVariables
} from "../types/ExternalVerifyToken";
import {
  displayDemoMessage,
  getTokens,
  removeTokens,
  setAuthToken,
  setTokens
} from "../utils";
import { UseAuthProvider, UseAuthProviderOpts } from "./useAuthProvider";

export interface RequestExternalLoginInput {
  redirectUri: string;
}
export interface ExternalLoginInput {
  code: string;
  state: string;
}

export interface UseExternalAuthProvider extends UseAuthProvider {
  requestLoginByExternalPlugin: (
    pluginId: string,
    input: RequestExternalLoginInput
  ) => Promise<void>;
  loginByExternalPlugin: (
    input: ExternalLoginInput
  ) => Promise<ExternalObtainAccessTokens_externalObtainAccessTokens>;
}
export interface UseExternalAuthProviderOpts extends UseAuthProviderOpts {
  setAuthPlugin: SetLocalStorage<any>;
  authPlugin: string;
}

const persistToken = false;

export function useExternalAuthProvider({
  apolloClient,
  authPlugin,
  intl,
  notify,
  setAuthPlugin
}: UseExternalAuthProviderOpts): UseExternalAuthProvider {
  const [userContext, setUserContext] = useState<undefined | User>(undefined);
  const autologinPromise = useRef<Promise<any>>();
  const refreshPromise = useRef<Promise<boolean>>();

  useEffect(() => {
    const token = getTokens().auth;
    if (authPlugin && !!token && !userContext) {
      const input = JSON.stringify({
        token
      });
      autologinPromise.current = tokenVerify({
        variables: { input, pluginId: authPlugin }
      });
    }
  }, []);

  useEffect(() => {
    if (authPlugin && userContext) {
      const { id, email, firstName, lastName } = userContext;
      errorTracker.setUserData({
        email,
        id,
        username: `${firstName} ${lastName}`
      });

      if (!userContext.isStaff) {
        logout();
        notify({
          status: "error",
          text: intl.formatMessage(commonMessages.unauthorizedDashboardAccess),
          title: intl.formatMessage(commonMessages.insufficientPermissions)
        });
      }
    }
  }, [userContext]);

  const logout = () => {
    setUserContext(undefined);
    setAuthPlugin(undefined);
    removeTokens();
  };

  const [externalAuthenticationUrl] = useMutation<
    ExternalAuthenticationUrl,
    ExternalAuthenticationUrlVariables
  >(externalAuthenticationUrlMutation, {
    client: apolloClient,
    onError: logout
  });
  const [obtainAccessTokens, obtainAccessTokensResult] = useMutation<
    ExternalObtainAccessTokens,
    ExternalObtainAccessTokensVariables
  >(externalObtainAccessTokensMutation, {
    client: apolloClient,
    onCompleted: ({ externalObtainAccessTokens }) => {
      if (externalObtainAccessTokens.errors.length > 0) {
        logout();
      }

      const user = externalObtainAccessTokens.user;

      setUserContext(user);
      if (user) {
        setTokens(
          externalObtainAccessTokens.token,
          externalObtainAccessTokens.csrfToken,
          persistToken
        );
      }
    },
    onError: logout
  });
  const [tokenRefresh] = useMutation<
    ExternalRefreshToken,
    ExternalRefreshTokenVariables
  >(externalTokenRefreshMutation, {
    client: apolloClient,
    onError: logout
  });
  const [tokenVerify, tokenVerifyResult] = useMutation<
    ExternalVerifyToken,
    ExternalVerifyTokenVariables
  >(externalTokenVerifyMutation, {
    client: apolloClient,
    onCompleted: result => {
      if (result.externalVerify === null) {
        logout();
      } else {
        const user = result.externalVerify?.user;

        if (!!user) {
          setUserContext(user);
        }
      }
    },
    onError: logout
  });

  const obtainAccessTokensOpts = {
    ...obtainAccessTokensResult,
    status: getMutationStatus(obtainAccessTokensResult)
  };
  const tokenVerifyOpts = {
    ...tokenVerifyResult,
    status: getMutationStatus(tokenVerifyResult)
  };

  const onLogin = () => {
    if (DEMO_MODE) {
      displayDemoMessage(intl, notify);
    }
  };

  const requestLoginByExternalPlugin = async (
    pluginId: string,
    pluginInput: RequestExternalLoginInput
  ) => {
    const input = JSON.stringify(pluginInput);
    const result = await externalAuthenticationUrl({
      variables: {
        input,
        pluginId
      }
    });

    if (result && !result.data.externalAuthenticationUrl.errors.length) {
      setAuthPlugin(pluginId);

      const authenticationData = JSON.parse(
        result.data.externalAuthenticationUrl.authenticationData
      );

      location.href = authenticationData.authorizationUrl;
    } else {
      setAuthPlugin(undefined);
    }
  };

  const loginByExternalPlugin = async (loginInput: ExternalLoginInput) => {
    const input = JSON.stringify(loginInput);
    const result = await obtainAccessTokens({
      variables: { input, pluginId: authPlugin }
    });

    if (result && !result.data?.externalObtainAccessTokens?.errors?.length) {
      if (!!onLogin) {
        onLogin();
      }
    } else {
      setAuthPlugin(undefined);
    }

    return result?.data?.externalObtainAccessTokens;
  };

  const refreshToken = (): Promise<boolean> => {
    if (!!refreshPromise.current) {
      return refreshPromise.current;
    }

    return new Promise(resolve => {
      const token = getTokens().refresh;
      const input = JSON.stringify({
        refreshToken: token
      });

      return tokenRefresh({ variables: { input, pluginId: authPlugin } }).then(
        refreshData => {
          if (!!refreshData.data.externalRefresh?.token) {
            setAuthToken(refreshData.data.externalRefresh.token, persistToken);
            return resolve(true);
          }

          return resolve(false);
        }
      );
    });
  };

  return {
    autologinPromise,
    loginByExternalPlugin,
    logout,
    requestLoginByExternalPlugin,
    tokenAuthLoading: obtainAccessTokensOpts.loading,
    tokenRefresh: refreshToken,
    tokenVerifyLoading: tokenVerifyOpts.loading,
    user: userContext
  };
}
