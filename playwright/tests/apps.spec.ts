import { APPS } from "@data/e2eTestData";
import { AppInstallationPage } from "@pages/appInstallationPage";
import { AppPage } from "@pages/appPageThirdparty";
import { AppsPage } from "@pages/appsPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "./playwright/.auth/admin.json" });

let appsPage: AppsPage;
let installationPage: AppInstallationPage;
let appPage: AppPage;

test.beforeEach(({ page }) => {
  appsPage = new AppsPage(page);
  installationPage = new AppInstallationPage(page);
  appPage = new AppPage(page);
});

const PRE_INSTALLATION_TIMEOUT = 20 * 1000;
const INSTALLATION_PENDING_TIMEOUT = 50 * 1000;
const APP_LISTED_TIMEOUT = 15 * 1000;
const APP_INSTALLED_TIMEOUT = 50 * 1000;
const APP_EXPECT_TIMEOUT = 15 * 1000;

test("TC: SALEOR_119 User should be able to install and configure app from manifest @e2e", async ({
  page,
}) => {
  await appsPage.gotoAppsList();
  await appsPage.waitForDOMToFullyLoad();
  await expect(appsPage.installExternalAppButton).toBeVisible();
  await appsPage.installExternalAppButton.click();
  await appsPage.typeManifestUrl("https://klaviyo.saleor.app/api/manifest");
  await appsPage.installAppFromManifestButton.click();
  // Klaviyo app can take a while to respond with manifest if it's
  // cold-starting
  await expect(installationPage.appInstallationPageHeader).toHaveText(
    "You are about to install Klaviyo",
    {
      timeout: PRE_INSTALLATION_TIMEOUT,
    },
  );
  await installationPage.installAppButton.click();
  await appsPage.expectSuccessBanner();
  await expect(appsPage.installedAppRow.first()).toBeVisible({
    timeout: APP_LISTED_TIMEOUT,
  });
  await appsPage.installationPendingLabel.waitFor({
    state: "hidden",
    timeout: INSTALLATION_PENDING_TIMEOUT,
  });
  await expect(appsPage.appKlaviyo).toContainText("Klaviyo", {
    timeout: APP_LISTED_TIMEOUT,
  });
  await appsPage.installedAppRow
    .filter({ hasText: "Klaviyo" })
    .first()
    .waitFor({ state: "visible", timeout: APP_INSTALLED_TIMEOUT });
  await appsPage.appKlaviyo.click();

  const iframeLocator = page.frameLocator("iframe");

  await expect(iframeLocator.getByLabel("PUBLIC_TOKEN")).toBeVisible({
    // Klavyio's UI can take a while to load initially
    timeout: APP_EXPECT_TIMEOUT,
  });
  await iframeLocator.getByLabel("PUBLIC_TOKEN").fill("test_token");
  await iframeLocator.getByText("Save").click();
  await appsPage.expectSuccessBanner();
});
test("TC: SALEOR_120 User should be able to delete thirdparty app @e2e", async () => {
  await appPage.waitForNetworkIdleAfterAction(() =>
    appPage.goToExistingAppPage(APPS.appToBeDeleted.id),
  );
  await appPage.pageHeader.waitFor({ state: "visible", timeout: 10000 });
  await expect(appPage.pageHeader).toContainText("Saleor QA App");
  await appPage.deleteButton.click();
  await appPage.deleteAppDialog.clickDeleteButton();
  await appsPage.expectSuccessBanner();
  await appsPage.waitForDOMToFullyLoad();
  await expect(appsPage.installedAppRow.first()).toBeVisible();
  await expect(appsPage.appQA).not.toBeVisible();
});
