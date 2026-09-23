import { expect, type Page } from "@playwright/test";

/**
 * Ported from the legacy suite. Its "welcome to your Store Dashboard" assertion was
 * dropped: `home-header` no longer exists anywhere in `src/` - the home page was replaced
 * - so that check could only ever have passed against an old dashboard.
 *
 * Signed-in is asserted on the sidebar's user menu instead. It renders only for an
 * authenticated user, and unlike the home page's contents it does not change with whatever
 * the current homepage happens to promote.
 */
export class HomePage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly userMenu = page.getByTestId("userMenu"),
  ) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async expectSignedIn(): Promise<void> {
    await expect(this.userMenu).toBeVisible();
  }
}
