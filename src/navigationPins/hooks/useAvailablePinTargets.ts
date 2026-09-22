import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasOneOfPermissions } from "@dashboard/components/RequirePermissions";
import { useMemo } from "react";

import { PIN_TARGETS, type PinTarget } from "../constants";
import { type PinScope } from "../types";

/**
 * A user pin may only target a section you can see yourself, since you are the only one who
 * will ever look at it. Organization pins are not filtered — you are configuring the sidebar
 * for other people, who may well have permissions you lack.
 */
export const useAvailablePinTargets = (scope: PinScope): PinTarget[] => {
  const userPermissions = useUserPermissions() ?? [];

  return useMemo(
    () =>
      PIN_TARGETS.filter(target => {
        if (scope === "organization") {
          return target.organizationAllowed;
        }

        return (
          target.permissions.length === 0 ||
          hasOneOfPermissions(userPermissions, target.permissions)
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scope, userPermissions.length],
  );
};
