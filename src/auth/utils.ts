import { UseNotifierResult } from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { IntlShape } from "react-intl";

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
  // localStorage.removeItem(TOKEN_STORAGE_KEY.CSRF);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY.AUTH);
  // sessionStorage.removeItem(TOKEN_STORAGE_KEY.CSRF);
};

export const displayDemoMessage = (
  intl: IntlShape,
  notify: UseNotifierResult
) => {
  notify({
    text: intl.formatMessage(commonMessages.demo)
  });
};
