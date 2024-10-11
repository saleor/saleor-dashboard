import { NAVIGATION_ITEMS } from "@data/e2eTestData";
import { ConfigurationPage } from "@pages/configurationPage";
import { AddNavigationMenuItemDialog } from "@pages/dialogs/addNavigationMenuItemDialog";
import { NavigationDetailsPage } from "@pages/navigationDetailsPage";
import { NavigationPage } from "@pages/navigationPage";
import { expect } from "@playwright/test";
import faker from "faker";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let navigation: NavigationPage;
let navigationDetailsPage: NavigationDetailsPage;
let config: ConfigurationPage;
let addNavigationMenuItemDialog: AddNavigationMenuItemDialog;

test.beforeEach(({ page }) => {
  navigation = new NavigationPage(page);
  config = new ConfigurationPage(page);
  navigationDetailsPage = new NavigationDetailsPage(page);
  addNavigationMenuItemDialog = new AddNavigationMenuItemDialog(page);
});
test("TC: SALEOR_193 Should go to Navigation page @navigation @e2e", async () => {
  await config.goToConfigurationView();
  await navigation.clickNavigationButtonFromConfiguration();
  await expect(navigation.navigationHeader).toBeVisible();
  await expect(navigation.navigationList).toBeVisible();
});
test("TC: SALEOR_194 Should create a new menu navigation with menu item @navigation @e2e", async () => {
  test.slow();
  await navigation.goToNavigationView();
  await navigation.createMenuButton.click();
  await expect(navigation.createMenuDialogTitle).toBeVisible();

  const menuName = faker.random.word();

  await navigation.addNavigationMenuDialog.typeNewMenuName(menuName);
  await navigation.addNavigationMenuDialog.clickSaveButton();
  await navigationDetailsPage.clickCreateNewMenuItem();
  await expect(navigationDetailsPage.addMenuItemDialog).toBeVisible();

  const menuItemName = faker.random.word();

  await addNavigationMenuItemDialog.typeMenuItemName(menuItemName);
  await addNavigationMenuItemDialog.selectLinkOption("Categories", "Polo Shirts");
  await addNavigationMenuItemDialog.clickSaveButton();
  await expect(navigationDetailsPage.addMenuItemDialog).not.toBeVisible();
  await navigationDetailsPage.expectSuccessBanner();
  await expect(navigationDetailsPage.menuNameInput).toHaveValue(menuName);
  await expect(navigationDetailsPage.menuItemList).toContainText(menuItemName);
});
// TODO: To be updated after https://linear.app/saleor/issue/MERX-307 is fixed
test("TC: SALEOR_198 Should update existing menu @navigation @e2e", async () => {
  await navigationDetailsPage.goToExistingMenuView(NAVIGATION_ITEMS.navigationMenuToBeUpdated.id);

  const menuItemToBeUpdated = NAVIGATION_ITEMS.navigationMenuToBeUpdated.menuItems[0];
  const menuItemToBeDeleted = NAVIGATION_ITEMS.navigationMenuToBeUpdated.menuItems[1];
  const newItemName = faker.random.word();

  await navigationDetailsPage.clickEditMenuItemButton(menuItemToBeUpdated.name);
  await addNavigationMenuItemDialog.typeMenuItemName(newItemName);
  await addNavigationMenuItemDialog.selectLinkOption("Categories", "Polo Shirts");
  await addNavigationMenuItemDialog.clickSaveButton();
  await expect(navigationDetailsPage.addMenuItemDialog).not.toBeVisible();
  await navigationDetailsPage.clickDeleteMenuItemButton(menuItemToBeDeleted.name);
  await navigationDetailsPage.clickCreateNewMenuItem();
  await expect(navigationDetailsPage.addMenuItemDialog).toBeVisible();

  const menuItemName = faker.random.word();

  await addNavigationMenuItemDialog.typeMenuItemName(menuItemName);
  await addNavigationMenuItemDialog.selectLinkOption("Categories", "Polo Shirts");
  await addNavigationMenuItemDialog.clickSaveButton();
  await expect(navigationDetailsPage.menuItemList).toContainText(menuItemName);
  await navigationDetailsPage.clickDeleteMenuItemButton(menuItemName);
  await expect(navigationDetailsPage.menuItemList).not.toContainText(menuItemName);
  await navigationDetailsPage.clickUndoButton();
  await expect(navigationDetailsPage.menuItemList).toContainText(menuItemName);
  await expect(navigationDetailsPage.menuItemList).toContainText(newItemName);
  await expect(navigationDetailsPage.menuItemList).not.toContainText(menuItemToBeDeleted.name);

  const newName = faker.random.word();

  await navigationDetailsPage.fillName(newName);
  await navigationDetailsPage.clickSaveButton();

  const currentMenuName = await navigationDetailsPage.menuNameInput.inputValue();

  await expect(currentMenuName).not.toBe(NAVIGATION_ITEMS.navigationMenuToBeUpdated.name);
  await expect(currentMenuName).toBe(newName);
});
test("TC: SALEOR_197 Should remove existing menu from it's details page @navigation @e2e", async () => {
  await navigationDetailsPage.goToExistingMenuView(
    NAVIGATION_ITEMS.navigationMenuToBeDeletedFromDetailsView.id,
  );
  await navigationDetailsPage.clickDeleteButton();
  await navigationDetailsPage.deleteDialog.clickDeleteButton();
  await navigationDetailsPage.expectSuccessBanner();
  await expect(navigation.navigationList).not.toHaveText(
    NAVIGATION_ITEMS.navigationMenuToBeDeletedFromDetailsView.name,
  );
});
test("TC: SALEOR_195 Should remove a single menu from the list @navigation @e2e", async () => {
  await navigation.goToNavigationView();
  await navigation.selectNavigationMenu(NAVIGATION_ITEMS.navigationMenuToBeDeletedFromList.name);
  await navigation.deleteSingleMenu(NAVIGATION_ITEMS.navigationMenuToBeDeletedFromList.name);
  await navigation.deleteDialog.clickDeleteButton();
  await navigation.expectSuccessBanner();
  await expect(navigation.navigationList).not.toHaveText(
    NAVIGATION_ITEMS.navigationMenuToBeDeletedFromList.name,
  );
});
test("TC: SALEOR_196 Should bulk delete menus from the list @navigation @e2e", async () => {
  await navigation.goToNavigationView();
  await navigation.selectAll();

  const menusToBeBulkDeleted = NAVIGATION_ITEMS.navigationMenusToBeBulkDeleted.names;
  const menus = await navigation.menuName.allInnerTexts();

  for (const name of menus) {
    await expect(navigation.checkedRows.locator(`:nth-match(:text(${name})`)).toBeTruthy();
  }
  for (const menuName of menus) {
    if (menuName !== menusToBeBulkDeleted[0] && menuName !== menusToBeBulkDeleted[1]) {
      await navigation.selectNavigationMenu(menuName);
    }
  }
  await navigation.clickBulkDeleteButton();
  await navigation.deleteDialog.clickDeleteButton();
  await navigation.successBanner.waitFor({ state: "hidden" });
  await expect(navigation.navigationList).not.toHaveText(menusToBeBulkDeleted[0]);
  await expect(navigation.navigationList).not.toHaveText(menusToBeBulkDeleted[1]);
});
