import { MailpitService } from "@api/mailpit";
import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { InviteStaffMembersDialog } from "@pages/dialogs/inviteStaffMemberDialog";
import type { APIRequestContext, Page } from "@playwright/test";

export class StaffMembersPage extends BasePage {
  readonly request: APIRequestContext;
  readonly basePage: BasePage;
  readonly mailpitService: MailpitService;
  readonly inviteStaffMembersDialog: InviteStaffMembersDialog;

  constructor(
    page: Page,
    request: APIRequestContext,
    readonly inviteStaffMembersButton = page.getByTestId("invite-staff-member"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly permissionsGroupSelectButton = page.getByTestId(
      "permission-groups",
    ),
    readonly permissionGroupOptions = page.getByTestId(
      "multi-autocomplete-select-option",
    ),
    readonly assignedPermissionGroups = page.getByTestId(
      "assigned-permission-group",
    ),
    readonly isActiveCheckbox = page
      .getByTestId("is-active-checkbox")
      .locator("input"),
  ) {
    super(page);
    this.request = request;
    this.basePage = new BasePage(page);
    this.mailpitService = new MailpitService(request);
    this.inviteStaffMembersDialog = new InviteStaffMembersDialog(page);
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
  async gotToExistingStaffMemberPage(staffMemberId: string) {
    const staffMemberUrl = `${URL_LIST.staffMembers}${staffMemberId}`;
    await this.page.goto(staffMemberUrl);
  }
}
