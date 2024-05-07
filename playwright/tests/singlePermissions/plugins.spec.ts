import { ConfigurationPage } from "@pages/configurationPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { PluginsPage } from "@pages/pluginsPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/plugin.json" });

let configurationPage: ConfigurationPage;
let mainMenuPage: MainMenuPage;
let pluginsPage: PluginsPage;

test.beforeEach(({ page }) => {
  configurationPage = new ConfigurationPage(page);
  mainMenuPage = new MainMenuPage(page);
  pluginsPage = new PluginsPage(page);
});
test("TC: SALEOR_16 User should be able to navigate to plugin list as a staff member using PLUGINS permission @e2e", async () => {
  await configurationPage.gotoConfigurationView();
  await configurationPage.openPlugins();
  await expect(pluginsPage.pluginRow.first()).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(3);
});
