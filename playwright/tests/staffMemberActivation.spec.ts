import { BasicApiService } from "@api/basics";
import { USERS } from "@data/e2eTestData";
import { ConfigurationPage } from "@pages/configurationPage";
import { PermissionGroupsPage } from "@pages/permissionGroupsPage";
import { StaffMembersPage } from "@pages/staffMembersPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "./playwright/.auth/admin.json" });
test.describe.configure({ mode: "serial" });

let staffMembersPage: StaffMembersPage;
let config: ConfigurationPage;
let permissionGroupsPage: PermissionGroupsPage;
let basicApiService: BasicApiService;

test.beforeEach(async ({ page, request }) => {
  staffMembersPage = new StaffMembersPage(page, request);
  config = new ConfigurationPage(page);
  permissionGroupsPage = new PermissionGroupsPage(page);
  basicApiService = new BasicApiService(request);
});
test("TC: SALEOR_137 Admin User should be able to deactivate other user @e2e @staff-members", async () => {
  await staffMembersPage.goToStaffDetailsPage(USERS.userToBeDeactivated.id);
  await staffMembersPage.clickIsActiveCheckbox();
  await staffMembersPage.clickSaveButton();
  await staffMembersPage.basePage.expectSuccessBanner();
  expect(await staffMembersPage.isActiveCheckbox.isChecked()).toEqual(false);

  const loginViaApiDeactivatedUserResponse = await basicApiService.logInUserViaApi({
    email: USERS.userToBeDeactivated.email,
    password: process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
  });

  expect(loginViaApiDeactivatedUserResponse.data.tokenCreate.errors[0].code).toEqual("INACTIVE");
});
test("TC: SALEOR_38 Admin User should be able to activate other user @e2e @staff-members", async () => {
  await staffMembersPage.goToStaffDetailsPage(USERS.userToBeActivated.id);
  await staffMembersPage.clickIsActiveCheckbox();
  await staffMembersPage.clickSaveButton();
  await staffMembersPage.basePage.expectSuccessBanner();
  expect(await staffMembersPage.isActiveCheckbox.isChecked()).toEqual(true);

  const loginViaApiDeactivatedUserResponse = await basicApiService.logInUserViaApi({
    email: USERS.userToBeActivated.email,
    password: process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
  });

  expect(loginViaApiDeactivatedUserResponse.data.tokenCreate.errors).toEqual([]);
  expect(loginViaApiDeactivatedUserResponse.data.tokenCreate.token).not.toEqual(null);
});
