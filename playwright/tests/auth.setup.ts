import { BasicApiService } from "@api/basics";
import { permissions, USER_PERMISSION, UserPermissionType } from "@data/userPermissions";
import { APIRequestContext, test as setup } from "@playwright/test";
import fs from "fs";
import path from "path";

setup.describe.configure({ mode: "serial" });

const removeAuthFolder = () => {
  const authDir = path.join(__dirname, "../.auth");

  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true });
    console.log(".auth folder removed");
  }
};

setup.beforeAll(() => {
  removeAuthFolder();
});

const authenticateAndSaveState = async (
  request: APIRequestContext,
  email: string,
  password: string,
  filePath: string,
) => {
  const basicApiService = new BasicApiService(request);

  const loginResponse = await basicApiService.logInUserViaApi({ email, password });

  const loginJsonInfo = await request.storageState();

  loginJsonInfo.origins = [
    {
      origin: process.env.BASE_URL!,
      localStorage: [
        {
          name: "_saleorRefreshToken",
          value: loginResponse.data.tokenCreate.refreshToken,
        },
      ],
    },
  ];

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

setup("Authenticate as admin via API", async ({ request }) => {
  await authSetup(
    request,
    process.env.E2E_USER_NAME!,
    process.env.E2E_USER_PASSWORD!,
    "admin.json",
  );
});

setup("Authenticate permission users via API", async ({ request }) => {
  for (const permission of permissions) {
    const email = USER_PERMISSION[permission];
    const password = process.env.E2E_PERMISSIONS_USERS_PASSWORD!;
    const fileName = `${permission}.json`;

    await authSetup(request, email, password, fileName);
  }
});
