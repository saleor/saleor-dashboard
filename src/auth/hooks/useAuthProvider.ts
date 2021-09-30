import { IMessageContext } from "@saleor/components/messages";
import { DEMO_MODE } from "@saleor/config";
import { User } from "@saleor/fragments/types/User";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import useNotifier from "@saleor/hooks/useNotifier";
import { useAuth, useAuthState } from "@saleor/sdk";
import {
  AccountErrorFragment,
  CreateToken,
  UserFragment
} from "@saleor/sdk/dist/apollo/types";
import {
  isSupported as isCredentialsManagementAPISupported,
  login as loginWithCredentialsManagementAPI,
  saveCredentials
} from "@saleor/utils/credentialsManagement";
import ApolloClient from "apollo-client";
import { MutableRefObject, useState } from "react";
import { useQuery } from "react-apollo";
import { useIntl } from "react-intl";
import { IntlShape } from "react-intl";

import { userDetailsQuery } from "../queries";
import { UserDetails } from "../types/UserDetails";
import { displayDemoMessage } from "../utils";

export interface UseAuthProvider {
  login: (
    username: string,
    password: string
  ) => Promise<
    Pick<CreateToken, "refreshToken" | "token" | "csrfToken"> & {
      errors: AccountErrorFragment[];
      user?: UserFragment;
    }
  >;
  logout: () => void;
  authenticated: boolean;
  authenticating: boolean;
  user?: User;
}
export interface UseAuthProviderOpts {
  intl: IntlShape;
  notify: IMessageContext;
}

export function useAuthProvider(): UseAuthProvider {
  const intl = useIntl();
  const notify = useNotifier();

  const { login, logout } = useAuth();
  const { user, token, authenticated, authenticating } = useAuthState();

  const userDetails = useQuery<UserDetails>(userDetailsQuery, {
    skip: !authenticated
  });
  // const userDetails = useUserDetailsQuery({
  //   skip: !authenticated
  // });

  const handleLogout = () => {
    logout();

    if (isCredentialsManagementAPISupported) {
      navigator.credentials.preventSilentAccess();
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

  return {
    login: handleLogin,
    logout: handleLogout,
    authenticating, // || userDetails.loading,
    authenticated, // && !!userDetails.data?.me,
    user: userDetails.data?.me // userContext // userDetails.data?.me
  };
}
