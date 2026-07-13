import { stringifyQs } from "@dashboard/utils/urls";

export const passwordResetPath = "/reset-password/";
export const passwordResetUrl = passwordResetPath;

export const passwordResetSuccessPath = "/reset-password/success/";
export const passwordResetSuccessUrl = passwordResetSuccessPath;

export const newPasswordPath = "/new-password/";

export const loginCallbackPath = "/login/callback/";

const AUTH_ONLY_PATHS = [newPasswordPath, passwordResetPath, passwordResetSuccessPath] as const;

export const isAuthOnlyPath = (pathname: string): boolean => {
  const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;

  return AUTH_ONLY_PATHS.some(path => normalizedPath.endsWith(path));
};

export interface NewPasswordUrlQueryParams {
  email: string;
  token: string;
}
export const newPasswordUrl = (params?: NewPasswordUrlQueryParams) =>
  newPasswordPath + "?" + stringifyQs(params);

interface LoginOpenidconnectUrlQueryParams {
  code: string;
  state: string;
}
export type LoginUrlQueryParams = LoginOpenidconnectUrlQueryParams;
