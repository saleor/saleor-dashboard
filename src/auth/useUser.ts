// DEV-ONLY-PERMISSION-OVERRIDE: remove this import and the override block
// inside `useUser` below before pushing upstream. See
// src/__dev__/permissionOverride/store.ts for full removal instructions.
import { createContext, useContext, useMemo } from "react";

import { usePermissionOverride } from "./permissionOverrideBinding";
import { type UserContext as Context } from "./types";

export const UserContext = createContext<Context>({
  login: undefined,
  loginByExternalPlugin: undefined,
  logout: undefined,
  requestLoginByExternalPlugin: undefined,
  authenticating: false,
  isCredentialsLogin: false,
  authenticated: false,
  errors: [],
  refetchUser: undefined,
});

export const useUser = (): Context => {
  const ctx = useContext(UserContext);
  // DEV-ONLY-PERMISSION-OVERRIDE: when the developer has set an override via
  // the floating widget, replace the user's `userPermissions` so every
  // consumer (`useUserPermissions`, `RequirePermissions`, `SectionRoute`,
  // `useCanEditCustomers`, ...) sees the impersonated set. When the
  // override is null this returns the real context unchanged.
  const override = usePermissionOverride();

  return useMemo(() => {
    if (override !== null && ctx.user) {
      return {
        ...ctx,
        user: {
          ...ctx.user,
          userPermissions: override.map(code => ({
            __typename: "UserPermission" as const,
            code,
            name: code,
          })),
        },
      };
    }

    return ctx;
  }, [ctx, override]);
};
