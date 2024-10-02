import { UserPermission } from "@data/userPermissions";
import { test } from "@playwright/test";

import { getStorageState } from "./auth";

export function testWithPermission(
  permission: UserPermission | "admin",
  testObject?: typeof test,
): typeof test {
  const base = testObject ? testObject : test;

  return base.extend({
    // eslint-disable-next-line no-empty-pattern
    storageState: async ({}, use) => {
      const storageStatePath = await getStorageState({
        permission,
        workerIndex: base.info().workerIndex,
      });

      await use(storageStatePath);
    },
  });
}
