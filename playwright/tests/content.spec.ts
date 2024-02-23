import { PAGES } from "@data/e2eTestData";
import { ContentPage } from "@pages/contentPage";
import { Page, expect, test } from "@playwright/test";
import * as faker from 'faker';

test.use({ storageState: "playwright/.auth/admin.json" });
let contentPage: ContentPage;
let page: Page
test.beforeEach(({ page }) => {
  contentPage = new ContentPage(page);
  page = page
});

test("TC: SALEOR_130 Create page @e2e @content", async () => {
  const title = faker.name.title()
  const content = faker.lorem.paragraph()
  const seo = {
    title: faker.name.title(),
    slug: faker.lorem.slug(),
    description: faker.lorem.paragraph()
  };
  const metadata = {
    key: faker.random.word(),
    value: faker.lorem.word()
  }
  const privateMetadata = {
    key: faker.random.word(),
    value: faker.lorem.word(),
  };

  await contentPage.goToContentPage()
  await contentPage.clickCreateContent();
  await contentPage.contentCreateDialog.completeContentCreateDialogWithFirstPageType();
  await contentPage.fillTitle(title);
  await contentPage.fillContent(content);
  await contentPage.fillSeoInfo(seo.slug, seo.title, seo.description);
  await contentPage.addAttribute();
  await contentPage.addMetadata(metadata.key, metadata.value);
  await contentPage.addPrivateMetadata(metadata.key, metadata.value);
  await contentPage.clickSaveButton();
  await contentPage.expectSuccessBanner();
});

test("TC: SALEOR_131 Delete page @e2e @content", async () => {
  await contentPage.goToContentDetailsPage(PAGES.pageToDelete.id);
  await contentPage.clickDeletePageButton();
  await contentPage.deleteDialog.clickDeleteButton();
  await contentPage.expectSuccessBanner();
});