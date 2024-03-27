import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { CategoriesPage } from "@pages/categoriesPage";
import { CollectionsPage } from "@pages/collectionsPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { ProductPage } from "@pages/productPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/product.json" });

test("TC: SALEOR_23 User should be able to navigate to product list as a staff member using PRODUCT permission @e2e", async ({
  page,
}) => {
  const mainMenuPage = new MainMenuPage(page);
  const basePage = new BasePage(page);
  const productPage = new ProductPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openProducts();
  await expect(productPage.addProductButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(6);
  await basePage.expectGridToBeAttached();
});
test("TC: SALEOR_24 User should be able to navigate to collections list as a staff member using PRODUCT permission @e2e", async ({
  page,
}) => {
  const mainMenuPage = new MainMenuPage(page);
  const basePage = new BasePage(page);
  const collectionsPage = new CollectionsPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openCollections();
  await expect(collectionsPage.createCollectionButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(6);
  await basePage.expectGridToBeAttached();
});
test("TC: SALEOR_25 User should be able to navigate to categories list as a staff member using PRODUCT permission @e2e", async ({
  page,
}) => {
  const mainMenuPage = new MainMenuPage(page);
  const basePage = new BasePage(page);
  const categoriesPage = new CategoriesPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openCategories();
  await expect(categoriesPage.createCategoryButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(6);
  await basePage.expectGridToBeAttached();
});
