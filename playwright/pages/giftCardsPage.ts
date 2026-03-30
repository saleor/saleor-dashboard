import { URL_LIST } from "@data/url";
import { DeleteDialog } from "@dialogs/deleteDialog";
import { ExportGiftCardsDialog } from "@dialogs/exportGiftCardsDialog";
import { IssueGiftCardDialog } from "@dialogs/issueGiftCardDialog";
import { ResendGiftCardCodeDialog } from "@dialogs/resendGiftCardCodeDialog";
import { SetGiftCardsBalanceDialog } from "@dialogs/setGiftCardBalanceDialog";
import { FiltersPage } from "@pageElements/filtersPage";
import { MetadataSeoPage } from "@pageElements/metadataSeoPage";
import { BasePage } from "@pages/basePage";
import { expect, type Page } from "@playwright/test";

export class GiftCardsPage extends BasePage {
  readonly page: Page;

  readonly issueGiftCardDialog: IssueGiftCardDialog;

  readonly resendGiftCardCodeDialog: ResendGiftCardCodeDialog;

  readonly metadataSeoPage: MetadataSeoPage;

  readonly deleteDialog: DeleteDialog;

  readonly exportGiftCardsDialog: ExportGiftCardsDialog;

  readonly setGiftCardsBalanceDialog: SetGiftCardsBalanceDialog;

  readonly filtersPage!: FiltersPage;

  constructor(
    page: Page,
    readonly issueCardButton = page.getByTestId("issue-card-button"),
    readonly bulkDeleteButton = page.getByTestId("bulk-delete-button"),
    readonly resendCodeButton = page.getByTestId("resend-code"),
    readonly deactivateButton = page.getByTestId("enable-button"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly giftCardsCanvas = page.locator('[data-testid="data-grid-canvas"]'),
    readonly cardExpiresCheckboxOnModal = page
      .getByTestId("expiry-section")
      .locator('button[role="checkbox"]'),
    readonly giftCardExpiresCheckbox = page
      .getByTestId("gift-card-expire-section")
      .locator("button"),
    readonly exportCardCodesButton = page.getByTestId("exportCodesMenuItem"),
    readonly setBalanceButton = page.getByTestId("set-balance-button"),
    readonly showMoreMenuButton = page.getByTestId("show-more-button"),
    readonly disabledStatusPill = page
      .getByTestId("page-header")
      .getByText("Disabled", { exact: true }),
    readonly giftCardDialog = page.getByTestId("gift-card-dialog"),
    readonly exportGiftCardsBanner = page.getByText(
      "We are currently exporting your gift card codes. As soon as your file is available it will be sent to your email address",
    ),
    readonly tagsInput = page.getByTestId("gift-card-tag-select-field"),
    readonly tagsInputOptions = page.locator('[data-test-id*="select-option"]'),
    readonly expiryDateInput = page.locator('input[name="expiryDate"]'),
  ) {
    super(page);
    this.page = page;
    this.issueGiftCardDialog = new IssueGiftCardDialog(page);
    this.resendGiftCardCodeDialog = new ResendGiftCardCodeDialog(page);
    this.metadataSeoPage = new MetadataSeoPage(page);
    this.deleteDialog = new DeleteDialog(page);
    this.exportGiftCardsDialog = new ExportGiftCardsDialog(page);
    this.setGiftCardsBalanceDialog = new SetGiftCardsBalanceDialog(page);
    this.filtersPage = new FiltersPage(page);
  }

  async clickIssueCardButton() {
    await this.issueCardButton.waitFor({ state: "visible" });
    await this.issueCardButton.click();
    await this.giftCardDialog.waitFor({ state: "visible" });
    await this.cardExpiresCheckboxOnModal.waitFor({ state: "visible" });
    await expect(this.cardExpiresCheckboxOnModal).toBeEnabled();
  }

  async clickBulkDeleteButton() {
    await this.bulkDeleteButton.waitFor({ state: "visible" });
    await this.bulkDeleteButton.click();
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async clickCardExpiresCheckboxOnModal() {
    await this.cardExpiresCheckboxOnModal.click();
  }

  async clickCardExpiresCheckbox() {
    await this.giftCardExpiresCheckbox.click();
  }

  async setExpiryDateTwoMonthsFromNow() {
    await this.expiryDateInput.waitFor({ state: "visible" });
    const date = new Date();
    date.setMonth(date.getMonth() + 2);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    await this.expiryDateInput.fill(`${year}-${month}-${day}`);
  }

  async clickDeactivateButton() {
    await this.deactivateButton.click();
  }

  async clickExportGiftCards() {
    await this.exportCardCodesButton.click();
  }

  async clickResendCodeButton() {
    await this.resendCodeButton.click();
  }

  async clickSetBalance() {
    await this.setBalanceButton.click();
  }

  async clickShowMoreMenu() {
    await this.showMoreMenuButton.click();
  }

  async openTagInput() {
    await this.tagsInput.click();
  }

  async closeTagInput() {
    await this.tagsInput.blur();
  }

  async selectFirstTag() {
    await this.tagsInputOptions.first().click();
  }

  async gotoGiftCardsListView() {
    await this.page.goto(URL_LIST.giftCards);
    await this.giftCardsCanvas.waitFor({ state: "visible" });
  }

  async gotoExistingGiftCardView(giftCardId: string) {
    const existingGiftCardUrl = URL_LIST.giftCards + giftCardId;

    console.log("Navigating to existing gift card: " + existingGiftCardUrl);
    await this.page.goto(existingGiftCardUrl);
    await this.waitForDOMToFullyLoad();
  }
}
