import { BasicApiService } from "@api/basics";
import { USER_PERMISSION, UserPermission } from "@data/userPermissions";
import { request } from "@playwright/test";
import fs from "fs";
import path from "path";

export const getStorageState = async (permission: UserPermission | "admin"): Promise<string> => {
  const tempDir = path.join(__dirname, "../.auth");
  const storageStatePath = path.join(tempDir, `${permission}.json`);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  if (!fs.existsSync(storageStatePath)) {
    const apiRequestContext = await request.newContext({
      baseURL: process.env.BASE_URL!,
    });

    const basicApiService = new BasicApiService(apiRequestContext);

    const email = getEmailForPermission(permission);
    const password = getPasswordForPermission(permission);

    console.log("getStorageState login external api", permission);

    try {
      await basicApiService.logInUserViaApi({ email, password });
    } catch (error: unknown) {
      console.log("Err", error);

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

    fs.writeFileSync(storageStatePath, JSON.stringify(loginJsonInfo, null, 2));

    await apiRequestContext.dispose();
  }

  return storageStatePath;
};

export function extractTokenFromStateFile(filePath: string): string | undefined {
  try {
    const storageStateString = fs.readFileSync(filePath, "utf-8");
    const storageStateJson = JSON.parse(storageStateString);
    let token: string | undefined;

    const origins = storageStateJson.origins;
    // The token is stored under an origin matching process.env.BASE_URL by getStorageState/auth.setup.ts
    const targetOrigin = origins?.find(
      (o: { origin: string }) => o.origin === process.env.BASE_URL,
    );

    if (targetOrigin?.localStorage) {
      const refreshTokenEntry = targetOrigin.localStorage.find(
        (item: { name: string; value: string }) => item.name === "_saleorRefreshToken",
      );

      if (refreshTokenEntry?.value) {
        token = refreshTokenEntry.value;
      } else {
        console.warn(
          `[extractTokenFromStateFile] '_saleorRefreshToken' not found in localStorage for origin ${process.env.BASE_URL} in ${filePath}`,
        );
      }
    } else {
      console.warn(
        `[extractTokenFromStateFile] Origin ${process.env.BASE_URL} or its localStorage not found in ${filePath}`,
      );
    }

    return token;
  } catch (error) {
    console.error(
      `[extractTokenFromStateFile] Failed to read, parse, or extract token from ${filePath}:`,
      error instanceof Error ? error.message : String(error),
    );

    return undefined;
  }
}

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
