import { URL_LIST } from "@data/url";
import { ChannelPage } from "@pages/channelsPage";
import { ConfigurationPage } from "@pages/configurationPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { WebhooksEventsPage } from "@pages/webhooksEventsPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/channels-webhooks.json" });

test("TC: SALEOR_11 User should be able to navigate to channel list as a staff member using CHANNEL permission @e2e", async ({
  page,
}) => {
  const channelPage = new ChannelPage(page);
  const mainMenuPage = new MainMenuPage(page);
  const configurationPage = new ConfigurationPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openConfiguration();
  await mainMenuPage.expectMenuItemsCount(3);
  await configurationPage.openChannels();

  await expect(channelPage.createChannelButton).toBeVisible();
  await expect(channelPage.deleteChannelButton.first()).toBeVisible();
});
test("TC: SALEOR_12 User should be able to navigate to webhooks and events as a staff member using CHANNEL permission @e2e", async ({
  page,
}) => {
  const webhooksEventsPage = new WebhooksEventsPage(page);
  const mainMenuPage = new MainMenuPage(page);
  const configurationPage = new ConfigurationPage(page);

  await page.goto(URL_LIST.configuration);
  await mainMenuPage.expectMenuItemsCount(3);
  await configurationPage.openWebhooksAndEvents();
  await expect(webhooksEventsPage.createAppButton).toBeVisible();
});
