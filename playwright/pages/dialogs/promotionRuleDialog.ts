import type { Page } from "@playwright/test";

export class PromotionRuleDialog {
  readonly page: Page;
  constructor(
    page: Page,
    readonly ruleNameInput = page.getByTestId("rule-name-input"),
    readonly ruleChannelDropdown = page.getByText("Channel", { exact: true }),
    readonly ruleChannelDropdownOptions = page.getByRole("listbox"),
    readonly selectOption = page.getByTestId("select-option"),
    readonly ruleDescriptionInput = page.getByTestId("rich-text-editor-rule-description"),
    readonly addRuleConditionButton = page.getByTestId("add-condition-button"),
    readonly addRuleConditionSection = page.getByTestId("conditions-section"),
    readonly addRuleConditionPredicateDropdown = page.getByTestId(
      "rule-condition-predicate-dropdown",
    ),
    readonly addRuleConditionTypeDropdown = page.getByTestId("rule-condition-type-dropdown"),
    readonly addRuleConditionValueDropdown = page.getByTestId("rule-condition-value-dropdown"),
    readonly rewardTypeSelect = page.getByTestId("reward-type-select"),
    readonly rewardValueInput = page.getByTestId("reward-value-input"),
    readonly rewardGiftSelect = page.getByTestId("reward-gifts-select"),
    readonly percentageRewardValueTypeOption = page.getByTestId("percentage-reward-value-type"),
    readonly fixedRewardValueTypeOption = page.getByTestId("fixed-reward-value-type"),
    readonly saveRuleButton = page.getByTestId("saveRuleButton"),
    readonly ruleConfirmationButton = page.getByTestId("saveRuleButton"),
    readonly gteConditionValueInput = page.getByTestId("condition-value-0").first(),
    readonly lteConditionValueInput = page.getByTestId("condition-value-0").last(),
    readonly ruleConditionRow = page.getByTestId("rule-condition-row"),
  ) {
    this.page = page;
  }

  async typePromotionRuleDescription(description: string) {
    await this.ruleDescriptionInput.locator('[contenteditable="true"]').fill(description);
  }

  async clickChannelsDropdown() {
    await this.ruleChannelDropdown.click();
  }

  async selectSingleChannel(channel: string) {
    await this.clickChannelsDropdown();
    await this.page.getByTestId("select-option").getByText(channel).click();
  }

  async typePromotionRuleName(name: string) {
    await this.ruleNameInput.fill(name);
  }

  async clickAddRuleConditionButton() {
    await this.addRuleConditionButton.click({ force: true });
    await this.ruleConditionRow.last().waitFor({
      state: "visible",
      timeout: 10000,
    });
  }

  async removeExistingGiftReward(giftRewardId: string, index = 0) {
    await this.page.getByTestId(`selected-option-${giftRewardId}-${index}`).getByText("✕").click();
  }

  async selectPercentageRewardValueType() {
    await this.percentageRewardValueTypeOption.click();
  }

  async selectFixedRewardValueType() {
    await this.fixedRewardValueTypeOption.click();
  }

  async selectOrderRewardType(type: string) {
    await this.rewardTypeSelect.click();
    await this.selectOption.filter({ hasText: type }).click();
  }

  async selectSubtotalDiscountType() {
    await this.selectOrderRewardType("Subtotal Discount");
  }

  async selectGiftRewardDiscountType() {
    await this.selectOrderRewardType("Gift");
  }

  async typeRewardValue(value: string) {
    await this.rewardValueInput.fill(value);
  }

  async selectPredicate(predicate: string, index = 0) {
    await this.page.getByTestId(`condition-name-${index}`).click();
    await this.page.getByRole("option", { name: predicate, exact: true }).click();
  }

  async selectRuleConditionType(type: string) {
    await this.addRuleConditionTypeDropdown.last().click();
    await this.page.getByTestId("select-option").filter({ hasText: type }).click();
  }

  async typeRuleConditionValue(value: string, index = 0) {
    await this.page.getByTestId(`condition-value-${index}`).fill(value);
  }

  async typeRuleConditionBoundaryValues(gte: string, lte: string) {
    await this.gteConditionValueInput.fill(gte);
    await this.lteConditionValueInput.fill(lte);
  }

  async clickRuleConditionPredicateDropdown() {
    await this.addRuleConditionPredicateDropdown.last().click();
    await this.page.getByRole("listbox").waitFor({
      state: "visible",
      timeout: 10000,
    });
  }

  async selectGiftReward(giftName: string) {
    await this.rewardGiftSelect.fill(giftName);
    await this.page.getByText(giftName).first().click();
  }

  async selectRuleConditionValue(name: string) {
    await this.page.getByTestId("condition-value-0").click();
    await this.page.getByRole("option", { name }).first().click();
  }

  async clickSaveRuleButton() {
    await this.saveRuleButton.click();
  }

  async clickSaveEditedRuleButton() {
    await this.ruleConfirmationButton.click();
  }
}
