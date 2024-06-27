import { URL_LIST } from "@data/url";
import { permissions } from "@data/userPermissions";
import { AppDetailsPage } from "@pages/appDetailsPage";
import { AppPage } from "@pages/appPageThirdparty";
import { AppsPage } from "@pages/appsPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { expect, test } from "@playwright/test";

const permissionToExclude = "app";
const permissionList = permissions.filter(item => item !== permissionToExclude);

for (const permission of permissionList) {
  test.use({ storageState: `playwright/.auth/${permission}.json` });
  test(`TC: SALEOR_131 User with ${permission} permissions should have readonly access to Apps @e2e @appp`, async ({
    page,
  }) => {
    const mainMenuPage = new MainMenuPage(page);
    const appsPage = new AppsPage(page);
    const appPage = new AppPage(page);
    const appDetailsPage = new AppDetailsPage(page);

    await page.goto(URL_LIST.homePage);
    await mainMenuPage.waitForNetworkIdleAfterAction(() => mainMenuPage.openApps());
    await mainMenuPage.waitForDOMToFullyLoad();
    await expect(appsPage.installExternalAppButton).not.toBeVisible();

    const appLists = [
      appsPage.installedAppsList,
      appsPage.availableAppsList,
      appsPage.upcomingAppsList,
    ];

    for (const appList of appLists) {
      await appsPage.waitForDOMToFullyLoad();
      await expect(appList).toBeVisible();
    }
    await appsPage.waitForNetworkIdleAfterAction(() => appsPage.installedAppRow.first().click());
    await expect(appPage.appSettingsButton).toBeVisible();
    await appsPage.waitForNetworkIdleAfterAction(() => appPage.appSettingsButton.click());
    await expect(appDetailsPage.appDetailsSection).toBeVisible();

    const buttons = [
      appDetailsPage.appDeleteButton,
      appDetailsPage.appActivateButton,
      appDetailsPage.appEditPermissionsButton,
    ];

    for (const button of buttons) {
      await button.waitFor({
        state: "visible",
        timeout: 10000,
      });
      await expect(button).toBeDisabled();
    }
  });
}
