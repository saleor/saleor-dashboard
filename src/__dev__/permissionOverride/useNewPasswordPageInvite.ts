// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";

import { buildNewPasswordPageUrl } from "./buildNewPasswordPageUrl";
import { debugStaffInviteTokenStore } from "./debugStaffInviteTokenStore";
import {
  type NewPasswordPageInvite,
  readNewPasswordInviteFromLocation,
} from "./readNewPasswordInviteFromLocation";

export interface CapturedNewPasswordPageInvite extends NewPasswordPageInvite {
  url: string;
}

export const useNewPasswordPageInvite = (): CapturedNewPasswordPageInvite | null => {
  const location = useLocation();

  const pageInvite = useMemo(() => {
    const parsed = readNewPasswordInviteFromLocation(location.pathname, location.search);

    if (!parsed) {
      return null;
    }

    return {
      ...parsed,
      url: buildNewPasswordPageUrl(parsed.email, parsed.token),
    };
  }, [location.pathname, location.search]);

  useEffect(
    function persistInviteToken() {
      if (!pageInvite) {
        return;
      }

      debugStaffInviteTokenStore.set(pageInvite.email, pageInvite.token);
    },
    [pageInvite],
  );

  return pageInvite;
};
