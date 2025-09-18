import { BasePage } from "@pages/basePage";
import { ContentPage } from "@pages/contentPage";
import { HomePage } from "@pages/homePage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { PageTypesPage } from "@pages/pageTypesPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "page" });

let basePage: BasePage;
let mainMenuPage: MainMenuPage;
let home: HomePage;
let contentPage: ContentPage;
let pageTypesPage: PageTypesPage;

test.beforeEach(async ({ page }) => {
  mainMenuPage = new MainMenuPage(page);
  home = new HomePage(page);
  contentPage = new ContentPage(page);
  basePage = new BasePage(page);
  pageTypesPage = new PageTypesPage(page);
});
test.beforeEach(async ({ page }) => {
  mainMenuPage = new MainMenuPage(page);
  home = new HomePage(page);
  contentPage = new ContentPage(page);
  basePage = new BasePage(page);
  pageTypesPage = new PageTypesPage(page);
  await home.goto();
  await home.welcomeMessage.waitFor({ state: "visible", timeout: 30000 });
});
test("TC: SALEOR_14 User should be able to navigate to content list as a staff member using CONTENT aka PAGE permission #e2e", async () => {
  await mainMenuPage.openModels();
  await expect(contentPage.createContentButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(6);
  await basePage.expectGridToBeAttached();
});
test("TC: SALEOR_16 User should be able to navigate to page types list as a staff member using CONTENT aka PAGE permission #e2e", async () => {
  await mainMenuPage.openModelTypes();
  await expect(pageTypesPage.createPageTypeButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(6);
});
