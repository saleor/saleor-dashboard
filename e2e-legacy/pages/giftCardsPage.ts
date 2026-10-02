import { URL_LIST } from "@data/url";
import { DeleteDialog } from "@dialogs/deleteDialog";
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
    readonly setBalanceButton = page.getByTestId("set-balance-button"),
    readonly giftCardDialog = page.getByTestId("gift-card-dialog"),
    readonly tagsInput = page.getByTestId("gift-card-tag-select-field"),
    readonly tagsInputOptions = page.locator('[data-test-id*="select-option"]'),
  ) {
    super(page);
    this.page = page;
    this.issueGiftCardDialog = new IssueGiftCardDialog(page);
    this.resendGiftCardCodeDialog = new ResendGiftCardCodeDialog(page);
    this.metadataSeoPage = new MetadataSeoPage(page);
    this.deleteDialog = new DeleteDialog(page);
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

  async clickDeactivateButton() {
    await this.deactivateButton.click();
  }

  async clickResendCodeButton() {
    await this.resendCodeButton.click();
  }

  async clickSetBalance() {
    await this.setBalanceButton.click();
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
