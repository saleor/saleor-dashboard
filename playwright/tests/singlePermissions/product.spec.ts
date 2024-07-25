import { HomePage } from "@pages/homePage";
import { CategoriesPage } from "@pages/categoriesPage";
import { CollectionsPage } from "@pages/collectionsPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { ProductPage } from "@pages/productPage";
import { BrowserContext, expect, test } from "@playwright/test";

let context: BrowserContext;
let home: HomePage;
let mainMenuPage: MainMenuPage;
let productPage: ProductPage;
let categoriesPage: CategoriesPage;
let collectionsPage: CollectionsPage;

test.beforeEach(async ({ browser }) => {
  context = await browser.newContext({
    storageState: "playwright/.auth/product.json",
  });

  const page = await context.newPage();

  productPage = new ProductPage(page);
  home = new HomePage(page);
  mainMenuPage = new MainMenuPage(page);
  categoriesPage = new CategoriesPage(page);
  collectionsPage = new CollectionsPage(page);

  await home.goto();
  await home.welcomeMessage.waitFor({ state: "visible", timeout: 30000 });
});

test.afterEach(async () => {
  await context.close();
});

test("TC: SALEOR_23 User should be able to navigate to product list as a staff member using PRODUCT permission @e2e", async () => {
  await mainMenuPage.openProducts();
  await expect(productPage.addProductButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(6);
  await productPage.expectGridToBeAttached();
});

test("TC: SALEOR_24 User should be able to navigate to collections list as a staff member using PRODUCT permission @e2e", async () => {
  await mainMenuPage.openCollections();
  await expect(collectionsPage.createCollectionButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(6);
  await collectionsPage.expectGridToBeAttached();
});

test("TC: SALEOR_25 User should be able to navigate to categories list as a staff member using PRODUCT permission @e2e", async () => {
  await mainMenuPage.openCategories();
  await expect(categoriesPage.createCategoryButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(6);
  await categoriesPage.expectGridToBeAttached();
});
