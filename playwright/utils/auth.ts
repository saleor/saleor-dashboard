import { BasicApiService } from "@api/basics";
import { USER_PERMISSION, UserPermission } from "@data/userPermissions";
import { request } from "@playwright/test";
import fs from "fs";
import path from "path";

const CHECK_INTERVAL = 100;
const TIMEOUT = 30000;

/**
 * Retrieves the storage state for a given user permission.
 * If the storage state does not exist, it creates the necessary directories,
 * logs in the user via API, and saves the storage state to a file.
 *
 * @param {UserPermission} permission - The user permission for which to retrieve the storage state.
 * @param {number} workerIndex - The index of the worker executing the function.
 * @returns {Promise<string>} - A promise that resolves to the path of the storage state file.
 */
export const getStorageState = async (
  permission: UserPermission | "admin",
  workerIndex: number,
): Promise<string> => {
  const tempDir = path.join(__dirname, "../.auth");
  const storageStatePath = path.join(tempDir, `${permission}.json`);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  if (!fs.existsSync(storageStatePath)) {
    await createAndFillStorageStateFile(storageStatePath, permission, workerIndex);

    return storageStatePath;
  } else {
    const filled = await waitForFileToBeFilled(storageStatePath, permission, workerIndex);

    if (filled) {
      return storageStatePath;
    } else {
      throw new Error(`Failed to fill storage state file for permission ${permission}`);
    }
  }
};

const waitForFileToBeFilled = async (
  storageStatePath: string,
  permission: UserPermission | "admin",
  workerIndex: number,
): Promise<boolean> => {
  const startTime = Date.now();

  while (Date.now() - startTime < TIMEOUT) {
    try {
      const fileContent = fs.readFileSync(storageStatePath, "utf-8");

      if (fileContent.trim() !== "") {
        JSON.parse(fileContent);

        console.log(
          `[getStorageState][Permission ${permission}][Worker ${workerIndex}] Detected filled and valid storage state file at: ${new Date().toISOString()}`,
        );

        return true;
      }
    } catch (error) {
      console.warn(
        `[getStorageState][Permission ${permission}][Worker ${workerIndex}] Detected malformed storage state file at: ${new Date().toISOString()}, continuing to wait...`,
      );
    }

    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }

  console.warn(
    `[getStorageState][Permission ${permission}][Worker ${workerIndex}] Timeout waiting for storage state file.`,
  );

  return false;
};

const createAndFillStorageStateFile = async (
  storageStatePath: string,
  permission: UserPermission | "admin",
  workerIndex: number,
): Promise<void> => {
  console.log(
    `[getStorageState][Permission ${permission}][Worker ${workerIndex}] Creating empty storage state file at: ${new Date().toISOString()}`,
  );
  fs.writeFileSync(storageStatePath, "");

  const apiRequestContext = await request.newContext({
    baseURL: process.env.BASE_URL!,
  });

  const basicApiService = new BasicApiService(apiRequestContext, workerIndex);

  const email = getEmailForPermission(permission);
  const password = getPasswordForPermission(permission);

  console.log(
    `[getStorageState][Permission ${permission}][Worker ${workerIndex}] Proceeding to fill storage state file at: ${new Date().toISOString()}`,
  );

  try {
    await basicApiService.logInUserViaApi({ email, password });
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      throw new Error("An unknown error occurred while logging in the user via API");
    }

    const message = `logInUserViaApi failed for ${email}: ${error.message}`;

    console.error(message);
    throw new Error(message);
  }

  const loginJsonInfo = await apiRequestContext.storageState();

  loginJsonInfo.origins.push({
    origin: process.env.BASE_URL!,
    localStorage: [
      {
        name: "_saleorRefreshToken",
        value: loginJsonInfo.cookies[0].value,
      },
    ],
  });

  const tempPath = `${storageStatePath}.tmp`;

  fs.writeFileSync(tempPath, JSON.stringify(loginJsonInfo, null, 2));
  fs.renameSync(tempPath, storageStatePath);

  console.log(
    `[getStorageState][Permission ${permission}][Worker ${workerIndex}] Filled storage state file at: ${new Date().toISOString()}`,
  );

  await apiRequestContext.dispose();
};

const getEmailForPermission = (permission: UserPermission | "admin"): string => {
  if (permission === "admin") {
    return process.env.E2E_USER_NAME!;
  } else {
    return USER_PERMISSION[permission];
  }
};

const getPasswordForPermission = (permission: UserPermission | "admin"): string => {
  if (permission === "admin") {
    return process.env.E2E_USER_PASSWORD!;
  } else {
    return process.env.E2E_PERMISSIONS_USERS_PASSWORD!;
  }
};
