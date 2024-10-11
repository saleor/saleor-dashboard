import { ConfigurationPage } from "@pages/configurationPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { PermissionGroupsPage } from "@pages/permissionGroupsPage";
import { StaffMembersPage } from "@pages/staffMembersPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "staff" });

let staffMembersPage: StaffMembersPage;
let mainMenuPage: MainMenuPage;
let configurationPage: ConfigurationPage;
let permissionGroupsPage: PermissionGroupsPage;

test.beforeEach(async ({ page, request }) => {
  staffMembersPage = new StaffMembersPage(page, request);
  mainMenuPage = new MainMenuPage(page);
  configurationPage = new ConfigurationPage(page);
  permissionGroupsPage = new PermissionGroupsPage(page);
  await configurationPage.goToConfigurationView();
  await configurationPage.waitForDOMToFullyLoad();
});
test("TC: SALEOR_19 User should be able to navigate to staff members list page as a staff member using STAFF permission @e2e", async () => {
  await configurationPage.openStaffMembers();
  await expect(staffMembersPage.inviteStaffMembersButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(3);
  await staffMembersPage.expectGridToBeAttached();
});
test("TC: SALEOR_20 User should be able to navigate to permission group list page as a staff member using STAFF permission @e2e", async () => {
  await configurationPage.openPermissionGroups();
  await expect(permissionGroupsPage.createPermissionGroupButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(3);
  await permissionGroupsPage.expectGridToBeAttached();
});
