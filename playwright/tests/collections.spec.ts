import { COLLECTIONS } from "@data/e2eTestData";
import { CollectionsPage } from "@pages/collectionsPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let collectionsPage: CollectionsPage;

test.beforeEach(({ page }) => {
  collectionsPage = new CollectionsPage(page);
});
test("TC: SALEOR_112 Create collection @collections @e2e", async () => {
  await collectionsPage.gotoCollectionsListView();
  await collectionsPage.waitForDOMToFullyLoad();
  await collectionsPage.clickCreateCollectionButton();
  await collectionsPage.typeCollectionName("Saleor automation collection");
  await collectionsPage.typeCollectionDescription("Best collection ever");
  await collectionsPage.uploadCollectionImage("beer.avif");
  await collectionsPage.collectionImages.first().waitFor({ state: "visible" });
  expect(await collectionsPage.collectionImages.count()).toEqual(1);
  await collectionsPage.metadataSeoPage.fillSeoSection();
  await collectionsPage.metadataSeoPage.expandAndAddAllMetadata();
  await collectionsPage.rightSideDetailsPage.selectOneChannelAsAvailableWhenMoreSelected(
    "Channel-PLN",
  );
  await collectionsPage.clickSaveButton();
  await collectionsPage.expectSuccessBanner();
});
test("TC: SALEOR_113 Edit collection: assign product @collections @e2e", async () => {
  const productToBeAssigned = "Bean Juice";

  await collectionsPage.gotoExistingCollectionView(COLLECTIONS.collectionToBeUpdated.id);
  await collectionsPage.clickAssignProductButton();
  await collectionsPage.assignSpecificProductsDialog.assignSpecificProductsByNameAndSave(
    productToBeAssigned,
  );
  await collectionsPage.expectSuccessBanner();
  await expect(
    collectionsPage.assignedSpecificProductRow,
    `Assigned product: ${productToBeAssigned} should be visible`,
  ).toContainText(productToBeAssigned);
  expect(
    await collectionsPage.assignedSpecificProductRow.count(),
    `Only 1 category should be visible in table`,
  ).toEqual(1);
});
test("TC: SALEOR_114 Bulk delete collections @collections @e2e", async () => {
  await collectionsPage.gotoCollectionsListView();
  await collectionsPage.waitForDOMToFullyLoad();
  await collectionsPage.checkListRowsBasedOnContainingText(
    COLLECTIONS.collectionsToBeBulkDeleted.names,
  );
  await collectionsPage.clickBulkDeleteButton();
  await collectionsPage.deleteCollectionDialog.clickDeleteButton();
  await collectionsPage.gotoCollectionsListView();
  expect(
    await collectionsPage.findRowIndexBasedOnText(COLLECTIONS.collectionsToBeBulkDeleted.names),
    `Given collections: ${COLLECTIONS.collectionsToBeBulkDeleted.names} should be deleted from the list`,
  ).toEqual([]);
});
