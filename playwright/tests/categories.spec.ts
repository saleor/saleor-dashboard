import { CATEGORIES } from "@data/e2eTestData";
import { CategoriesPage } from "@pages/categoriesPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let categoriesPage: CategoriesPage;

test.beforeEach(({ page }) => {
  categoriesPage = new CategoriesPage(page);
});
test("TC: SALEOR_102 Create basic category #e2e #category", async () => {
  await categoriesPage.gotoCategoryListView();
  await categoriesPage.waitForDatagridLoaderToDisappear();
  await categoriesPage.clickCreateNewCategoryButton();
  await categoriesPage.typeCategoryName("Utils");
  await categoriesPage.typeCreateCategoryDescription("Utils description");
  await categoriesPage.clickCreateCategorySubmitButton();
  await categoriesPage.expectSuccessBanner();
  await expect(categoriesPage.page).toHaveURL(/\/categories\/.+/);
  await expect(categoriesPage.categoryNameInput).toHaveValue("Utils");
});
test("TC: SALEOR_103 Edit category #e2e #category", async () => {
  await categoriesPage.gotoExistingCategoriesPage(CATEGORIES.categoryToBeUpdated.id);
  await categoriesPage.typeCategoryName("Updated category");
  await categoriesPage.typeCategoryDescription("Utils description updated");
  await categoriesPage.clickSaveButton();
  await categoriesPage.expectSuccessBanner();
  await expect(categoriesPage.categoryProductsCard).toContainText("beer to be updated");
});
test("TC: SALEOR_104 Bulk delete categories #e2e #category", async () => {
  await categoriesPage.gotoCategoryListView();
  await categoriesPage.waitForDOMToFullyLoad();
  await categoriesPage.checkListRowsBasedOnContainingText(
    CATEGORIES.categoriesToBeBulkDeleted.names,
  );
  await categoriesPage.clickBulkDeleteButton();
  await categoriesPage.deleteCategoriesDialog.clickDeleteButton();
  await categoriesPage.gotoCategoryListView();
  expect(
    await categoriesPage.findRowIndexBasedOnText(CATEGORIES.categoriesToBeBulkDeleted.names),
    `Given categories: ${CATEGORIES.categoriesToBeBulkDeleted.names} should be deleted from the list`,
  ).toEqual([]);
});
