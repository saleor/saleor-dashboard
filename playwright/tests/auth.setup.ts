import { permissions } from "@data/userPermissions";
import { test as setup } from "@playwright/test";
import { getStorageState } from "utils/auth";

setup.describe.configure({ mode: "serial" });

setup("Authenticate for each permission type via API", async ({ page }, workerInfo) => {
  const shardNumber = workerInfo.config.shard?.current || 1;

  console.log("Shard number", shardNumber);
  await page.waitForTimeout(shardNumber * 1000);

  await getStorageState("admin");

  for (const permissionName of permissions) {
    console.log("Loading permission", permissionName);
    await getStorageState(permissionName);
  }
});
