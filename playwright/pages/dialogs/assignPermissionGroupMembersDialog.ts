import type { Page } from "@playwright/test";

export class AssignPermissionGroupMembersDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly searchMembersInput = page.getByTestId("search-members-input").locator("input"),
    readonly userRow = page.getByTestId("user-row"),
    readonly assignButton = page.getByTestId("submit"),
    readonly searchResults = page.getByTestId("search-results"),
  ) {
    this.page = page;
  }

  async searchForMembers(memberName: string) {
    await this.searchMembersInput.first().fill("");
    await this.searchMembersInput.first().fill(memberName);
    await this.searchResults.waitFor({ state: "attached", timeout: 30000 });
  }

  async selectMember(memberName: string) {
    await this.userRow
      .getByText(memberName, { exact: true })
      .waitFor({ state: "visible", timeout: 30000 });

    const memberInput = await this.userRow.filter({ hasText: memberName }).locator("input").first();

    await memberInput.click();
  }

  async clickAssignButton() {
    await this.assignButton.click();
  }
}
