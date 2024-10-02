import { BasicApiService } from "@api/basics";
import { USER_PERMISSION, UserPermission } from "@data/userPermissions";
import { request } from "@playwright/test";
import fs from "fs";
import path from "path";

const CHECK_INTERVAL = 100;
const TIMEOUT = 30000;

interface StorageStateOptions {
  permission: UserPermission | "admin";
  workerIndex: number;
}

export const getStorageState = async (options: StorageStateOptions): Promise<string> => {
  const { permission } = options;
  const tempDir = path.join(__dirname, "../.auth");
  const storageStatePath = path.join(tempDir, `${permission}.json`);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  if (!fs.existsSync(storageStatePath)) {
    await createAndFillStorageStateFile(storageStatePath, options);

    return storageStatePath;
  } else {
    const filled = await waitForFileToBeFilled(storageStatePath, options);

    if (filled) {
      return storageStatePath;
    } else {
      throw new Error(`Failed to fill storage state file for permission ${permission}`);
    }
  }
};

const waitForFileToBeFilled = async (
  storageStatePath: string,
  options: StorageStateOptions,
): Promise<boolean> => {
  const { permission, workerIndex } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < TIMEOUT) {
    try {
      const fileContent = fs.readFileSync(storageStatePath, "utf-8");

      if (fileContent.trim() !== "") {
        JSON.parse(fileContent);
        log(`Detected filled and valid storage state file`, options);

        return true;
      }
    } catch (error) {
      log(`Detected malformed storage state file, continuing to wait...`, options, true);
    }

    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }

  log(`Timeout waiting for storage state file.`, options, true);

  return false;
};

const createAndFillStorageStateFile = async (
  storageStatePath: string,
  options: StorageStateOptions,
): Promise<void> => {
  const { permission, workerIndex } = options;

  log(`Creating empty storage state file`, options);
  fs.writeFileSync(storageStatePath, "");

  const apiRequestContext = await request.newContext({
    baseURL: process.env.BASE_URL!,
  });

  const basicApiService = new BasicApiService({
    request: apiRequestContext,
    workerIndex,
  });
  const email = getEmailForPermission(permission);
  const password = getPasswordForPermission(permission);

  log(`Proceeding to fill storage state file`, options);

  try {
    await basicApiService.logInUserViaApi({ email, password });
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      const message = `An unknown error occurred while logging in the user via API`;

      log(message, options, true);
      throw new Error(message);
    }

    const message = `logInUserViaApi failed for ${email}: ${error.message}`;

    log(message, options, true);
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

  log(`Filled storage state file`, options);
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

const log = (message: string, options: StorageStateOptions, isError = false): void => {
  const { permission, workerIndex } = options;
  const logMessage = `[getStorageState][Permission ${permission}][Worker ${workerIndex}] ${message} at: ${new Date().toISOString()}`;

  if (isError) {
    console.error(logMessage);
  } else {
    console.log(logMessage);
  }
};
