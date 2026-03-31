import { APPS } from "@data/e2eTestData";
import { AppInstallationPage } from "@pages/appInstallationPage";
import { AppPage } from "@pages/appPageThirdparty";
import { ExtensionsPage } from "@pages/extensionsPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let extensionsPage: ExtensionsPage;
let installationPage: AppInstallationPage;
let appPage: AppPage;

test.beforeEach(({ page }) => {
  extensionsPage = new ExtensionsPage(page);
  installationPage = new AppInstallationPage(page);
  appPage = new AppPage(page);
});
const INSTALLATION_PENDING_TIMEOUT = 50 * 1000;

test("TC: SALEOR_119 User should be able to install and configure app from manifest #e2e", async () => {
  await extensionsPage.gotoInstalledExtensionsList();
  await extensionsPage.addExtensionsOpenDropdownButton.click();
  await extensionsPage.installCustomExtensionOption.click();
  await installationPage.typeManifestUrl(APPS.appToBeInstalled.manifestUrl);
  await installationPage.installAppFromManifestButton.click();
  await extensionsPage.expectSuccessBanner({ timeout: INSTALLATION_PENDING_TIMEOUT });
  await expect(extensionsPage.installedExtensionsRow.first()).toBeVisible();
  await expect(extensionsPage.installationPendingLabel).not.toBeVisible();
  await expect(
    extensionsPage.installedExtensionsRow.filter({ hasText: APPS.appToBeInstalled.name }).first(),
  ).toBeVisible();
});
test("TC: SALEOR_120 User should be able to delete thirdparty app #e2e", async () => {
  await appPage.waitForNetworkIdleAfterAction(() =>
    appPage.goToExistingAppPage(APPS.appToBeDeleted.id),
  );
  await appPage.pageHeader.waitFor({ state: "visible", timeout: 10000 });
  await expect(appPage.pageHeader).toContainText(APPS.appToBeDeleted.name);
  await appPage.deleteButton.click();
  await appPage.deleteAppDialog.clickDeleteButton();
  await extensionsPage.expectSuccessBanner();
  await extensionsPage.waitForDOMToFullyLoad();
  await expect(extensionsPage.installedExtensionsRow.first()).toBeVisible();
  await expect(
    extensionsPage.installedExtensionsRow.filter({ hasText: APPS.appToBeDeleted.name }).first(),
  ).not.toBeVisible();
});
