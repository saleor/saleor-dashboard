import { URL_LIST } from "@data/url";
import { RightSideDetailsPage } from "@pageElements/rightSideDetailsSection";
import { BasePage } from "@pages/basePage";
import { DeleteDialog } from "@pages/dialogs/deleteDialog";
import { type Page } from "@playwright/test";

export class ChannelPage extends BasePage {
  readonly page: Page;

  readonly rightSideDetailsPage: RightSideDetailsPage;

  readonly deleteChannelDialog: DeleteDialog;

  constructor(
    page: Page,
    readonly deleteChannelButton = page.getByTestId("delete-channel"),
    readonly channelRow = page.getByTestId("channel-row"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly createChannelButton = page.getByTestId("add-channel"),
    readonly channelsListTable = page.getByTestId("channel-list"),
    readonly channelNameInput = page.getByTestId("channel-name-input"),
    readonly orderExpirationInput = page.getByTestId("delete-expired-order-input"),
    // "Mark as paid" and the transaction flow strategy are radio groups now,
    // one test id per option; "allow unpaid orders" is a DetailSettingToggleRow.
    readonly transactionFlowRadio = page
      .getByTestId("order-settings-mark-as-paid-TRANSACTION_FLOW")
      .getByRole("radio"),
    readonly authorizeInsteadOfChargingRadio = page
      .getByTestId("default-transaction-strategy-AUTHORIZATION")
      .getByRole("radio"),
    readonly allowUnpaidOrdersToggle = page
      .getByTestId("channel-allow-unpaid-orders")
      .locator('[role="button"]'),
    readonly slugNameInput = page.getByTestId("slug-name-input"),
    readonly channelCurrencySelect = page.getByTestId("channel-currency-select-input"),
    readonly countrySelect = page.getByTestId("country-select-input"),
    readonly createChannelDialog = page.getByTestId("create-channel-dialog"),
    readonly channelOrdersSettings = page.getByTestId("channel-orders-settings"),
  ) {
    super(page);
    this.page = page;
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
    this.deleteChannelDialog = new DeleteDialog(page);
  }

  async clickAuthorizeInsteadOfChargingRadio() {
    await this.authorizeInsteadOfChargingRadio.click();
  }

  async clickDeleteButtonOnRowContainingChannelName(channelName: string) {
    await this.channelRow
      .filter({ hasText: channelName })
      .locator(this.deleteChannelButton)
      .click();
  }

  async clickAllowUnpaidOrdersToggle() {
    await this.allowUnpaidOrdersToggle.click();
  }

  async clickTransactionFlowRadio() {
    await this.transactionFlowRadio.click();
  }

  async clickCreateChannelButton() {
    await this.createChannelButton.click();
  }

  /**
   * Channels are created in a dialog that confirms with its own submit button
   * and then lands on the detail page, where the order settings live.
   */
  async submitCreateChannelDialog() {
    await this.createChannelDialog.getByTestId("submit").click();
    await this.channelOrdersSettings.waitFor({ state: "visible", timeout: 30000 });
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async typeChannelName(channelName = "z - automation") {
    await this.channelNameInput.fill(channelName);
  }

  async typeSlugName(slugName: string) {
    await this.slugNameInput.fill(slugName);
  }

  async typeOrderExpiration(expirationDays = "120") {
    await this.orderExpirationInput.fill(expirationDays);
  }

  /**
   * Option labels now read "<code> <symbol> - <countries>" (see
   * getCurrencySearchLabel), so match by filtering on the code instead.
   */
  async selectCurrency(currencyCode: string) {
    await this.channelCurrencySelect.click();
    await this.channelCurrencySelect.fill(currencyCode);
    await this.page.getByRole("option").first().click();
  }

  async selectCountry(countryName: string) {
    await this.countrySelect.click();
    await this.page.getByRole("option", { name: countryName }).click();
  }

  async gotoChannelDetails(channelId: string) {
    const channelDetailsUrl = URL_LIST.channels + channelId;

    await console.log("Navigating to channel details: " + channelDetailsUrl);
    await this.page.goto(channelDetailsUrl);
  }

  async gotoChannelList() {
    await this.page.goto(URL_LIST.channels);
  }
}
