import { IMessageContext } from "@saleor/components/messages";
import { UseNotifierResult } from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { ApolloError } from "apollo-client";
import { IntlShape } from "react-intl";

import { isJwtError, isTokenExpired } from "./errors";

export enum TOKEN_STORAGE_KEY {
  AUTH = "auth",
  CSRF = "csrf"
}

export const getTokens = () => ({
  auth:
    localStorage.getItem(TOKEN_STORAGE_KEY.AUTH) ||
    sessionStorage.getItem(TOKEN_STORAGE_KEY.AUTH),
  refresh:
    localStorage.getItem(TOKEN_STORAGE_KEY.CSRF) ||
    sessionStorage.getItem(TOKEN_STORAGE_KEY.CSRF)
});

export const setTokens = (auth: string, csrf: string, persist: boolean) => {
  if (persist) {
    localStorage.setItem(TOKEN_STORAGE_KEY.AUTH, auth);
    localStorage.setItem(TOKEN_STORAGE_KEY.CSRF, csrf);
  } else {
    sessionStorage.setItem(TOKEN_STORAGE_KEY.AUTH, auth);
    sessionStorage.setItem(TOKEN_STORAGE_KEY.CSRF, csrf);
  }
};

export const setAuthToken = (auth: string, persist: boolean) => {
  if (persist) {
    localStorage.setItem(TOKEN_STORAGE_KEY.AUTH, auth);
  } else {
    sessionStorage.setItem(TOKEN_STORAGE_KEY.AUTH, auth);
  }
};

export const removeTokens = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY.AUTH);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY.AUTH);
};

export const displayDemoMessage = (
  intl: IntlShape,
  notify: UseNotifierResult
) => {
  notify({
    text: intl.formatMessage(commonMessages.demo)
  });
};

export async function handleQueryAuthError(
  error: ApolloError,
  notify: IMessageContext,
  tokenRefresh: () => Promise<boolean>,
  logout: () => void,
  intl: IntlShape
) {
  if (error.graphQLErrors.some(isJwtError)) {
    if (error.graphQLErrors.every(isTokenExpired)) {
      const success = await tokenRefresh();

      if (!success) {
        logout();
        notify({
          status: "error",
          text: intl.formatMessage(commonMessages.sessionExpired)
        });
      }
    } else {
      logout();
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.somethingWentWrong)
      });
    }
  } else if (
    !error.graphQLErrors.every(
      err => err.extensions?.exception?.code === "PermissionDenied"
    )
  ) {
    notify({
      status: "error",
      text: intl.formatMessage(commonMessages.somethingWentWrong)
    });
  }
}
