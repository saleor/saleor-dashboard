import { PERMISSION_GROUPS } from "@data/e2eTestData";
import { ConfigurationPage } from "@pages/configurationPage";
import { AssignPermissionGroupMembersDialog } from "@pages/dialogs/assignPermissionGroupMembersDialog";
import { UnassignPermissionGroupMembersDialog } from "@pages/dialogs/unassignPermissionGroupMembersDialog";
import { PermissionGroupDetailsPage } from "@pages/permissionGroupDetailsPage";
import { PermissionGroupsPage } from "@pages/permissionGroupsPage";
import { expect } from "@playwright/test";
import faker from "faker";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let permissions: PermissionGroupsPage;
let permissionDetails: PermissionGroupDetailsPage;
let config: ConfigurationPage;
let assignmentDialog: AssignPermissionGroupMembersDialog;
let unassignDialog: UnassignPermissionGroupMembersDialog;

test.beforeEach(({ page }) => {
  permissions = new PermissionGroupsPage(page);
  permissionDetails = new PermissionGroupDetailsPage(page);
  config = new ConfigurationPage(page);
  assignmentDialog = new AssignPermissionGroupMembersDialog(page);
  unassignDialog = new UnassignPermissionGroupMembersDialog(page);
});
test("TC: SALEOR_139 Should be able to navigate to permission groups page @permissions @e2e", async () => {
  await config.goToConfigurationView();
  await config.permissionGroupsButton.scrollIntoViewIfNeeded();
  await config.openPermissionGroups();
  await expect(permissions.permissionGroupsList).toBeVisible();
});
test("TC: SALEOR_133 Should be able to create new permission group @permissions @e2e", async () => {
  await permissions.gotoPermissionGroupsView();
  await permissions.clickCreatePermissionGroupButton();

  const name = faker.random.words(2);

  await permissionDetails.fillPermissionGroupNameInput(name);

  const selectedPermissions = [
    "MANAGE_PRODUCTS",
    "MANAGE_USERS",
    "MANAGE_STAFF",
    "MANAGE_APPS",
    "MANAGE_DISCOUNTS",
    "MANAGE_PLUGINS",
  ];

  for (const permission of selectedPermissions) {
    await permissionDetails.selectPermissionGroup(permission);
  }
  await permissionDetails.clickChannelPermissionsCheckbox();
  await permissionDetails.clickSaveButton();
  await permissions.successBanner.waitFor({
    state: "visible",
    timeout: 50000,
  });
  await permissionDetails.clickAssignMembersButton();

  const members = PERMISSION_GROUPS.permissionGroupMembers;

  await assignmentDialog.searchForMembers("e2e_permission_group_member");
  for (const member of members) {
    await assignmentDialog.selectMember(member.name);
  }
  await assignmentDialog.clickAssignButton();
  await expect(permissionDetails.permissionGroupNameInput).toHaveValue(name);
  await expect(permissionDetails.channelPermissionsCheckbox).not.toBeChecked();
  for (const member of members) {
    await permissionDetails.assignedMemberName
      .filter({ hasText: member.name })
      .waitFor({ state: "visible", timeout: 30000 });
  }
  for (const permission of selectedPermissions) {
    await expect(
      permissionDetails.permissionGroupListItem
        .filter({ hasText: permission })
        .locator(permissionDetails.permissionGroupCheckbox),
    ).toBeChecked();
  }
});
test("TC: SALEOR_134 Should be able to edit existing permission group @permissions @e2e", async () => {
  await permissions.gotoPermissionGroupsView();

  const permission = PERMISSION_GROUPS.permissionGroupToBeEdited;

  await permissions.gotoExistingPermissionGroupPage(permission.id);
  await permissionDetails.permissionGroupList.waitFor({
    state: "visible",
    timeout: 30000,
  });

  const oldName = permission.name;

  await expect(permissionDetails.permissionGroupNameInput).toHaveValue(oldName);
  await permissionDetails.permissionGroupNameInput.clear();

  const newName = faker.random.words(2);

  await permissionDetails.fillPermissionGroupNameInput(newName);
  await permissionDetails.clickChannelPermissionsCheckbox();

  const assignedPermissions = PERMISSION_GROUPS.permissionGroupToBeEdited.assignedPermissions;
  const permissionsToBeUnchecked = [assignedPermissions.names[0], assignedPermissions.names[1]];

  for (const permission of permissionsToBeUnchecked) {
    await permissionDetails.selectPermissionGroup(permission);
  }
  await expect(
    permissionDetails.permissionGroupListItem
      .filter({ hasText: assignedPermissions.names[2] })
      .locator(permissionDetails.permissionGroupCheckbox),
  ).toBeChecked();
  await expect(
    permissionDetails.permissionGroupListItem
      .filter({ hasText: assignedPermissions.names[0] })
      .locator(permissionDetails.permissionGroupCheckbox),
  ).not.toBeChecked();
  await expect(
    permissionDetails.permissionGroupListItem
      .filter({ hasText: assignedPermissions.names[1] })
      .locator(permissionDetails.permissionGroupCheckbox),
  ).not.toBeChecked();
  await permissionDetails.selectPermissionGroup("HANDLE_CHECKOUTS");
  await expect(
    permissionDetails.permissionGroupListItem
      .filter({
        hasText: "HANDLE_CHECKOUTS",
      })
      .locator(permissionDetails.permissionGroupCheckbox),
  ).toBeChecked();

  const assignedMembers = PERMISSION_GROUPS.permissionGroupToBeEdited.assignedMembers;

  await permissionDetails.unassignSingleMember(assignedMembers.names[0]);
  await permissionDetails.unassignMembersDialog.waitFor({
    state: "visible",
    timeout: 50000,
  });
  await unassignDialog.clickConfirmUnassignButton();
  for (const name of await permissionDetails.assignedMemberName.all()) {
    await expect(name).not.toContainText(assignedMembers.names[0]);
  }
  await expect(permissionDetails.assignedMemberName.first()).toContainText(
    assignedMembers.names[1],
  );
  await expect(permissionDetails.assignedMemberName.last()).toContainText(assignedMembers.names[2]);
  await permissionDetails.membersSection
    .getByTestId("select-all-checkbox")
    .locator("input")
    .click();
  await permissionDetails.clickUnassignMembersButton();
  await permissionDetails.unassignMembersDialog.waitFor({
    state: "visible",
    timeout: 30000,
  });
  await unassignDialog.clickConfirmUnassignButton();
  await expect(permissionDetails.assignedMembersTable).not.toBeAttached();
  await permissionDetails.clickSaveButton();
  await permissions.successBanner.waitFor({
    state: "visible",
    timeout: 50000,
  });
});
test("TC: SALEOR_135 Should be able to delete single permission group @permissions @e2e", async () => {
  await permissions.gotoPermissionGroupsView();

  const permission = PERMISSION_GROUPS.permissionGroupToBeDeleted;

  await permissions.gotoExistingPermissionGroupPage(permission.id);
  await permissionDetails.permissionGroupList.waitFor({
    state: "visible",
    timeout: 30000,
  });
  await expect(permissionDetails.permissionGroupNameInput).toHaveValue(permission.name);
  await permissionDetails.clickDeleteButton();
  await permissionDetails.deletePermissionGroupDialog.deleteDialog.waitFor({
    state: "visible",
    timeout: 10000,
  });
  await permissionDetails.deletePermissionGroupDialog.clickConfirmDeleteButton();
  await permissions.successBanner.waitFor({
    state: "visible",
    timeout: 50000,
  });
  await permissions.waitForGrid();
  await permissions.clickNumbersOfRowsButton();
  await permissions.clickPaginationRowNumberOption("100");
  await expect(permissions.permissionGroupsList).not.toHaveText(permission.name);
});
