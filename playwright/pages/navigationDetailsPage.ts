import { BasePage } from "./basePage";
import { URL_LIST } from "@data/url";
import { AddNavigationMenuItemDialog } from "./dialogs/addNavigationMenuItemDialog";
import { DeleteDialog } from "./dialogs/deleteDialog";
import type { Page } from "@playwright/test";


export class NavigationDetailsPage extends BasePage {

addNavigationMenuItemDialog:AddNavigationMenuItemDialog;
deleteDialog:DeleteDialog;
constructor(
    page: Page,
    readonly navigationDetails = page.getByTestId("navigation-menu-details-page"),
    readonly menuNameInput = page.getByTestId("menu-name").locator("input"),
    readonly createMenuItemButton = page.getByTestId("create-new-menu-item"),
    readonly menuItem = page.getByTestId("menu-item"),
    readonly undoButton = page.getByTestId("undo-button"),
    readonly deleteButton = page.getByTestId("button-bar-delete"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly backButton = page.getByTestId("button-bar-cancel"),
    readonly menuItemList = page.getByTestId("menu-items-list"),
    readonly editMenuItemButton = page.getByTestId("edit-menu-item-button"),
    readonly deleteMenuItemButton = page.getByTestId("remove-menu-item-button"),
    readonly addMenuItemDialog = page.getByTestId("add-menu-item-dialog-title"),

)
{ super(page);
        this.addNavigationMenuItemDialog = new AddNavigationMenuItemDialog(page);
        this.deleteDialog = new DeleteDialog(page);
}

async goToExistingMenuView(id: string) {
    await this.page.goto(`${URL_LIST.navigation}${id}`);
    await this.waitForDOMToFullyLoad();
}
async clickEditMenuItemButton(name:string) {
    const menuItem = await this.menuItem.filter({hasText:name})
    await menuItem.getByTestId("edit-menu-item-button").first().click();
}
async clickDeleteMenuItemButton(name:string) {
    await this.menuItem.filter({hasText:name}).locator("[data-test-id='remove-menu-item-button']").first().click();
}
async fillName(name: string) {
    await this.menuNameInput.fill(name);
}
async clickCreateNewMenuItem() {
    await this.createMenuItemButton.click();
}
async clickSaveButton() {
    await this.saveButton.click();
}
async clickDeleteButton() {
    await this.deleteButton.click();
}
async clickUndoButton() {
    await this.undoButton.click();
}
}
