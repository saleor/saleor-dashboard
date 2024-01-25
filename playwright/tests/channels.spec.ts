import { CHANNELS } from "@data/e2eTestData";
import { ChannelPage } from "@pages/channelsPage";
import { ConfigurationPage } from "@pages/configurationPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });
let configurationPage: ConfigurationPage;
let channelPage: ChannelPage;

test.beforeEach(({ page }) => {
  configurationPage = new ConfigurationPage(page);
  channelPage = new ChannelPage(page);
});

test("TC: SALEOR_97 Create basic channel @e2e @channels", async () => {
  const slugName = new Date().toISOString();

  await configurationPage.gotoConfigurationView();
  await configurationPage.openChannels();
  await channelPage.clickCreateChannelButton();
  await channelPage.typeChannelName();
  await channelPage.typeSlugName(slugName);
  await channelPage.selectCurrency("AFN - Afghanistan");
  await channelPage.selectCountry("Afghanistan");
  await channelPage.clickSaveButton();
  await channelPage.expectSuccessBanner();
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
  await channelPage.clickDeleteButtonOnRowContainingChannelName(
    CHANNELS.channelToBeDeleted.name,
  );
  await channelPage.deleteChannelDialog.clickDeleteButton();
  await channelPage.expectSuccessBanner();
  await expect(channelPage.channelsListTable).not.toContainText(
    CHANNELS.channelToBeDeleted.name,
  );
});
