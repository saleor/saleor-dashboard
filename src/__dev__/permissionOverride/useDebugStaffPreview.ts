// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { type PermissionEnum } from "@dashboard/graphql";
import { useEffect, useState } from "react";

import { buildDebugStaffEmail } from "./debugStaffEmail";
import { debugStaffProfileStore } from "./debugStaffProfileStore";
import { hashPermissions } from "./permissionsHash";

interface DebugStaffPreview {
  debugEmail: string;
  hash: string;
  savedProfile: ReturnType<typeof debugStaffProfileStore.getByHash>;
}

interface UseDebugStaffPreviewOptions {
  baseEmail: string;
  grantablePermissions: PermissionEnum[];
  selectedPermissions: PermissionEnum[];
}

export const useDebugStaffPreview = ({
  baseEmail,
  grantablePermissions,
  selectedPermissions,
}: UseDebugStaffPreviewOptions) => {
  const [preview, setPreview] = useState<DebugStaffPreview | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    if (!baseEmail) {
      setPreview(null);
      setIsResolving(false);

      return;
    }

    let cancelled = false;

    setIsResolving(true);

    void (async () => {
      const hash = await hashPermissions(grantablePermissions);
      const debugEmail = buildDebugStaffEmail(baseEmail, hash);
      const savedProfile = debugStaffProfileStore.getByHash(baseEmail, hash);

      if (!cancelled) {
        setPreview({ debugEmail, hash, savedProfile });
        setIsResolving(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [baseEmail, grantablePermissions, selectedPermissions]);

  return { preview, isResolving };
};
