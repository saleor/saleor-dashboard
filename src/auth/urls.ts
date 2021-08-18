import { stringifyQs } from "@saleor/utils/urls";

export const passwordResetPath = "/reset-password/";
export const passwordResetUrl = passwordResetPath;

export const passwordResetSuccessPath = "/reset-password/success/";
export const passwordResetSuccessUrl = passwordResetSuccessPath;

export const newPasswordPath = "/new-password/";

export const loginCallbackPath = "/login/callback/";

export interface NewPasswordUrlQueryParams {
  email: string;
  token: string;
}
export const newPasswordUrl = (params?: NewPasswordUrlQueryParams) =>
  newPasswordPath + "?" + stringifyQs(params);

export interface LoginOpenidconnectUrlQueryParams {
  code: string;
  state: string;
}
export type LoginUrlQueryParams = LoginOpenidconnectUrlQueryParams;
