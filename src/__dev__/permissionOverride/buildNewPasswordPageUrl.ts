// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { newPasswordUrl } from "@dashboard/auth/urls";
import { getAppMountUriForRedirect } from "@dashboard/utils/urls";
import urlJoin from "url-join";

export const buildNewPasswordPageUrl = (email: string, token: string): string => {
  const pathWithQuery = newPasswordUrl({ email, token }).replace(/^\//, "");

  return urlJoin(window.location.origin, getAppMountUriForRedirect(), pathWithQuery);
};
