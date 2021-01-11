import { IMessageContext } from "@saleor/components/messages";
import { DEMO_MODE } from "@saleor/config";
import { User } from "@saleor/fragments/types/User";
import useNotifier from "@saleor/hooks/useNotifier";
import { getMutationStatus } from "@saleor/misc";
import {
  isSupported as isCredentialsManagementAPISupported,
  login as loginWithCredentialsManagementAPI,
  saveCredentials
} from "@saleor/utils/credentialsManagement";
import ApolloClient from "apollo-client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useApolloClient, useMutation } from "react-apollo";
import { IntlShape, useIntl } from "react-intl";

import { UserContext } from "./";
import {
  tokenAuthMutation,
  tokenRefreshMutation,
  tokenVerifyMutation
} from "./mutations";
import { RefreshToken, RefreshTokenVariables } from "./types/RefreshToken";
import { TokenAuth, TokenAuthVariables } from "./types/TokenAuth";
import { VerifyToken, VerifyTokenVariables } from "./types/VerifyToken";
import {
  displayDemoMessage,
  getTokens,
  removeTokens,
  setAuthToken,
  setTokens
} from "./utils";

const persistToken = false;

export function useAuthProvider(
  intl: IntlShape,
  notify: IMessageContext,
  apolloClient: ApolloClient<any>
) {
  const [userContext, setUserContext] = useState<undefined | User>(undefined);
  const autologinPromise = useRef<Promise<any>>();
  const refreshPromise = useRef<Promise<boolean>>();

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
    onCompleted: result => {
      if (result.tokenCreate.errors.length > 0) {
        logout();
      }

      const user = result.tokenCreate.user;

      // FIXME: Now we set state also when auth fails and returned user is
      // `null`, because the LoginView uses this `null` to display error.
      setUserContext(user);
      if (user) {
        setTokens(
          result.tokenCreate.token,
          result.tokenCreate.csrfToken,
          persistToken
        );
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

  useEffect(() => {
    const token = getTokens().auth;
    if (!!token && !userContext) {
      autologinPromise.current = tokenVerify({ variables: { token } });
    } else {
      autologinPromise.current = loginWithCredentialsManagementAPI(login);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const result = await tokenAuth({ variables: { email, password } });

    if (result && !result.data.tokenCreate.errors.length) {
      if (!!onLogin) {
        onLogin();
      }
      saveCredentials(result.data.tokenCreate.user, password);

      return result.data.tokenCreate.user;
    }

    return null;
  };

  const loginByToken = (auth: string, refresh: string, user: User) => {
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
    refreshToken,
    tokenAuthOpts,
    tokenVerifyOpts,
    userContext
  };
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const apolloClient = useApolloClient();
  const intl = useIntl();
  const notify = useNotifier();

  const {
    login,
    loginByToken,
    logout,
    tokenAuthOpts,
    refreshToken,
    tokenVerifyOpts,
    userContext
  } = useAuthProvider(intl, notify, apolloClient);

  return (
    <UserContext.Provider
      value={{
        login,
        loginByToken,
        logout,
        tokenAuthLoading: tokenAuthOpts.loading,
        tokenRefresh: refreshToken,
        tokenVerifyLoading: tokenVerifyOpts.loading,
        user: userContext
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const user = useContext(UserContext);
  const isAuthenticated = !!user.user;

  return {
    hasToken: !!getTokens(),
    isAuthenticated,
    tokenAuthLoading: user.tokenAuthLoading,
    tokenVerifyLoading: user.tokenVerifyLoading,
    user: user.user
  };
};

export default AuthProvider;
