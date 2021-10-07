import { IMessageContext } from "@saleor/components/messages";
import { DEMO_MODE } from "@saleor/config";
import { User } from "@saleor/fragments/types/User";
import { useAuth, useAuthState } from "@saleor/sdk";
import {
  AccountErrorFragment,
  CreateToken,
  MutationSetPasswordArgs,
  SetPasswordMutation,
  UserFragment
} from "@saleor/sdk/dist/apollo/types";
import {
  isSupported as isCredentialsManagementAPISupported,
  login as loginWithCredentialsManagementAPI,
  saveCredentials
} from "@saleor/utils/credentialsManagement";
import { FetchResult } from "apollo-link";
import { MutableRefObject, useEffect, useRef } from "react";
import { useQuery } from "react-apollo";
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
  setPassword: (
    opts: MutationSetPasswordArgs
  ) => Promise<
    FetchResult<SetPasswordMutation, Record<string, any>, Record<string, any>>
  >;
  authenticated: boolean;
  authenticating: boolean;
  user?: User;
  autologinPromise?: MutableRefObject<Promise<any>>;
}
export interface UseAuthProviderOpts {
  intl: IntlShape;
  notify: IMessageContext;
}

export function useAuthProvider({
  intl,
  notify
}: UseAuthProviderOpts): UseAuthProvider {
  const { login, logout, setPassword } = useAuth();
  const { authenticated, authenticating } = useAuthState();

  const autologinPromise = useRef<Promise<any>>();

  useEffect(() => {
    autologinPromise.current = loginWithCredentialsManagementAPI(handleLogin);
  }, []);

  const userDetails = useQuery<UserDetails>(userDetailsQuery, {
    skip: !authenticated || authenticating
  });

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
    setPassword,
    authenticating,
    authenticated,
    user: userDetails.data?.me,
    autologinPromise
  };
}
