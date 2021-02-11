import { DEMO_MODE } from "@saleor/config";
import { User } from "@saleor/fragments/types/User";
import { SetLocalStorage } from "@saleor/hooks/useLocalStorage";
import { commonMessages } from "@saleor/intl";
import { getMutationStatus } from "@saleor/misc";
import errorTracker from "@saleor/services/errorTracking";
import {
  isSupported as isCredentialsManagementAPISupported,
  login as loginWithCredentialsManagementAPI,
  saveCredentials
} from "@saleor/utils/credentialsManagement";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-apollo";

import {
  tokenAuthMutation,
  tokenRefreshMutation,
  tokenVerifyMutation
} from "../mutations";
import { RefreshToken, RefreshTokenVariables } from "../types/RefreshToken";
import {
  TokenAuth,
  TokenAuth_tokenCreate,
  TokenAuthVariables
} from "../types/TokenAuth";
import { VerifyToken, VerifyTokenVariables } from "../types/VerifyToken";
import {
  displayDemoMessage,
  getTokens,
  removeTokens,
  setAuthToken,
  setTokens
} from "../utils";
import { UseAuthProvider, UseAuthProviderOpts } from "./useAuthProvider";

export interface UseSaleorAuthProvider extends UseAuthProvider {
  login: (username: string, password: string) => Promise<TokenAuth_tokenCreate>;
  loginByToken: (auth: string, csrf: string, user: User) => void;
}
export interface UseSaleorAuthProviderOpts extends UseAuthProviderOpts {
  setAuthPlugin: SetLocalStorage<any>;
  authPlugin: string;
}

const persistToken = false;

export function useSaleorAuthProvider({
  apolloClient,
  authPlugin,
  intl,
  notify,
  setAuthPlugin
}: UseSaleorAuthProviderOpts): UseSaleorAuthProvider {
  const [userContext, setUserContext] = useState<undefined | User>(undefined);
  const autologinPromise = useRef<Promise<any>>();
  const refreshPromise = useRef<Promise<boolean>>();

  useEffect(() => {
    const token = getTokens().auth;
    if (!authPlugin && !!token && !userContext) {
      autologinPromise.current = tokenVerify({ variables: { token } });
    } else if (!authPlugin) {
      autologinPromise.current = loginWithCredentialsManagementAPI(login);
    }
  }, []);

  useEffect(() => {
    if (!authPlugin && userContext) {
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
    if (isCredentialsManagementAPISupported) {
      navigator.credentials.preventSilentAccess();
    }
    removeTokens();
  };

  const [tokenAuth, tokenAuthResult] = useMutation<
    TokenAuth,
    TokenAuthVariables
  >(tokenAuthMutation, {
    client: apolloClient,
    onCompleted: ({ tokenCreate }) => {
      if (tokenCreate.errors.length > 0) {
        logout();
      }

      const user = tokenCreate.user;

      setUserContext(user);
      if (user) {
        setTokens(tokenCreate.token, tokenCreate.csrfToken, persistToken);
      }
    },
    onError: logout
  });
  const [tokenRefresh] = useMutation<RefreshToken, RefreshTokenVariables>(
    tokenRefreshMutation,
    {
      client: apolloClient,
      onError: logout
    }
  );
  const [tokenVerify, tokenVerifyResult] = useMutation<
    VerifyToken,
    VerifyTokenVariables
  >(tokenVerifyMutation, {
    client: apolloClient,
    onCompleted: result => {
      if (result.tokenVerify === null) {
        logout();
      } else {
        const user = result.tokenVerify?.user;

        if (!!user) {
          setUserContext(user);
        }
      }
    },
    onError: logout
  });

  const tokenAuthOpts = {
    ...tokenAuthResult,
    status: getMutationStatus(tokenAuthResult)
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

  const login = async (email: string, password: string) => {
    setAuthPlugin(undefined);
    const result = await tokenAuth({ variables: { email, password } });

    if (result && !result.data.tokenCreate.errors.length) {
      if (!!onLogin) {
        onLogin();
      }
      saveCredentials(result.data.tokenCreate.user, password);
    }

    return result.data.tokenCreate;
  };

  const loginByToken = (auth: string, refresh: string, user: User) => {
    setAuthPlugin(undefined);
    setUserContext(user);
    setTokens(auth, refresh, persistToken);
  };

  const refreshToken = (): Promise<boolean> => {
    if (!!refreshPromise.current) {
      return refreshPromise.current;
    }

    return new Promise(resolve => {
      const token = getTokens().refresh;

      return tokenRefresh({ variables: { token } }).then(refreshData => {
        if (!!refreshData.data.tokenRefresh?.token) {
          setAuthToken(refreshData.data.tokenRefresh.token, persistToken);
          return resolve(true);
        }

        return resolve(false);
      });
    });
  };

  return {
    autologinPromise,
    login,
    loginByToken,
    logout,
    tokenAuthLoading: tokenAuthOpts.loading,
    tokenRefresh: refreshToken,
    tokenVerifyLoading: tokenVerifyOpts.loading,
    user: userContext
  };
}
