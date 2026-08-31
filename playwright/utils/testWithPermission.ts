import { type UserPermission } from "@data/userPermissions";
import { test as base } from "@playwright/test";

import { getStorageState } from "./auth";

interface PermissionOptions {
  permissionName: UserPermission | "admin";
}

/**
 * Corner ripples (e.g. the Saleor Pulse video announcement) are fixed to the
 * viewport bottom-left and swallow pointer events over the savebar and list
 * rows. Mark them dismissed so they never render — see
 * `src/ripples/hooks/useRipplesStorage.ts` for the storage shape.
 */
const DISMISSED_RIPPLES = { "saleor-pulse": { manuallyHidden: true } };

export const test = base.extend<PermissionOptions>({
  permissionName: ["admin", { option: true }],

  storageState: async ({ permissionName }, loadStorage) => {
    const storageStatePath = await getStorageState(permissionName);

    await loadStorage(storageStatePath);
  },

  context: async ({ context }, loadContext) => {
    await context.addInitScript(dismissed => {
      window.localStorage.setItem("dashboard-ripples", JSON.stringify(dismissed));
    }, DISMISSED_RIPPLES);

    await loadContext(context);
  },
});
