import { URL_LIST } from "@data/url";
import { ConfigurationPage } from "@pages/configurationPage";
import { StaffMembersPage } from "@pages/staffMembersPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });

test("TC: SALEOR_35 User should be able to invite staff member with full access permissions @basic-regression @staff-members", async ({
  page,
  request,
}) => {
  const configurationPage = new ConfigurationPage(page);
  const staffMembersPage = new StaffMembersPage(page, request);
  const userEmail = `francesca${await staffMembersPage.basePage.getRandomInt(
    1000000,
  )}@gmail.com`;

  await page.goto(URL_LIST.configuration);
  await configurationPage.openStaffMembers();

  await staffMembersPage.clickInviteStaffMemberButton();
  await staffMembersPage.inviteStaffMembersDialog.typeNameLastNameAndEmail(
    "Francesca",
    "Leek",
    userEmail,
  );
  await staffMembersPage.inviteStaffMembersDialog.clickSendInviteButton();

  await staffMembersPage.clickPermissionsGroupSelectButton();
  await staffMembersPage.assignUserToPermissionGroup("Full Access");
  await staffMembersPage.clickSaveButton();
  await staffMembersPage.basePage.expectSuccessBanner();
  expect(await staffMembersPage.assignedPermissionGroups.count()).toEqual(1);
  expect(staffMembersPage.assignedPermissionGroups).toContainText(
    "Full Access",
  );

  const singleUserEmails =
    await staffMembersPage.mailpitService.getEmailsForUser(userEmail);

  await expect(singleUserEmails[0].Subject).toContain(
    "Set Your Dashboard Password",
  );
});
