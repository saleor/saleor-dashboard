import { UserPermission } from "@data/userPermissions";
import { test as base } from "@playwright/test";

import { getStorageState } from "./auth";

/**
 * A wrapper around the test function from Playwright.
 * It retrieves the storage state for a given user permission before running the test.
 * The storage state is used to authenticate the user via API.
 * If the storage state does not exist, the function creates the necessary directories,
 * logs in the user via API, and saves the storage state to a file.
 * The test function is then extended with the storage state, so that the user is authenticated when running the test.
 *
 * @param {UserPermission} permission - The user permission for which to retrieve the storage state.
 * @returns {typeof base} - The extended test function with the storage state.
 */
export function testWithPermission(permission: UserPermission | "admin"): typeof base {
  return base.extend({
    // eslint-disable-next-line no-empty-pattern
    storageState: async ({}, use) => {
      const storageStatePath = await getStorageState(permission);

      await use(storageStatePath);
    },
  });
}
