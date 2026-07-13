// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { type PermissionEnum } from "@dashboard/graphql";
import { useSyncExternalStore } from "react";

import { permissionOverrideStore } from "./store";

/**
 * Returns the developer's permission override, or `null` when no override is
 * active. When non-null, callers should treat the array as the user's
 * effective `userPermissions.code` set.
 */
export const usePermissionOverride = (): PermissionEnum[] | null =>
  useSyncExternalStore(
    permissionOverrideStore.subscribe,
    permissionOverrideStore.getSnapshot,
    () => null,
  );
