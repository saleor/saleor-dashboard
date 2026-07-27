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

interface CreatePermissionGroupOptions {
  name: string;
  permissionNames: string[];
  memberNames?: string[];
}

const createPermissionGroup = async ({
  name,
  permissionNames,
  memberNames = [],
}: CreatePermissionGroupOptions): Promise<void> => {
  await permissions.gotoPermissionGroupsView();
  await permissions.clickCreatePermissionGroupButton();
  await permissionDetails.fillPermissionGroupNameInput(name);

  for (const permissionName of permissionNames) {
    await permissionDetails.selectPermissionGroup(permissionName);
  }

  const createPermissionGroupUrl = permissionDetails.page.url();

  await Promise.all([
    permissionDetails.page.waitForURL(url => url.toString() !== createPermissionGroupUrl),
    permissionDetails.clickSaveButton(),
  ]);
  await permissions.successBanner.waitFor({
    state: "visible",
    timeout: 50000,
  });
  await expect(permissionDetails.permissionGroupNameInput).toHaveValue(name);

  if (memberNames.length === 0) {
    return;
  }

  await permissionDetails.clickAssignMembersButton();
  await assignmentDialog.searchForMembers("e2e_permission_group_member");

  for (const memberName of memberNames) {
    await assignmentDialog.selectMember(memberName);
  }

  await assignmentDialog.clickAssignButton();

  for (const memberName of memberNames) {
    await permissionDetails.assignedMemberName
      .filter({ hasText: memberName })
      .waitFor({ state: "visible", timeout: 30000 });
  }
};

test("TC: SALEOR_139 Should be able to navigate to permission groups page #permissions #e2e", async () => {
  await config.goToConfigurationView();
  await config.permissionGroupsButton.scrollIntoViewIfNeeded();
  await config.openPermissionGroups();
  await expect(permissions.permissionGroupsList).toBeVisible();
});
test("TC: SALEOR_133 Should be able to create new permission group #permissions #e2e", async () => {
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
    await expect(permissionDetails.permissionGroupCheckbox(permission)).toBeChecked();
  }
});
test("TC: SALEOR_134 Should be able to edit an existing permission group #permissions #e2e", async () => {
  const oldName = `e2e-permission-group-to-update-${faker.datatype.uuid()}`;
  const assignedPermissions = ["MANAGE_PRODUCTS", "MANAGE_PLUGINS", "MANAGE_STAFF"];

  await createPermissionGroup({
    name: oldName,
    permissionNames: assignedPermissions,
  });
  await expect(permissionDetails.permissionGroupNameInput).toHaveValue(oldName);
  await permissionDetails.permissionGroupNameInput.clear();

  const newName = `updated-e2e-permission-group-${faker.datatype.uuid()}`;

  await permissionDetails.fillPermissionGroupNameInput(newName);
  await permissionDetails.clickChannelPermissionsCheckbox();

  const permissionsToBeUnchecked = [assignedPermissions[0], assignedPermissions[1]];

  for (const permission of permissionsToBeUnchecked) {
    await permissionDetails.selectPermissionGroup(permission);
  }
  const newPermission = "HANDLE_CHECKOUTS";
  await permissionDetails.selectPermissionGroup(newPermission);
  await expect(permissionDetails.permissionGroupCheckbox(newPermission)).toBeChecked();

  await permissionDetails.clickSaveButton();
  await expect(permissions.successBanner).toBeVisible();

  await expect(permissionDetails.permissionGroupCheckbox("HANDLE_CHECKOUTS")).toBeChecked();
  await expect(permissionDetails.permissionGroupCheckbox(assignedPermissions[2])).toBeChecked();
  await expect(permissionDetails.permissionGroupCheckbox(assignedPermissions[0])).not.toBeChecked();
  await expect(permissionDetails.permissionGroupCheckbox(assignedPermissions[1])).not.toBeChecked();
});

test("TC: SALEOR_218 Should be able to edit members of existing permission group #permissions #e2e", async () => {
  const permissionGroupName = `e2e-permission-group-members-${faker.datatype.uuid()}`;
  const assignedMembers = PERMISSION_GROUPS.permissionGroupMembers.map(member => member.name);

  await createPermissionGroup({
    name: permissionGroupName,
    permissionNames: ["MANAGE_PRODUCTS"],
    memberNames: assignedMembers,
  });
  await permissionDetails.unassignSingleMember(assignedMembers[0]);
  await expect(permissionDetails.unassignMembersDialog).toBeVisible();

  await unassignDialog.clickConfirmUnassignButton();
  await expect(permissionDetails.assignedMemberName.first()).not.toContainText(assignedMembers[0]);
  await expect(permissionDetails.assignedMemberName.first()).toContainText(assignedMembers[1]);
  await expect(permissionDetails.assignedMemberName.last()).toContainText(assignedMembers[2]);
  await permissionDetails.clickSaveButton();
  await expect(permissions.successBanner).toBeVisible();
});
test("TC: SALEOR_135 Should be able to delete single permission group #permissions #e2e", async () => {
  const permissionGroupName = `e2e-permission-group-to-delete-${faker.datatype.uuid()}`;

  await createPermissionGroup({
    name: permissionGroupName,
    permissionNames: ["MANAGE_PRODUCTS"],
  });
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
  await expect(permissions.permissionGroupsList).not.toContainText(permissionGroupName);
});
