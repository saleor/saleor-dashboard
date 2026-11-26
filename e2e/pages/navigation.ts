import { type Page } from "@playwright/test";

/**
 * Getting around the dashboard the way a user does: the sidebar, the configuration page,
 * and the first row of whatever list is open.
 */
export class Navigation {
  readonly sidebar = this.page.getByTestId("menu-list");

  readonly configurationMenu = this.page.getByTestId("configuration-menu");

  /* Glide's canvas sets `data-testid`, not the `data-test-id` the rest of the app uses. */
  readonly grid = this.page.locator('[data-testid="data-grid-canvas"]').first();

  /* Skeleton rows render without a link, so only loaded rows match. */
  readonly tableRows = this.page.locator("table:not([role=grid]) tbody tr:has(a[href])");

  constructor(readonly page: Page) {}

  /**
   * Clicks sidebar entries in order. A group's header is a link that also expands it, so
   * `sidebarTo("Discounts", "Vouchers")` is how a user reaches an item inside a group.
   */
  async sidebarTo(...labels: string[]): Promise<void> {
    for (const label of labels) {
      await this.sidebar.getByRole("link", { name: label, exact: true }).last().click();
    }
  }

  async configurationTo(label: string): Promise<void> {
    await this.sidebarTo("Configuration");
    /* A card, not the category heading that can share its title. */
    await this.configurationMenu
      .getByRole("link")
      .filter({ has: this.page.getByText(label, { exact: true }) })
      .click();
  }

  /** Opens the first row of the list on the page, a datagrid or a plain table. */
  async openFirstRow(): Promise<void> {
    const { pathname } = new URL(this.page.url());

    await this.grid.or(this.tableRows).first().waitFor();

    if (await this.grid.isVisible()) {
      await this.grid.locator("tbody tr").first().waitFor({ state: "attached" });

      /*
       * The canvas draws its rows, so there is no element to click. Hovering a row places
       * the datagrid's row anchor under the cursor, and the click lands on that link.
       */
      const box = await this.grid.boundingBox();

      if (!box) {
        throw new Error("the datagrid has no layout box");
      }

      const firstRow = { x: box.x + box.width * 0.3, y: box.y + 60 };

      await this.page.mouse.move(firstRow.x, firstRow.y, { steps: 3 });
      await this.page.mouse.click(firstRow.x, firstRow.y);
    } else {
      await this.tableRows
        .first()
        .locator("td")
        .filter({ hasNot: this.page.locator("input") })
        .first()
        .click();
    }

    await this.page.waitForURL(url => url.pathname !== pathname);
  }

  async openOwnAccount(): Promise<void> {
    await this.page.getByTestId("userMenu").click();
    await this.page.getByTestId("account-settings-button").click();
    await this.page.waitForURL(/\/staff\//);
  }

  /** Opens the Cmd+K navigator and waits for its search to answer. */
  async searchNavigator(query: string): Promise<void> {
    await this.page.keyboard.press("ControlOrMeta+k");

    const searched = this.page.waitForResponse(
      response => response.request().postDataJSON()?.operationName === "NavigatorSearch",
    );

    await this.page.getByRole("combobox").fill(query);
    await searched;
    await this.page.keyboard.press("Escape");
  }
}
