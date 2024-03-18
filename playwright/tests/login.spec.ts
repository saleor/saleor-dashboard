import { LoginPage } from "@pages/loginPage";
import { test } from "@playwright/test";
import { UserPermissionType, USER_PERMISSION, permissions } from "@data/userPermissions";

let login: LoginPage;

test.beforeEach(({ page }) => {
  login = new LoginPage(page);
});

test("TC: SALEOR_39 Login as admin", async () => {
  await login.loginViaUI(
    process.env.E2E_USER_NAME!,
    process.env.E2E_USER_PASSWORD!,
  );
});

const user: UserPermissionType = USER_PERMISSION;
const password: string = process.env.E2E_PERMISSIONS_USERS_PASSWORD!;

for (const permission of permissions) {
  test(`TC: SALEOR_41 Login as user with ${permission} permissions`, async () => {
    await login.loginViaUI(user[permission], password);
  });
}
