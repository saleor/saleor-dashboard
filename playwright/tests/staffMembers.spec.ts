import { BasicApiService } from "@api/basics";
import { USERS } from "@data/e2eTestData";
import { ConfigurationPage } from "@pages/configurationPage";
import { PermissionGroupsPage } from "@pages/permissionGroupsPage";
import { StaffMembersPage } from "@pages/staffMembersPage";
import { expect } from "@playwright/test";
import faker from "faker";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

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

test("TC: SALEOR_211 Create a staff member @e2e @staff-members", async () => {
  const staffMember = {
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email().toLowerCase(),
    permissions: ["Customer Support", "Channels Management"],
  };

  await config.goToConfigurationView();
  await config.openStaffMembers();
  await staffMembersPage.clickInviteStaffMemberButton();
  await staffMembersPage.inviteStaffMembersDialog.typeNameLastNameAndEmail(
    staffMember.name,
    staffMember.lastName,
    staffMember.email,
  );
  await staffMembersPage.inviteStaffMembersDialog.clickSendInviteButton();
  await staffMembersPage.expectSuccessBanner();

  await expect(staffMembersPage.firstName).toHaveValue(staffMember.name);
  await expect(staffMembersPage.lastName).toHaveValue(staffMember.lastName);
  await expect(staffMembersPage.email).toHaveValue(staffMember.email);
  await expect(await staffMembersPage.isActiveCheckbox.isChecked()).toBeTruthy();

  await staffMembersPage.clickPermissionsGroupSelectButton();
  for (const permission of staffMember.permissions) {
    await staffMembersPage.assignUserToPermissionGroup(permission);
  }
  await staffMembersPage.clickSaveButton();
  await staffMembersPage.expectSuccessBanner();

  for (const permission of staffMember.permissions) {
    await staffMembersPage.verifyAssignedPermission(permission);
  }
});
test("TC: SALEOR_212 Edit a staff member @e2e @staff-members", async () => {
  const newName = faker.name.firstName();
  const newLastName = faker.name.lastName();
  const newEmail = faker.internet.email().toLowerCase();

  await staffMembersPage.gotToExistingStaffMemberPage(USERS.staffToBeEdited.id);
  await staffMembersPage.clickPermissionsGroupSelectButton();
  await staffMembersPage.assignUserToPermissionGroup("Customer Support");
  await staffMembersPage.assignUserToPermissionGroup("Channels Management");
  await staffMembersPage.clickSaveButton();
  await staffMembersPage.expectSuccessBanner();
  await staffMembersPage.updateStaffInfo(newName, newLastName, newEmail);
  await expect(staffMembersPage.firstName).toHaveValue(newName);
  await expect(staffMembersPage.lastName).toHaveValue(newLastName);
  await expect(staffMembersPage.email).toHaveValue(newEmail);
  await staffMembersPage.verifyAssignedPermission("Customer Support");
  await staffMembersPage.verifyAssignedPermission("Channels Management");
  await staffMembersPage.verifyAssignedPermission(USERS.staffToBeEdited.permission);
});
test("TC: SALEOR_213 Delete a single staff member @e2e @staff-members", async () => {
  await staffMembersPage.gotToExistingStaffMemberPage(USERS.staffToBeDeleted.id);
  await staffMembersPage.clickDeleteButton();
  await staffMembersPage.clickSubmitButton();
  await staffMembersPage.expectSuccessBanner();
  await staffMembersPage.typeInSearchOnListView(USERS.staffToBeDeleted.name);
  await expect(staffMembersPage.emptyDataGridListView).toBeVisible();
});
