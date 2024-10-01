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
test("TC: SALEOR_97 Create basic channel @e2e @channels", async () => {
  const slugName = new Date().toISOString();

  await configurationPage.goToConfigurationView();
  await configurationPage.openChannels();
  await channelPage.clickCreateChannelButton();
  await channelPage.typeChannelName();
  await channelPage.typeSlugName(slugName);
  await channelPage.selectCurrency("AFN - Afghanistan");
  await channelPage.selectCountry("Afghanistan");
  await channelPage.clickSaveButton();
  await channelPage.expectSuccessBanner();
});

test("TC: SALEOR_208 Create channel with all settings @e2e @channels", async () => {
  const slugName = new Date().toISOString();

  await configurationPage.goToConfigurationView();
  await configurationPage.openChannels();
  await channelPage.clickCreateChannelButton();
  await channelPage.typeChannelName();
  await channelPage.typeSlugName(slugName);
  await channelPage.selectCurrency("AFN - Afghanistan");
  await channelPage.selectCountry("Afghanistan");
  await channelPage.clickTransactionFlowCheckbox();
  // Checking before save because checkboxes used to not work properly
  await expect(channelPage.transactionFlowCheckbox).toBeChecked();
  await channelPage.clickAllowUnpaidOrdersCheckbox();
  await expect(channelPage.allowUnpaidOrdersCheckbox).toBeChecked();
  await channelPage.clickAuthorizeInsteadOfChargingCheckbox();
  await expect(channelPage.authorizeInsteadOfChargingCheckbox).toBeChecked();
  await channelPage.clickSaveButton();
  await channelPage.expectSuccessBanner();

  // Checking again after save because state wasn't saved properly
  await channelPage.page.waitForURL((url: URL) => !url.pathname.includes("add"));
  await expect(channelPage.transactionFlowCheckbox).toBeChecked();
  await expect(channelPage.authorizeInsteadOfChargingCheckbox).toBeChecked();
  await expect(channelPage.allowUnpaidOrdersCheckbox).toBeChecked();
});

test("TC: SALEOR_98 Edit channel - transaction flow, allow unpaid, authorize, prio high stock @e2e @channels", async () => {
  await channelPage.gotoChannelDetails(CHANNELS.channelToBeEditedSettings.id);
  await channelPage.clickTransactionFlowCheckbox();
  await channelPage.clickAllowUnpaidOrdersCheckbox();
  await channelPage.clickAuthorizeInsteadOfChargingCheckbox();
  await expect(channelPage.transactionFlowCheckbox).toBeChecked();
  await expect(channelPage.authorizeInsteadOfChargingCheckbox).toBeChecked();
  await expect(channelPage.allowUnpaidOrdersCheckbox).toBeChecked();
  await channelPage.rightSideDetailsPage.clickAllocationHighStockButton();
  await channelPage.clickSaveButton();
  await channelPage.expectSuccessBanner();
});
test("TC: SALEOR_99 Delete channel @e2e @channels", async () => {
  await channelPage.gotoChannelList();
  await channelPage.clickDeleteButtonOnRowContainingChannelName(CHANNELS.channelToBeDeleted.name);
  await channelPage.deleteChannelDialog.clickDeleteButton();
  await channelPage.expectSuccessBanner();
  await expect(channelPage.channelsListTable).not.toContainText(CHANNELS.channelToBeDeleted.name);
});
