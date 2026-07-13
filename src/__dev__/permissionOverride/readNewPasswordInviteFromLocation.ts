// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { newPasswordPath } from "@dashboard/auth/urls";
import { parseQs } from "@dashboard/url-utils";

export interface NewPasswordPageInvite {
  email: string;
  token: string;
}

export const readNewPasswordInviteFromLocation = (
  pathname: string,
  search: string,
): NewPasswordPageInvite | null => {
  const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;

  if (!normalizedPath.endsWith(newPasswordPath)) {
    return null;
  }

  const query = search.startsWith("?") ? search.slice(1) : search;
  const params = parseQs(query) as { email?: string; token?: string };

  if (!params.email || !params.token) {
    return null;
  }

  return {
    email: params.email,
    token: params.token,
  };
};
