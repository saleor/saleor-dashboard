import { ATTRIBUTES, PAGE_TYPES } from "@data/e2eTestData";
import { PageTypesPage } from "@pages/pageTypesPage";
import { expect, test } from "@playwright/test";
import * as faker from "faker";

test.use({ storageState: "./playwright/.auth/admin.json" });

const pageTypeName = `e2e-page-type-${faker.datatype.number()}`;

test("TC: SALEOR_187 As an admin user I can create page type @e2e @page-type", async ({ page }) => {
  const pageTypePage = new PageTypesPage(page);

  await pageTypePage.gotoPageTypeListPage();
  await pageTypePage.clickCreatePageTypeButton();
  await pageTypePage.typePageTypeName(pageTypeName);
  await pageTypePage.waitForNetworkIdle(() => pageTypePage.clickSaveButton());
  await pageTypePage.expectSuccessBanner();
  await expect(pageTypePage.nameInput).toHaveValue(pageTypeName);
  await pageTypePage.waitForNetworkIdle(() => pageTypePage.gotoPageTypeListPage());
  await expect(pageTypePage.pageTypeList).toContainText(pageTypeName);
});
test("TC: SALEOR_188 As an admin user I can update page type@e2e @page-type", async ({ page }) => {
  const pageTypePage = new PageTypesPage(page);
  const updatedPageTypeName = `updated-e2e-page-type-${faker.datatype.number()}`;
  const attributeName = ATTRIBUTES.attributeToBeAssignedToPageType.name;

  await pageTypePage.gotoExistingPageTypePage(PAGE_TYPES.pageTypeToBeEdited.id);
  await pageTypePage.updatePageTypeName(updatedPageTypeName);
  await pageTypePage.waitForNetworkIdle(() => pageTypePage.clickSaveButton());
  await pageTypePage.expectSuccessBanner();
  await expect(pageTypePage.nameInput).toHaveValue(updatedPageTypeName);
  await pageTypePage.waitForNetworkIdle(() => pageTypePage.assignAttributes(attributeName));
  await pageTypePage.expectSuccessBanner();
  await expect(pageTypePage.pageAttributes).toContainText(attributeName);
});
test("TC: SALEOR_189 As an admin user I can delete page type with assigned content@e2e @page-type", async ({
  page,
}) => {
  const pageTypePage = new PageTypesPage(page);
  const pageType = PAGE_TYPES.pageTypeToBeRemoved;

  await pageTypePage.gotoExistingPageTypePage(pageType.id);
  await pageTypePage.clickDeleteButton();
  await pageTypePage.deletePageTypeDialog.waitForDOMToFullyLoad();
  await pageTypePage.deletePageTypeDialog.clickConfirmDeletionCheckbox();
  await pageTypePage.waitForNetworkIdle(() => pageTypePage.clickConfirmRemovalButton());
  await pageTypePage.expectSuccessBanner();
  await pageTypePage.waitForNetworkIdle(() => pageTypePage.gotoPageTypeListPage());
  await expect(pageTypePage.pageTypeList).not.toContainText(pageType.name);
});
test("TC: SALEOR_190 As an admin user I can delete several page types@e2e @page-type", async ({
  page,
}) => {
  const pageTypePage = new PageTypesPage(page);
  const rowsToBeDeleted = PAGE_TYPES.pageTypesToBeBulkDeleted.ids;
  const pageTypeNames = PAGE_TYPES.pageTypesToBeBulkDeleted.names;

  await pageTypePage.waitForNetworkIdle(() => pageTypePage.gotoPageTypeListPage());
  await expect(pageTypePage.pageTypeList).toBeVisible();
  await pageTypePage.checkPageTypesOnList(rowsToBeDeleted);
  await pageTypePage.clickBulkDeleteButton();
  await pageTypePage.deletePageTypeDialog.waitForDOMToFullyLoad();
  await pageTypePage.waitForNetworkIdle(() => pageTypePage.clickConfirmRemovalButton());
  await pageTypePage.expectSuccessBanner();
  await expect(pageTypePage.pageTypeList).not.toContainText(pageTypeNames[0]);
  await expect(pageTypePage.pageTypeList).not.toContainText(pageTypeNames[1]);
});
