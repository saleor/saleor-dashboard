import { AppsPage } from "@pages/appsPage";
import { AppInstallationPage } from "@pages/appInstallationPage";
import { expect, test } from "@playwright/test";
import { AppPage } from "@pages/appPageThirdparty";
import { APPS } from "@data/e2eTestData";

test.use({ storageState: "playwright/.auth/admin.json" });
let appsPage: AppsPage;
let installationPage: AppInstallationPage;
let appPage: AppPage;

test("TC: SALEOR_ User should be able to install and configure app from manifest @e2e", async ({
  page,
}) => {
  const appsPage = new AppsPage(page);
  const installationPage = new AppInstallationPage(page);

  await appsPage.gotoAppsList();
  await expect(appsPage.installExternalAppButton).toBeVisible();
  await appsPage.installExternalAppButton.click();
  await appsPage.typeManifestUrl("https://klaviyo.saleor.app/api/manifest");
  await appsPage.installAppFromManifestButton.click();
  await expect(installationPage.appInstallationPageHeader).toHaveText("You are about to install Klaviyo");
  await installationPage.installAppButton.click();
  await appsPage.expectSuccessBanner();
  await expect(appsPage.installedAppRow.first()).toBeVisible();
  await expect(appsPage.appKlaviyo).toContainText("Klaviyo");
  await appsPage.appKlaviyo.click();

  const iframeLocator = page.frameLocator("iframe");

  await expect(iframeLocator.getByLabel("CUSTOMER_CREATED_METRIC")).toBeVisible();
  await expect(iframeLocator.getByLabel("FULFILLMENT_CREATED_METRIC")).toBeVisible();
  await expect(iframeLocator.getByLabel("ORDER_CREATED_METRIC")).toBeVisible();
  await expect(iframeLocator.getByLabel("ORDER_FULLY_PAID_METRIC")).toBeVisible();
  await expect(iframeLocator.getByLabel("PUBLIC_TOKEN")).toBeVisible();
  await iframeLocator.getByLabel("PUBLIC_TOKEN").fill("test_token");
  await iframeLocator.getByText("Save").click();
  await appsPage.expectSuccessBanner();

});

test("TC: SALEOR_ User should be able to delete third party app @e2e", async ({
  page,
}) => {
  const appsPage = new AppsPage(page);
  const appPage = new AppPage(page);

  await appPage.goToExistingAppPage(APPS.appToBeDeleted.id);
  await expect(appPage.pageHeader).toContainText("Adyen");
  await appPage.deleteButton.click();
  await appPage.deleteAppDialog.clickDeleteButton();
  await appsPage.expectSuccessBanner();
  await expect(appsPage.installedAppRow.first()).toBeVisible();
  await expect(appsPage.appAdyen).not.toBeVisible();

});