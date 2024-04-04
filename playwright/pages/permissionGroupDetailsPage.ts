import type { Page } from "@playwright/test";
import {BasePage} from "./basePage";
import {DeletePermissionGroupDialog} from "./dialogs/deletePermissionGroupDialog";
import { AssignPermissionGroupMembersDialog } from "./dialogs/assignPermissionGroupMembersDialog";
import { UnassignPermissionGroupMembersDialog } from "./dialogs/unassignPermissionGroupMembersDialog";

export class PermissionGroupDetailsPage extends BasePage {
  readonly assignPermissionGroupMemberDialog: AssignPermissionGroupMembersDialog;
  readonly unassignPermissionGroupMemberDialog: UnassignPermissionGroupMembersDialog;
  readonly deletePermissionGroupDialog: DeletePermissionGroupDialog;

  constructor(
    page: Page,
    readonly pageTitle = page.getByTestId(
      "page-header",
    ).filter({hasText:"New Permission Group"}),
    readonly permissionGroupNameInput = page.getByTestId("permission-group-name-input").locator('input'),
    readonly channelPermissionsCheckbox = page.getByTestId("all-channel-permissions-checkbox"),
    readonly permissionGroupListItem = page.getByTestId("permission-group-list-item"),
    readonly assignMembersButton = page.getByTestId("assign-members"),
    readonly assignedMembersTable = page.getByTestId("assigned-members-table"),
    readonly assignedMemberRow = page.getByTestId("assigned-member-row"),
    readonly removeMemberButton = page.getByTestId("remove-user"),
    readonly unassignMembersButton = page.getByTestId("unassign-members-button"),
    readonly membersSection = page.getByTestId( "permission-group-members-section"),
    readonly unassignMembersDialog = page.getByRole("dialog").filter({hasText:"Unassign users"}),
    readonly permissionGroupList = page.getByTestId("permission-group-list"),
    readonly assignedMemberName = page.getByTestId("member-name"),
    readonly permissionGroupCheckbox = page.getByTestId("permission-group-checkbox").locator("input"),
  ) {
    super(page)
    this.assignPermissionGroupMemberDialog = new AssignPermissionGroupMembersDialog(page);
    this.unassignPermissionGroupMemberDialog = new UnassignPermissionGroupMembersDialog(page);
    this.deletePermissionGroupDialog = new DeletePermissionGroupDialog(page);
  }
  async fillPermissionGroupNameInput(name: string) {
    await this.permissionGroupNameInput.fill(name);
  }
  async clickChannelPermissionsCheckbox() {
    await this.channelPermissionsCheckbox.click();
  }
  async selectPermissionGroup(permission: string) {
    await this.permissionGroupListItem.filter({hasText:permission}).first().click();
  }
  async clickAssignMembersButton() {
    await this.assignMembersButton.click();
  }
  async selectAssignedMember(member: string) {
    await this.assignedMemberRow.filter({hasText:member}).locator('input').click();
  }
async unassignSingleMember(member: string) {
    await this.assignedMemberRow.filter({hasText:member}).locator(this.removeMemberButton).click();
  }
  async clickSaveButton(){
    await this.saveButton.click();
  }
  async clickDeleteButton(){
    await this.deleteButton.click();
  }
  async selectAllMembers() {
    await this.membersSection.getByTestId("checkbox").first().click();
  }
  async clickUnassignMembersButton() {
    await this.unassignMembersButton.click();
  }
}
