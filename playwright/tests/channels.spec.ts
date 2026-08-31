import { CHANNELS } from "@data/e2eTestData";
import { ChannelPage } from "@pages/channelsPage";
import { ConfigurationPage } from "@pages/configurationPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let configurationPage: ConfigurationPage;
let channelPage: ChannelPage;

test.beforeEach(({ page }) => {
  configurationPage = new ConfigurationPage(page);
  channelPage = new ChannelPage(page);
});
test("TC: SALEOR_97 Create basic channel #e2e #channels", async () => {
  const slugName = new Date().toISOString();

  await configurationPage.goToConfigurationView();
  await configurationPage.openChannels();
  await channelPage.clickCreateChannelButton();
  await channelPage.typeChannelName();
  await channelPage.typeSlugName(slugName);
  await channelPage.selectCurrency("AFN");
  await channelPage.selectCountry("Afghanistan");
  await channelPage.submitCreateChannelDialog();
  await channelPage.expectSuccessBanner();
});

test("TC: SALEOR_208 Create channel with all settings #e2e #channels", async () => {
  const slugName = new Date().toISOString();

  await configurationPage.goToConfigurationView();
  await configurationPage.openChannels();
  await channelPage.clickCreateChannelButton();
  await channelPage.typeChannelName();
  await channelPage.typeSlugName(slugName);
  await channelPage.selectCurrency("AFN");
  await channelPage.selectCountry("Afghanistan");
  // The dialog only collects identity; order settings live on the detail page
  // the dialog redirects to.
  await channelPage.submitCreateChannelDialog();

  await expect(channelPage.transactionFlowRadio).toBeChecked();
  await channelPage.clickAllowUnpaidOrdersToggle();
  await expect(channelPage.allowUnpaidOrdersToggle).toHaveAttribute("aria-pressed", "true");
  await channelPage.clickAuthorizeInsteadOfChargingRadio();
  await expect(channelPage.authorizeInsteadOfChargingRadio).toBeChecked();
  await channelPage.clickSaveButton();
  await channelPage.expectSuccessBanner();

  // Checking again after save because state wasn't saved properly
  await channelPage.page.reload();
  await channelPage.channelOrdersSettings.waitFor({ state: "visible", timeout: 30000 });
  await expect(channelPage.transactionFlowRadio).toBeChecked();
  await expect(channelPage.authorizeInsteadOfChargingRadio).toBeChecked();
  await expect(channelPage.allowUnpaidOrdersToggle).toHaveAttribute("aria-pressed", "true");
});

test("TC: SALEOR_98 Edit channel - transaction flow, allow unpaid, authorize, prio high stock #e2e #channels", async () => {
  await channelPage.gotoChannelDetails(CHANNELS.channelToBeEditedSettings.id);
  await channelPage.clickTransactionFlowRadio();
  await channelPage.clickAllowUnpaidOrdersToggle();
  await channelPage.clickAuthorizeInsteadOfChargingRadio();
  await expect(channelPage.transactionFlowRadio).toBeChecked();
  await expect(channelPage.authorizeInsteadOfChargingRadio).toBeChecked();
  await expect(channelPage.allowUnpaidOrdersToggle).toHaveAttribute("aria-pressed", "true");
  await channelPage.rightSideDetailsPage.clickAllocationHighStockButton();
  await channelPage.clickSaveButton();
  await channelPage.expectSuccessBanner();
});
test("TC: SALEOR_99 Delete channel #e2e #channels", async () => {
  await channelPage.gotoChannelList();
  await channelPage.clickDeleteButtonOnRowContainingChannelName(CHANNELS.channelToBeDeleted.name);
  await channelPage.deleteChannelDialog.clickDeleteButton();
  await channelPage.expectSuccessBanner();
  await expect(channelPage.channelsListTable).not.toContainText(CHANNELS.channelToBeDeleted.name);
});
