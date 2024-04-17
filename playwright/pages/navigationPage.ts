import { BasePage } from "./basePage";
import { URL_LIST } from "@data/url";
import { AddNavigationMenuDialog } from "./dialogs/addNavigationMenuDialog";
import type { Page } from "@playwright/test";
import { DeleteDialog } from "./dialogs/deleteDialog";

export class NavigationPage extends BasePage {
  addNavigationMenuDialog: AddNavigationMenuDialog;
  deleteDialog: DeleteDialog;

  constructor(
    page: Page,
    readonly navigationButton = page.getByTestId(
      "configuration-menu-navigation-settings-subsection-navigation",
    ),
    readonly navigationHeader = page
      .getByTestId("page-header")
      .getByText("Navigation"),
    readonly navigationList = page.getByTestId("navigation-menu-list"),
    readonly checkedRows = page
      .getByTestId("navigation-menu-list")
      .locator('input[type="checkbox"]:checked'),
    readonly createMenuButton = page.getByTestId("add-menu"),
    readonly menuName = page.getByTestId("menu-name"),
    readonly createMenuDialogTitle = page.getByTestId(
      "create-menu-dialog-title",
    ),
    readonly deleteButton = page.getByTestId("delete-button"),
    readonly bulkDeleteButton = page
      .getByTestId("bulk-delete-button"),
    readonly navigationMenu = page.getByTestId("navigation-menu"),
  ) {
    super(page);
    this.addNavigationMenuDialog = new AddNavigationMenuDialog(page);
    this.deleteDialog = new DeleteDialog(page);
  }

  async clickNavigationButtonFromConfiguration() {
    await this.navigationButton.click();
  }

  async goToNavigationView() {
    await this.page.goto(URL_LIST.navigation);
    await this.waitForDOMToFullyLoad();
  }
  async deleteSingleMenu(name: string) {
    await this.page
      .getByRole("link", { name: name })
      .getByTestId("delete-button")
      .click();
  }
  async clickBulkDeleteButton() {
    await this.bulkDeleteButton.click();
  }
  async selectNavigationMenu(name: string) {
    const item = await this.navigationMenu.filter({ hasText: name });
    await item.getByTestId("checkbox").click();
  }
}
