import { permissions } from "@data/userPermissions";
import { test as setup } from "@playwright/test";
import { getStorageState } from "utils/auth";

setup.describe.configure({ mode: "serial" });

setup("Authenticate for each permission type via API", async () => {
  await getStorageState("admin");

  for (const permissionName of permissions) {
    console.log("Loading permission", permissionName);
    await getStorageState(permissionName);
  }
});
