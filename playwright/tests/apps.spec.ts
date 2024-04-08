import { AppsPage } from "@pages/appsPage";
import { AppInstallationPage } from "@pages/appInstallationPage";
import { expect, test } from "@playwright/test";
import { AppPage } from "@pages/appPageThirdparty";
import { APPS } from "@data/e2eTestData";

test.use({ storageState: "./playwright/.auth/admin.json" });
let appsPage: AppsPage;
let installationPage: AppInstallationPage;
let appPage: AppPage;

test.beforeEach(({ page }) => {
  appsPage = new AppsPage(page);
  installationPage = new AppInstallationPage(page);
  appPage = new AppPage(page);
});

//Adding temporary skip https://linear.app/saleor/issue/QAG-94/remove-skip-from-app-tests
test.skip("TC: SALEOR_119 User should be able to install and configure app from manifest @e2e", async ({
  page,
}) => {
  await appsPage.gotoAppsList();
  await appsPage.waitForDOMToFullyLoad();
  await expect(appsPage.installExternalAppButton).toBeVisible();
  await appsPage.installExternalAppButton.click();
  await appsPage.typeManifestUrl("https://klaviyo.saleor.app/api/manifest");
  await appsPage.installAppFromManifestButton.click();
  await expect(installationPage.appInstallationPageHeader).toHaveText(
    "You are about to install Klaviyo",
  );
  await installationPage.installAppButton.click();
  await appsPage.expectSuccessBanner();
  await expect(appsPage.installedAppRow.first()).toBeVisible();
  await appsPage.installationPendingLabel.waitFor({
    state: "hidden",
    timeout: 50000,
  });
  await expect(appsPage.appKlaviyo).toContainText("Klaviyo");
  await appsPage.installedAppRow
    .filter({ hasText: "Klaviyo" })
    .first()
    .waitFor({ state: "visible", timeout: 50000 });
  await appsPage.appKlaviyo.click();
  const iframeLocator = page.frameLocator("iframe");
  await expect(iframeLocator.getByLabel("PUBLIC_TOKEN")).toBeVisible();
  await iframeLocator.getByLabel("PUBLIC_TOKEN").fill("test_token");
  await iframeLocator.getByText("Save").click();
  await appsPage.expectSuccessBanner();
});

test("TC: SALEOR_120 User should be able to delete thirdparty app @e2e", async () => {
  await appPage.goToExistingAppPage(APPS.appToBeDeleted.id);
  await appPage.pageHeader.waitFor({ state: "visible", timeout: 10000 });
  await expect(appPage.pageHeader).toContainText("Adyen");
  await appPage.deleteButton.click();
  await appPage.deleteAppDialog.clickDeleteButton();
  await appsPage.expectSuccessBanner();
  await appsPage.waitForDOMToFullyLoad();
  await expect(appsPage.installedAppRow.first()).toBeVisible();
  await expect(appsPage.appAdyen).not.toBeVisible();
});
