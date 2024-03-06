import type { Page } from "@playwright/test";
import { URL_LIST } from "@data/url";
import { DeleteDiscountDialog } from "@dialogs/deleteDiscountDialog";
import { PromotionRuleDialog } from "@pages/dialogs/promotionRuleDialog";

import { BasePage } from "@pages/basePage";
import { date } from "faker";

export class DiscountsPage extends BasePage {
  deleteDialog: DeleteDiscountDialog;
  promotionRuleDialog: PromotionRuleDialog;


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
    readonly addRuleDialog = page.getByTestId("add-rule-dialog"),
    readonly ruleSection = page.getByTestId("rule-list"),
    readonly existingRule = ruleSection.getByTestId("added-rule"),

  ) {
    super(page)
    this.deleteDialog = new DeleteDiscountDialog(page);
    this.promotionRuleDialog = new PromotionRuleDialog(page);
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
      timeout: 10000,
    });
  }

  async clickAddRuleButton() {
    await this.page.getByTestId('add-rule').click();}

  async clickEditRuleButton(){
    await this.page.getByTestId('rule-edit-button').click();}

  async clickDeleteRuleButton() {
    await this.deleteRuleButton.click() }

  async openPromotionRuleModal() {
    await this.addRuleButton.click();
    await this.addRuleDialog.waitFor({
      state: "visible",
      timeout: 10000,
    });
  }
}
