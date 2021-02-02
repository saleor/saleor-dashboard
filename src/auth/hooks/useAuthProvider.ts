import { IMessageContext } from "@saleor/components/messages";
import { User } from "@saleor/fragments/types/User";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import ApolloClient from "apollo-client";
import { MutableRefObject } from "react";
import { IntlShape } from "react-intl";

import { useExternalAuthProvider } from "./useExternalAuthProvider";
import { useSaleorAuthProvider } from "./useSaleorAuthProvider";

export interface UseAuthProvider {
  logout: () => void;
  tokenAuthLoading: boolean;
  tokenRefresh: () => Promise<boolean>;
  tokenVerifyLoading: boolean;
  user?: User;
  autologinPromise?: MutableRefObject<Promise<any>>;
}
export interface UseAuthProviderOpts {
  intl: IntlShape;
  notify: IMessageContext;
  apolloClient: ApolloClient<any>;
}

export function useAuthProvider(opts: UseAuthProviderOpts) {
  const [authPlugin, setAuthPlugin] = useLocalStorage("authPlugin", undefined);

  const saleorAuth = useSaleorAuthProvider({
    authPlugin,
    setAuthPlugin,
    ...opts
  });

  const externalAuth = useExternalAuthProvider({
    authPlugin,
    setAuthPlugin,
    ...opts
  });

  const loginAuth = {
    login: saleorAuth.login,
    loginByExternalPlugin: externalAuth.loginByExternalPlugin,
    loginByToken: saleorAuth.loginByToken,
    requestLoginByExternalPlugin: externalAuth.requestLoginByExternalPlugin
  };

  if (authPlugin) {
    return {
      ...externalAuth,
      ...loginAuth
    };
  }

  return {
    ...saleorAuth,
    ...loginAuth
  };
}
