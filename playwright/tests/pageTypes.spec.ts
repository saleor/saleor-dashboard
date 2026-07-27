import { ATTRIBUTES } from "@data/e2eTestData";
import { URL_LIST } from "@data/url";
import { PageTypesPage } from "@pages/pageTypesPage";
import { expect, type Page } from "@playwright/test";
import * as faker from "faker";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

const pageTypeName = `e2e-page-type-${faker.datatype.number()}`;

const createPageType = async (
  page: Page,
  pageTypePage: PageTypesPage,
  name: string,
): Promise<string> => {
  await pageTypePage.gotoPageTypeListPage();
  await pageTypePage.clickCreatePageTypeButton();
  await pageTypePage.typePageTypeName(name);
  const createPageTypeUrl = page.url();

  await Promise.all([
    page.waitForURL(url => url.toString() !== createPageTypeUrl),
    pageTypePage.clickSaveButton(),
  ]);
  await pageTypePage.expectSuccessBanner();
  await expect(pageTypePage.nameInput).toHaveValue(name);

  const pageTypeId = new URL(page.url()).pathname.split("/").filter(Boolean).at(-1);

  if (!pageTypeId) {
    throw new Error(`Could not determine the ID of the newly created model type "${name}"`);
  }

  return decodeURIComponent(pageTypeId);
};

test("TC: SALEOR_187 As an admin user I can create page type #e2e #page-type", async ({ page }) => {
  const pageTypePage = new PageTypesPage(page);

  await createPageType(page, pageTypePage, pageTypeName);
  await pageTypePage.gotoPageTypeListPage();
  await expect(pageTypePage.pageTypeList).toContainText(pageTypeName);
});
test("TC: SALEOR_188 As an admin user I can update page type#e2e #page-type", async ({ page }) => {
  const pageTypePage = new PageTypesPage(page);
  const originalPageTypeName = `e2e-page-type-to-update-${faker.datatype.number()}`;
  const updatedPageTypeName = `updated-e2e-page-type-${faker.datatype.number()}`;
  const attributeName = ATTRIBUTES.attributeToBeAssignedToPageType.name;
  const pageTypeId = await createPageType(page, pageTypePage, originalPageTypeName);

  await pageTypePage.gotoExistingPageTypePage(pageTypeId);
  await pageTypePage.updatePageTypeName(updatedPageTypeName);
  await pageTypePage.clickSaveButton();
  await pageTypePage.expectSuccessBanner();
  await expect(pageTypePage.nameInput).toHaveValue(updatedPageTypeName);
  await pageTypePage.assignAttributes(attributeName);
  await pageTypePage.expectSuccessBanner();
  await expect(pageTypePage.pageAttributes).toContainText(attributeName);
});
test("TC: SALEOR_189 As an admin user I can delete page type with assigned content#e2e #page-type", async ({
  page,
}) => {
  const pageTypePage = new PageTypesPage(page);
  const pageTypeName = `e2e-page-type-to-remove-${faker.datatype.number()}`;
  const modelName = `e2e-model-to-remove-${faker.datatype.number()}`;
  const pageTypeId = await createPageType(page, pageTypePage, pageTypeName);

  await page.goto(`${URL_LIST.addPageType}${encodeURIComponent(pageTypeId)}`);
  await page.locator("[name='title']").fill(modelName);
  const createModelUrl = page.url();

  await Promise.all([
    page.waitForURL(url => url.toString() !== createModelUrl),
    pageTypePage.clickSaveButton(),
  ]);
  await pageTypePage.expectSuccessBanner();

  await pageTypePage.gotoExistingPageTypePage(pageTypeId);
  await pageTypePage.clickDeleteButton();
  await pageTypePage.deletePageTypeDialog.waitForDOMToFullyLoad();
  await pageTypePage.deletePageTypeDialog.clickConfirmDeletionCheckbox();
  await pageTypePage.clickConfirmRemovalButton();
  await pageTypePage.expectSuccessBanner();
  await pageTypePage.gotoPageTypeListPage();
  await expect(pageTypePage.pageTypeList).not.toContainText(pageTypeName);
});
test("TC: SALEOR_190 As an admin user I can delete several page types#e2e #page-type", async ({
  page,
}) => {
  const pageTypePage = new PageTypesPage(page);
  const pageTypeNames = [
    `e2e-page-type-to-bulk-delete-1-${faker.datatype.number()}`,
    `e2e-page-type-to-bulk-delete-2-${faker.datatype.number()}`,
  ];
  const rowsToBeDeleted: string[] = [];

  for (const pageTypeName of pageTypeNames) {
    rowsToBeDeleted.push(await createPageType(page, pageTypePage, pageTypeName));
  }

  await pageTypePage.gotoPageTypeListPage();
  await expect(pageTypePage.pageTypeList).toBeVisible();
  await pageTypePage.checkPageTypesOnList(rowsToBeDeleted);
  await pageTypePage.clickBulkDeleteButton();
  await pageTypePage.deletePageTypeDialog.waitForDOMToFullyLoad();
  await pageTypePage.clickConfirmRemovalButton();
  await pageTypePage.expectSuccessBanner();
  await expect(pageTypePage.pageTypeList).not.toContainText(pageTypeNames[0]);
  await expect(pageTypePage.pageTypeList).not.toContainText(pageTypeNames[1]);
});
