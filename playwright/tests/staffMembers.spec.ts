import { BasicApiService } from "@api/basics";
import { USERS } from "@data/e2eTestData";
import { ConfigurationPage } from "@pages/configurationPage";
import { PermissionGroupsPage } from "@pages/permissionGroupsPage";
import { StaffMembersPage } from "@pages/staffMembersPage";
import { expect } from "@playwright/test";
import faker from "faker";
import { testWithPermission } from "utils/testWithPermission";

const test = testWithPermission("admin");

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
  const name = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email().toLowerCase();

  await config.goToConfigurationView();
  await config.openStaffMembers();
  await staffMembersPage.clickInviteStaffMemberButton();
  await staffMembersPage.inviteStaffMembersDialog.typeNameLastNameAndEmail(name, lastName, email);
  await staffMembersPage.inviteStaffMembersDialog.clickSendInviteButton();
  await staffMembersPage.expectSuccessBanner();
  await expect(staffMembersPage.firstName).toHaveValue(name);
  await expect(staffMembersPage.lastName).toHaveValue(lastName);
  await expect(staffMembersPage.email).toHaveValue(email);
  await expect(await staffMembersPage.isActiveCheckbox.isChecked()).toEqual(true);
  await staffMembersPage.clickPermissionsGroupSelectButton();
  await staffMembersPage.assignUserToPermissionGroup("Customer Support");
  await staffMembersPage.assignUserToPermissionGroup("Channels management");
  await staffMembersPage.clickSaveButton();
  await staffMembersPage.expectSuccessBanner();
  await staffMembersPage.verifyAssignedPermission("Customer Support");
  await staffMembersPage.verifyAssignedPermission("Channels management");
});

test("TC: SALEOR_212 Edit a staff member @e2e @staff-members", async () => {
  const newName = faker.name.firstName();
  const newLastName = faker.name.lastName();
  const newEmail = faker.internet.email().toLowerCase();

  await staffMembersPage.gotToExistingStaffMemberPage(USERS.staffToBeEdited.id);
  await staffMembersPage.clickPermissionsGroupSelectButton();
  await staffMembersPage.assignUserToPermissionGroup("Customer Support");
  await staffMembersPage.assignUserToPermissionGroup("Channels management");
  await staffMembersPage.clickSaveButton();
  await staffMembersPage.expectSuccessBanner();
  await staffMembersPage.updateStaffInfo(newName, newLastName, newEmail);
  await expect(staffMembersPage.firstName).toHaveValue(newName);
  await expect(staffMembersPage.lastName).toHaveValue(newLastName);
  await expect(staffMembersPage.email).toHaveValue(newEmail);
  await staffMembersPage.verifyAssignedPermission("Customer Support");
  await staffMembersPage.verifyAssignedPermission("Channels management");
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

test("TC: SALEOR_137 Admin User should be able to deactivate other user @e2e @staff-members", async () => {
  await staffMembersPage.goToStaffDetailsPage(USERS.userToBeDeactivated.id);
  await staffMembersPage.clickIsActiveCheckbox();
  await staffMembersPage.clickSaveButton();
  await staffMembersPage.basePage.expectSuccessBanner();
  await expect(await staffMembersPage.isActiveCheckbox.isChecked()).toEqual(false);

  const loginViaApiDeactivatedUserResponse = await basicApiService.logInUserViaApi({
    email: USERS.userToBeDeactivated.email,
    password: process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
  });

  await expect(loginViaApiDeactivatedUserResponse.data.tokenCreate.errors[0].code).toEqual(
    "INACTIVE",
  );
});

test("TC: SALEOR_38 Admin User should be able to activate other user @e2e @staff-members", async () => {
  await staffMembersPage.goToStaffDetailsPage(USERS.userToBeActivated.id);
  await staffMembersPage.clickIsActiveCheckbox();
  await staffMembersPage.clickSaveButton();
  await staffMembersPage.basePage.expectSuccessBanner();
  await expect(await staffMembersPage.isActiveCheckbox.isChecked()).toEqual(true);

  const loginViaApiDeactivatedUserResponse = await basicApiService.logInUserViaApi({
    email: USERS.userToBeActivated.email,
    password: process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
  });

  await expect(loginViaApiDeactivatedUserResponse.data.tokenCreate.errors).toEqual([]);
  await expect(loginViaApiDeactivatedUserResponse.data.tokenCreate.token).not.toEqual(null);
});
