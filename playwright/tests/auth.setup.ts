import { BasicApiService } from "@api/basics";
import { permissions, USER_PERMISSION, UserPermissionType } from "@data/userPermissions";
import { APIRequestContext, test as setup } from "@playwright/test";
import fs from "fs";
import path from "path";

setup.describe.configure({ mode: "serial" });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const authenticateAndSaveState = async (
  request: APIRequestContext,
  email: string,
  password: string,
  filePath: string,
) => {
  const basicApiService = new BasicApiService(request);
  let retries = 0;
  const maxRetries = 3;
  const delayBetweenRetries = 3000;

  while (retries < maxRetries) {
    try {
      const loginResponse = await basicApiService.logInUserViaApi({ email, password });

      if (loginResponse.data.tokenCreate?.errors?.length > 0) {
        loginResponse.data.tokenCreate.errors.forEach(error => {
          console.error(`Login error (code: ${error.code}): ${error.message}`);
        });
      } else {
        const loginJsonInfo = await request.storageState();

        if (loginJsonInfo.cookies?.[0]) {
          loginJsonInfo.origins.push({
            origin: process.env.BASE_URL!,
            localStorage: [
              {
                name: "_saleorRefreshToken",
                value: loginJsonInfo.cookies[0].value,
              },
            ],
          });
          fs.writeFileSync(filePath, JSON.stringify(loginJsonInfo, null, 2));

          return;
        } else {
          console.warn("No valid cookies found in the storage state.");
        }
      }
    } catch (error) {
      console.error(
        `An error occurred during authentication: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    retries += 1;
    console.warn(`Authentication failed, retrying ${retries}/${maxRetries}...`);

    if (retries < maxRetries) {
      await sleep(delayBetweenRetries);
    }
  }

  throw new Error("Failed to authenticate after 3 attempts");
};

const authSetup = async (
  request: APIRequestContext,
  email: string,
  password: string,
  fileName: string,
) => {
  const tempDir = path.join(__dirname, "../.auth");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const tempFilePath = path.join(tempDir, fileName);

  if (!fs.existsSync(tempFilePath)) {
    await authenticateAndSaveState(request, email, password, tempFilePath);
  }
};

setup("Authenticate as admin via API", async ({ request }) => {
  await authSetup(
    request,
    process.env.E2E_USER_NAME!,
    process.env.E2E_USER_PASSWORD!,
    "admin.json",
  );
});

const user: UserPermissionType = USER_PERMISSION;
const password: string = process.env.E2E_PERMISSIONS_USERS_PASSWORD!;

for (const permission of permissions) {
  setup(`Authenticate as ${permission} user via API`, async ({ request }) => {
    await authSetup(request, user[permission], password, `${permission}.json`);
  });
}
