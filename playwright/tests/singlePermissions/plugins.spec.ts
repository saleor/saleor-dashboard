import { URL_LIST } from "@data/url";
import { ConfigurationPage } from "@pages/configurationPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { PluginsPage } from "@pages/pluginsPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/plugins.json" });

test("TC: SALEOR_16 User should be able to navigate to plugin list as a staff member using PLUGINS permission @e2e", async ({
  page,
}) => {
  const configurationPage = new ConfigurationPage(page);
  const mainMenuPage = new MainMenuPage(page);
  const pluginsPage = new PluginsPage(page);

  await page.goto(URL_LIST.configuration);
  await configurationPage.openPlugins();
  await expect(pluginsPage.pluginRow.first()).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(3);
});
