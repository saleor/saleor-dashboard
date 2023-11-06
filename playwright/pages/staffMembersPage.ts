import { MailpitService } from "@api/mailpit";
import { InviteStaffMembersDialog } from "@pages/dialogs/inviteStaffMemberDialog";
import type { APIRequestContext, Locator, Page } from "@playwright/test";

import { BasePage } from "./basePage";

export class StaffMembersPage {
  readonly page: Page;
  readonly request: APIRequestContext;
  readonly basePage: BasePage;
  readonly mailpitService: MailpitService;
  readonly inviteStaffMembersDialog: InviteStaffMembersDialog;
  readonly inviteStaffMembersButton: Locator;
  readonly saveButton: Locator;
  readonly permissionsGroupSelectButton: Locator;
  readonly permissionGroupOptions: Locator;
  readonly assignedPermissionGroups: Locator;
  readonly isActiveCheckbox: Locator;

  constructor(page: Page, request: APIRequestContext) {
    this.page = page;
    this.request = request;
    this.basePage = new BasePage(page);
    this.mailpitService = new MailpitService(request);
    this.inviteStaffMembersDialog = new InviteStaffMembersDialog(page);
    this.inviteStaffMembersButton = page.getByTestId("invite-staff-member");
    this.saveButton = page.getByTestId("button-bar-confirm");
    this.permissionsGroupSelectButton = page.getByTestId("permission-groups");
    this.permissionGroupOptions = page.getByTestId(
      "multi-autocomplete-select-option",
    );
    this.assignedPermissionGroups = page.getByTestId(
      "assigned-permission-group",
    );
    this.isActiveCheckbox = page
      .getByTestId("is-active-checkbox")
      .locator("input");
  }

  async clickIsActiveCheckbox() {
    await this.isActiveCheckbox.click();
  }
  async clickPermissionsGroupSelectButton() {
    await this.permissionsGroupSelectButton.click();
  }

  async assignUserToPermissionGroup(permissionGroupName: string) {
    await this.permissionGroupOptions
      .filter({ hasText: permissionGroupName })
      .click();
  }

  async clickInviteStaffMemberButton() {
    await this.inviteStaffMembersButton.click();
  }
  async clickSaveButton() {
    await this.saveButton.click();
  }
}
