import { WAREHOUSES } from "@data/e2eTestData";
import { WarehousePage } from "@pages/warehousePage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let warehousePage: WarehousePage;

test.beforeEach(({ page }) => {
  warehousePage = new WarehousePage(page);
});
test("TC: SALEOR_30 Create basic warehouse #e2e #warehouse", async () => {
  await warehousePage.gotoWarehouseListView();
  await warehousePage.clickCreateNewWarehouseButton();
  await warehousePage.completeWarehouseForm();
  await warehousePage.clickSaveButton();
  await warehousePage.basePage.expectSuccessBanner();
});
test("TC: SALEOR_100 Edit warehouse #e2e #warehouse", async () => {
  await warehousePage.gotoExistingWarehousePage(WAREHOUSES.warehouseToBeEdited.id);
  await warehousePage.typeWarehouseName("edited warehouse");
  await warehousePage.typeWarehouseEmail("edited@saleor.io");
  await warehousePage.typeCompanyName("Umbrella");
  await warehousePage.typeAddressLine1("edited warehouse address 1");
  await warehousePage.typeAddressLine2("edited warehouse address 2");
  await warehousePage.typePhone("+48655922888");
  await warehousePage.rightSideDetailsPage.clickPublicStockButton();
  await warehousePage.rightSideDetailsPage.clickPickupAllWarehousesButton();
  await warehousePage.clickSaveButton();
  await warehousePage.basePage.expectSuccessBanner();
});
test("TC: SALEOR_101 Delete warehouse #e2e #warehouse", async () => {
  await warehousePage.gotoWarehouseListView();
  await warehousePage.clickDeleteWarehouseButton(WAREHOUSES.warehouseToBeDeleted.name);
  await warehousePage.deleteWarehouseDialog.clickDeleteButton();
  await warehousePage.expectSuccessBanner();
  await expect(warehousePage.warehousesList).not.toContainText(
    WAREHOUSES.warehouseToBeDeleted.name,
  );
});
