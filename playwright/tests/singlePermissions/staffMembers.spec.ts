import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { ConfigurationPage } from "@pages/configurationPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { PermissionGroupsPage } from "@pages/permissionGroupsPage";
import { StaffMembersPage } from "@pages/staffMembersPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/staff.json" });

test("TC: SALEOR_19 User should be able to navigate to staff members list page as a staff member using STAFF permission @e2e", async ({
  page,
  request,
}) => {
  const mainMenuPage = new MainMenuPage(page);
  const basePage = new BasePage(page);
  const configurationPage = new ConfigurationPage(page);
  const staffMembersPage = new StaffMembersPage(page, request);

  await page.goto(URL_LIST.configuration);
  await configurationPage.openStaffMembers();
  await expect(staffMembersPage.inviteStaffMembersButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(3);
  await basePage.expectGridToBeAttached();
});

test("TC: SALEOR_20 User should be able to navigate to permission group list page as a staff member using STAFF permission @e2e", async ({
  page,
}) => {
  const mainMenuPage = new MainMenuPage(page);
  const basePage = new BasePage(page);
  const configurationPage = new ConfigurationPage(page);
  const permissionGroupsPage = new PermissionGroupsPage(page);

  await page.goto(URL_LIST.configuration);
  await configurationPage.openPermissionGroups();
  await expect(permissionGroupsPage.createPermissionGroupButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(3);
  await basePage.expectGridToBeAttached();
});
