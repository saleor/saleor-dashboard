import { URL_LIST } from "@data/url";
import { permissions, UserPermission } from "@data/userPermissions";
import { AppDetailsPage } from "@pages/appDetailsPage";
import { AppPage } from "@pages/appPageThirdparty";
import { ExtensionsPage } from "@pages/extensionsPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

const permissionsToExclude = new Set<UserPermission>(["app", "plugin"]);
const permissionList = permissions.filter(item => !permissionsToExclude.has(item));

for (const permission of permissionList) {
  test.use({ permissionName: permission });

  test.skip(`TC: SALEOR_131 User with ${permission} permissions should have readonly access to installed extensions #e2e #apps`, async ({
    page,
  }) => {
    const mainMenuPage = new MainMenuPage(page);
    const extensionsPage = new ExtensionsPage(page);
    const appPage = new AppPage(page);
    const appDetailsPage = new AppDetailsPage(page);

    await page.goto(URL_LIST.homePage);
    await mainMenuPage.openExtensions();
    await extensionsPage.waitForContentLoad();

    await expect(extensionsPage.addExtensionsOpenDropdownButton).not.toBeVisible();

    await expect(extensionsPage.installedExtensionsList).toBeVisible();

    await extensionsPage.extensionViewDetailsButton.first().click();
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

    await expect(extensionsPage.addExtensionsOpenDropdownButton).not.toBeVisible();

    await expect(extensionsPage.availableExtensions).toBeVisible();

    // Assert all install buttons are disabled (readonly access)
    const pluginInstallButtons = await extensionsPage.pluginExtensionExploreInstallButtons.all();

    for (const button of pluginInstallButtons) {
      await expect(button).toBeDisabled();
    }

    const extensionInstallButtons = await extensionsPage.appExtensionExploreInstallButtons.all();

    for (const button of extensionInstallButtons) {
      await expect(button).toBeDisabled();
    }
  });
}
