import { CategoriesPage } from "@pages/categoriesPage";
import { ContentPage } from "@pages/contentPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });
let contentPage: ContentPage;
test.beforeEach(({ page }) => {
  contentPage = new ContentPage(page);
});

test("TC: SALEOR_102 Create basic category @e2e @category", async () => {
  await contentPage.clickCreateContent();
  await contentPage.contentCreateDialog.completeContentCreateDialogWithFirstPageType();
});
