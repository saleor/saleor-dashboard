import { ContentPage } from "@pages/contentPage";
import { Page, expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });
let contentPage: ContentPage;
let page: Page
test.beforeEach(({ page }) => {
  contentPage = new ContentPage(page);
  page = page
});

test("TC: SALEOR_130 Create page @e2e @content", async () => {
  await contentPage.goToContentPage()
  await contentPage.clickCreateContent();
  await contentPage.contentCreateDialog.completeContentCreateDialogWithFirstPageType();
  await contentPage.fillSeoInfo("laal", "aa", "aa");
  await contentPage.addAttribute()
});
