import { URL_LIST } from "@data/url";
import { permissions } from "@data/userPermissions";
import { AppDetailsPage } from "@pages/appDetailsPage";
import { AppPage } from "@pages/appPageThirdparty";
import { ExtensionsPage } from "@pages/extensionsPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

const permissionToExclude = "app";
const permissionList = permissions.filter(item => item !== permissionToExclude);

for (const permission of permissionList) {
  test.use({ permissionName: permission });

  test(`TC: SALEOR_131 User with ${permission} permissions should have readonly access to installed extensions #e2e #apps`, async ({
    page,
  }) => {
    const mainMenuPage = new MainMenuPage(page);
    const extensionsPage = new ExtensionsPage(page);
    const appPage = new AppPage(page);
    const appDetailsPage = new AppDetailsPage(page);

    await page.goto(URL_LIST.homePage);
    await mainMenuPage.openExtensions();
    await extensionsPage.waitForContentLoad();

    await expect(extensionsPage.installExternalAppButton).not.toBeVisible();

    await expect(extensionsPage.installedExtensionsList).toBeVisible();

    await extensionsPage.installedAppRow.first().click();
    await expect(appPage.appSettingsButton).toBeVisible();
    await appPage.appSettingsButton.click();
    await appPage.waitContentLoad();
    await expect(appDetailsPage.appDetailsSection).toBeVisible();

    const buttons = [
      appDetailsPage.appDeleteButton,
      appDetailsPage.appActivateButton,
      appDetailsPage.appEditPermissionsButton,
    ];

    for (const button of buttons) {
      await expect(button).toBeDisabled();
    }
  });

  test(`TC: SALEOR_131 User with ${permission} permissions should have readonly access to explore extensions #e2e #apps`, async ({
    page,
  }) => {
    const mainMenuPage = new MainMenuPage(page);
    const extensionsPage = new ExtensionsPage(page);

    await page.goto(URL_LIST.homePage);
    await mainMenuPage.openExploreExtensions();
    await extensionsPage.waitForContentLoad();

    await expect(extensionsPage.installExternalAppButton).not.toBeVisible();

    await expect(extensionsPage.availableExtensions).toBeVisible();
  });
}
