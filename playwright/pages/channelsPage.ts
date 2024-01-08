import { URL_LIST } from "@data/url";
import { RightSideDetailsPage } from "@pageElements/rightSideDetailsSection";
import { BasePage } from "@pages/basePage";
import { DeleteDialog } from "@pages/dialogs/deleteDialog";
import { Page } from "@playwright/test";

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
    readonly orderExpirationInput = page.getByTestId(
      "delete-expired-order-input",
    ),
    readonly transactionFlowCheckbox = page
      .getByTestId("order-settings-mark-as-paid")
      .locator("button")
      .first(),
    readonly allowUnpaidOrdersCheckbox = page
      .getByTestId("allow-unpaid-orders-checkbox")
      .locator("button")
      .first(),
    readonly authorizeInsteadOfChargingCheckbox = page
      .getByTestId("default-transaction-strategy-checkbox")
      .locator("button")
      .first(),
    readonly slugNameInput = page.getByTestId("slug-name-input"),
    readonly channelCurrencySelect = page
      .getByTestId("channel-currency-select-input")
      .locator("input"),
    readonly countrySelect = page
      .getByTestId("country-select-input")
      .locator("input"),
  ) {
    super(page);
    this.page = page;
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
    this.deleteChannelDialog = new DeleteDialog(page);
  }

  async clickAuthorizeInsteadOfChargingCheckbox() {
    await this.authorizeInsteadOfChargingCheckbox.click();
  }
  async clickDeleteButtonOnRowContainingChannelName(channelName: string) {
    await this.channelRow
      .filter({ hasText: channelName })
      .locator(this.deleteChannelButton)
      .click();
  }
  async clickAllowUnpaidOrdersCheckbox() {
    await this.allowUnpaidOrdersCheckbox.click();
  }
  async clickTransactionFlowCheckbox() {
    await this.transactionFlowCheckbox.click();
  }
  async clickCreateChannelButton() {
    await this.createChannelButton.click();
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
  async selectCurrency(currencyName: string) {
    await this.channelCurrencySelect.click();
    await this.page.getByRole("option", { name: currencyName }).click();
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
