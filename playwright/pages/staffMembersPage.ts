import { MailpitService } from "@api/mailpit";
import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { InviteStaffMembersDialog } from "@pages/dialogs/inviteStaffMemberDialog";
import type { APIRequestContext, Page } from "@playwright/test";
import { expect } from "@playwright/test";

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
    readonly firstName = page.getByTestId("staffFirstName"),
    readonly lastName = page.getByTestId("staffLastName"),
    readonly email = page.getByTestId("staffEmail"),
    readonly permissionsGroupSelectButton = page.getByTestId("permission-groups"),
    readonly permissionGroupOptions = page.getByTestId("select-option"),
    readonly isActiveCheckbox = page.getByTestId("is-active-checkbox").locator("input"),
  ) {
    super(page);
    this.request = request;
    this.basePage = new BasePage(page);
    this.mailpitService = new MailpitService(request);
    this.inviteStaffMembersDialog = new InviteStaffMembersDialog(page);
  }

  async goToStaffDetailsPage(id: string) {
    await this.page.goto(URL_LIST.staffMembers + id);
  }

  async clickIsActiveCheckbox() {
    await this.isActiveCheckbox.click();
  }

  async clickPermissionsGroupSelectButton() {
    await this.permissionsGroupSelectButton.click();
  }

  async assignUserToPermissionGroup(permissionGroupName: string) {
    await this.permissionGroupOptions.filter({ hasText: permissionGroupName }).click();
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

  async verifyAssignedPermission(permissionName: string) {
    const permissions = await this.permissionsGroupSelectButton
      .locator('[data-test-id*="selected-option-"]')
      .allInnerTexts();

    await expect(permissions).toContain(permissionName);
  }

  async updateStaffInfo(name: string, lastName: string, email: string) {
    await this.firstName.clear();
    await this.firstName.fill(name);
    await this.lastName.clear();
    await this.lastName.fill(lastName);
    await this.email.clear();
    await this.email.fill(email);
  }
}
