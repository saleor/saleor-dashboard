import { BasicApiService } from "@api/basics";
import { permissions, USER_PERMISSION, UserPermissionType } from "@data/userPermissions";
import { APIRequestContext, test as setup } from "@playwright/test";
import fs from "fs";
import path from "path";

const authenticateAndSaveState = async (
  request: APIRequestContext,
  email: string,
  password: string,
  filePath: string,
) => {
  const basicApiService = new BasicApiService(request);

  await basicApiService.logInUserViaApi({ email, password });

  const loginJsonInfo = await request.storageState();

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

setup.describe(() => {
  setup.describe.configure({ mode: "serial" });

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
});
