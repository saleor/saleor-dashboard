import { DEMO_MODE } from "@saleor/config";
import { User } from "@saleor/fragments/types/User";
import useNotifier from "@saleor/hooks/useNotifier";
import { getMutationStatus } from "@saleor/misc";
import {
  isSupported as isCredentialsManagementAPISupported,
  login as loginWithCredentialsManagementAPI,
  saveCredentials
} from "@saleor/utils/credentialsManagement";
import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "react-apollo";
import { useIntl } from "react-intl";

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
  getAuthToken,
  removeAuthToken,
  setAuthToken
} from "./utils";

const persistToken = false;

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const intl = useIntl();
  const notify = useNotifier();

  const [userContext, setUserContext] = useState<undefined | User>(undefined);

  const logout = () => {
    setUserContext(undefined);
    if (isCredentialsManagementAPISupported) {
      navigator.credentials.preventSilentAccess();
    }
    removeAuthToken();
  };

  const [tokenAuth, tokenAuthResult] = useMutation<
    TokenAuth,
    TokenAuthVariables
  >(tokenAuthMutation, {
    onCompleted: result => {
      if (result.tokenCreate.errors.length > 0) {
        logout();
      }

      const user = result.tokenCreate.user;

      // FIXME: Now we set state also when auth fails and returned user is
      // `null`, because the LoginView uses this `null` to display error.
      setUserContext(user);
      if (user) {
        setAuthToken(result.tokenCreate.token, persistToken);
      }
    },
    onError: logout
  });
  const [tokenRefresh] = useMutation<RefreshToken, RefreshTokenVariables>(
    tokenRefreshMutation,
    {
      onError: logout
    }
  );
  const [tokenVerify, tokenVerifyResult] = useMutation<
    VerifyToken,
    VerifyTokenVariables
  >(tokenVerifyMutation, {
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
    const token = getAuthToken();
    if (!!token && !userContext) {
      verifyToken(token);
    } else {
      loginWithCredentialsManagementAPI(login);
    }
  }, []);

  const login = async (email: string, password: string) => {
    tokenAuth({ variables: { email, password } }).then(result => {
      if (result && !result.data.tokenCreate.errors.length) {
        if (!!onLogin) {
          onLogin();
        }
        saveCredentials(result.data.tokenCreate.user, password);
      }
    });
  };

  const loginByToken = (token: string, user: User) => {
    setUserContext(user);
    setAuthToken(token, persistToken);
  };

  const verifyToken = (token: string) => tokenVerify({ variables: { token } });

  const refreshToken = async () => {
    const token = getAuthToken();

    const refreshData = await tokenRefresh({ variables: { token } });

    setAuthToken(refreshData.data.tokenRefresh.token, persistToken);
  };

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
    hasToken: !!getAuthToken(),
    isAuthenticated,
    tokenAuthLoading: user.tokenAuthLoading,
    tokenVerifyLoading: user.tokenVerifyLoading,
    user: user.user
  };
};

export default AuthProvider;
