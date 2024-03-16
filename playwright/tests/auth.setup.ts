import { test as setup } from "@playwright/test";
import { BasicApiService } from "@api/basics";
import fs from 'fs';
import path from 'path';
import { UserPermissionType, USER_PERMISSION, permissions } from "@data/userPermissions";


const getTemplate = (refreshToken: string) =>  {
  const currentDate = new Date();
currentDate.setFullYear(currentDate.getFullYear() + 1);
 const expires = Math.floor(currentDate.getTime() / 1000);

  return {
  "cookies": [
    {
      "name": "refreshToken",
      "value": refreshToken,
      "domain": process.env.API_URI!,
      "path": "/",
      expires,
      "httpOnly": true,
      "secure": true,
      "sameSite": "None"
    }
  ],
  "origins": [
    {
      "origin": process.env.BASE_URL!,
      "localStorage": [
        {
          "name": "requestedExternalPluginId",
          "value": "null"
        },
        {
          "name": "notifiedAboutNavigator",
          "value": "true"
        },
        {
          "name": "_saleorRefreshToken",
          "value": refreshToken
        },
        {
          "name": "channel",
          "value": "Q2hhbm5lbDoyMjQz"
        },
        {
          "name": "externalLoginFallbackUri",
          "value": "null"
        },
        {
          "name": "macaw-ui-theme",
          "value": "light"
        }
      ]
    }
  ]
}}

setup("Authenticate as admin via API", async ({ request }) => {
    const basicApiService = new BasicApiService(request);

    const response = await basicApiService.logInUserViaApi({
        email: process.env.E2E_USER_NAME!,
        password: process.env.E2E_USER_PASSWORD!
    });

    const tempDir = path.join(__dirname, '../.auth');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempFilePath = path.join(tempDir, 'admin.json');

    fs.writeFileSync(tempFilePath, JSON.stringify(getTemplate(response.data.tokenCreate.refreshToken), null, 2));
});

const user: UserPermissionType = USER_PERMISSION;
const password: string = process.env.E2E_PERMISSIONS_USERS_PASSWORD!;
for (const permission of permissions) {
setup(`Authenticate as ${permission} user via API`, async ({ request }) => {
    const basicApiService = new BasicApiService(request);

    const response = await basicApiService.logInUserViaApi({
        email: user[permission],
        password: password
    });

    const tempDir = path.join(__dirname, '../.auth');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempFilePath = path.join(tempDir, `${permission}.json`);

    fs.writeFileSync(tempFilePath, JSON.stringify(getTemplate(response.data.tokenCreate.refreshToken), null, 2));
})}
