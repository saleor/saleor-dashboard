import { CATEGORIES } from "@data/e2eTestData";
import { CategoriesPage } from "@pages/categoriesPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });
let categoriesPage: CategoriesPage;
test.beforeEach(({ page }) => {
  categoriesPage = new CategoriesPage(page);
});

test("TC: SALEOR_102 Create basic category @e2e @category", async () => {
  await categoriesPage.gotoCategoryListView();
  await categoriesPage.clickCreateNewCategoryButton();
  await categoriesPage.typeCategoryName("Utils");
  await categoriesPage.typeCategoryDescription("Utils description");
  await categoriesPage.metadataSeoPage.fillSeoSection();
  await categoriesPage.metadataSeoPage.expandAndAddAllMetadata();
  await categoriesPage.clickSaveButton();
  await categoriesPage.expectSuccessBanner();
});
test("TC: SALEOR_103 Edit category @e2e @category", async () => {
  await categoriesPage.gotoExistingCategoriesPage(
    CATEGORIES.categoryToBeUpdated.id,
  );
  await categoriesPage.typeCategoryName("Updated category");
  await categoriesPage.typeCategoryDescription("Utils description updated");
  await categoriesPage.clickProductsTabButton();
  await categoriesPage.clickSaveButton();
  await categoriesPage.expectSuccessBanner();
  await expect(categoriesPage.productsGridList).toContainText(
    "beer to be updated",
  );
});

test("TC: SALEOR_104 Bulk delete categories @e2e @category", async () => {
  await categoriesPage.gotoCategoryListView();
  await categoriesPage.checkListRowsBasedOnContainingText(
    CATEGORIES.categoriesToBeBulkDeleted.names,
  );

  await categoriesPage.clickBulkDeleteButton();
  await categoriesPage.deleteCategoriesDialog.clickDeleteButton();
  await categoriesPage.waitForGrid();

  expect(
    await categoriesPage.findRowIndexBasedOnText(
      CATEGORIES.categoriesToBeBulkDeleted.names,
    ),
    `Given categories: ${CATEGORIES.categoriesToBeBulkDeleted.names} should be deleted from the list`,
  ).toEqual([]);
});
