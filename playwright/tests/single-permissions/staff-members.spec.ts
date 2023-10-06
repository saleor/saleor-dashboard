import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/base-page";
import { ConfigurationPage } from "@pages/configuration-page";
import { MainMenuPage } from "@pages/main-menu-page";
import { PermissionGroupsPage } from "@pages/permission-groups-page";
import { StaffMembersPage } from "@pages/staff-members-page";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/staff-member.json" });

test("TC: SALEOR_19 User should be able to navigate to staff members list page as a staff member using STAFF permission", async ({
  page,
}) => {
  const mainMenuPage = new MainMenuPage(page);
  const basePage = new BasePage(page);
  const configurationPage = new ConfigurationPage(page);
  const staffMembersPage = new StaffMembersPage(page);

  await page.goto(URL_LIST.configuration);
  await configurationPage.openStaffMembers();
  await expect(staffMembersPage.inviteStaffMembersButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(2);
  await basePage.expectGridToBeAttached();
});

test("TC: SALEOR_20 User should be able to navigate to permission group list page as a staff member using STAFF permission", async ({
  page,
}) => {
  const mainMenuPage = new MainMenuPage(page);
  const basePage = new BasePage(page);
  const configurationPage = new ConfigurationPage(page);
  const permissionGroupsPage = new PermissionGroupsPage(page);

  await page.goto(URL_LIST.configuration);
  await configurationPage.openPermissionGroups();
  await expect(permissionGroupsPage.createPermissionGroupButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(2);
  await basePage.expectGridToBeAttached();
});
