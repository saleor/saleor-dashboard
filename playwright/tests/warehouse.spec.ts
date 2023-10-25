import { URL_LIST } from "@data/url";
import { WarehousePage } from "@pages/warehousePage";
import { test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });

test("TC: SALEOR_30 Create basic warehouse @basic-regression @warehouse", async ({
  page,
}) => {
  const warehousePage = new WarehousePage(page);

  await page.goto(URL_LIST.warehouses);
  await warehousePage.clickCreateNewWarehouseButton();
  await warehousePage.completeWarehouseForm();
  await warehousePage.clickSaveButton();
  await warehousePage.basePage.expectSuccessBanner();
});
