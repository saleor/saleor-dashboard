import { permissions } from "@data/userPermissions";
import { test as setup } from "@playwright/test";
import { getStorageState } from "utils/auth";

setup("Authenticate for each permission type via API @e2e", async ({ page }, workerInfo) => {
  console.log("Saving file for: admin");
  await getStorageState("admin");

  for (const permissionName of permissions) {
    console.log("Saving file for:", permissionName);

    await getStorageState(permissionName);
  }
});
