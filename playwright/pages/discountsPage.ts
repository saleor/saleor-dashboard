import  { Page } from "@playwright/test";
import { URL_LIST } from "@data/url";
import { DeleteDiscountDialog } from "@dialogs/deleteDiscountDialog";
import { DeleteRuleDialog } from "@dialogs/deleteRuleDialog";
import { PromotionRuleDialog } from "@pages/dialogs/promotionRuleDialog";

import { BasePage } from "@pages/basePage";
import { date } from "faker";

export class DiscountsPage extends BasePage {
  deleteDiscountDialog: DeleteDiscountDialog;
  promotionRuleDialog: PromotionRuleDialog;
  deleteRuleDialog: DeleteRuleDialog;

  constructor(
    page: Page,
    readonly createDiscountButton = page.getByTestId("create-sale"),
    readonly discountForm = page.getByTestId("discount-form"),
    readonly discountNameInput = page.getByTestId("discount-name-input"),
    readonly discountTypeSelect = page.getByTestId("discount-type-select"),
    readonly activeDatesSection = page.getByTestId("active-dates-section"),
    readonly startDateInput = page.getByTestId("start-date-input"),
    readonly startHourInput = page.getByTestId("start-hour-input"),
    readonly endDateCheckbox = page.getByTestId("has-end-date"),
    readonly endDateInput = page.getByTestId("end-date-input"),
    readonly endHourInput = page.getByTestId("end-hour-input"),
    readonly discountDescriptionInput = page.getByTestId("rich-text-editor-description"),
    readonly addRuleButton = page.getByTestId("add-rule"),
    readonly editRuleButton = page.getByTestId("rule-edit-button"),
    readonly deleteRuleButton = page.getByTestId("rule-delete-button"),
    readonly ruleName = page.getByTestId("rule-name"),
    readonly addRuleDialog = page.getByTestId("add-rule-dialog"),
    readonly ruleSection = page.getByTestId("rule-list"),
    readonly existingRule = ruleSection.getByTestId("added-rule"),
    readonly ruleLabelWithActions = page.getByTestId("rule-label-with-actions"),
    readonly ruleSummaryChip = page.getByTestId("rule-summary-chip"),
    readonly ruleValueChip = page.getByTestId("rule-value-chip"),
    readonly deleteRuleModal = page.getByTestId("delete-rule-dialog"),
  ) {
    super(page)
    this.deleteDiscountDialog = new DeleteDiscountDialog(page);
    this.promotionRuleDialog = new PromotionRuleDialog(page);
    this.deleteRuleDialog = new DeleteRuleDialog(page);
}

  async clickCreateDiscountButton() {
    await this.createDiscountButton.click();
  }

  async typeDiscountName(name: string) { await this.discountNameInput.fill(name) }

  async selectDiscountType(type: string) {
    await this.discountTypeSelect.click()
    await this.page.getByRole("listbox").waitFor({
      state: "visible",
      timeout: 10000,
    });
    await this.page.getByTestId("select-option").filter({ hasText: type }).click();
  }

  async typePromotionDescription(description: string) {
    await this.discountDescriptionInput.locator('[contenteditable="true"]').fill(description);
  }

  async typeStartDate() {
    await this.startDateInput.fill(date.recent().toISOString().split("T")[0])
  }

  async typeStartHour() {
    await this.startHourInput.fill("12:00");
  }

  async clickEndDateCheckbox() {
    await this.endDateCheckbox.click();
  }

  async typeEndDate() {
    await this.endDateInput.fill(date.future().toISOString().split("T")[0]);
  }
  async typeEndHour() {
    await this.endHourInput.fill("12:00")
  }
  async gotoListView() {
    await this.page.goto(URL_LIST.discounts);
    await this.createDiscountButton.waitFor({
      state: "visible",
      timeout: 10000,
    });
  }
  async gotoExistingDiscount(promotionId: string) {
    const existingDiscountUrl = `${URL_LIST.discounts}${promotionId}`;
    await console.log(
      `Navigates to existing discount page: ${existingDiscountUrl}`,
    );
    await this.page.goto(existingDiscountUrl);

    await this.discountForm.waitFor({
      state: "visible",
      timeout: 30000,
    });
  }

  async clickAddRuleButton() {
    await this.page.getByTestId('add-rule').click();
  }

  async clickEditRuleButton(rule: string) {
    await this.existingRule.locator(this.ruleLabelWithActions).filter({ hasText: rule }).locator(this.editRuleButton).click();
  }

  async clickDeleteRuleButton(rule: string) {
    await this.existingRule.locator(this.ruleLabelWithActions).filter({ hasText: rule }).locator(this.deleteRuleButton).click();
  }

  async openPromotionRuleModal() {
    await this.addRuleButton.click();
    await this.addRuleDialog.waitFor({
      state: "visible",
      timeout: 10000,
    });
  }
}
