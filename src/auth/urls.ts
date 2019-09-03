import { stringify as stringifyQs } from "qs";

export const passwordResetPath = "/reset-password/";
export const passwordResetUrl = passwordResetPath;

export const passwordResetSuccessPath = "/reset-password/success/";
export const passwordResetSuccessUrl = passwordResetSuccessPath;

export const newPasswordPath = "/new-password/";
export interface NewPasswordUrlQueryParams {
  email: string;
  token: string;
}
export const newPasswordUrl = (params?: NewPasswordUrlQueryParams) =>
  newPasswordPath + "?" + stringifyQs(params);
