import { UserPermission } from "@data/userPermissions";
import { test as base } from "@playwright/test";

import { getStorageState } from "./auth";

interface PermissionOptions {
  permissionName: UserPermission | "admin";
}

export const test = base.extend<PermissionOptions>({
  permissionName: ["admin", { option: true }],

  storageState: async ({ permissionName }, use) => {
    const storageStatePath = await getStorageState(permissionName);

    await use(storageStatePath);
  },
});
