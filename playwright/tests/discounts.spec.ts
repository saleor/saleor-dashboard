import { CATEGORIES, CHANNELS, COLLECTIONS, DISCOUNTS, PRODUCTS } from "@data/e2eTestData";
import { DiscountsPage } from "@pages/discountsPage";
import { expect, test } from "@playwright/test";
import faker from "faker";

test.use({ storageState: "./playwright/.auth/admin.json" });
let discounts: DiscountsPage;


test.beforeEach(({ page }) => {
  discounts = new DiscountsPage(page);
});

const discountType = ['Order', 'Catalog'];
  for (const type of discountType) {
    test(`TC: SALEOR_97 Create promotion with ${type} predicate @discounts @e2e`, async () => {
    const discountName = `${faker.lorem.word()}+${type}`;
    await discounts.gotoListView();
    await discounts.clickCreateDiscountButton();
    await discounts.typeDiscountName(discountName);
    await discounts.selectDiscountType(type);
    await discounts.typePromotionDescription(faker.lorem.sentence());
    await discounts.typeStartDate();
    await discounts.typeStartHour();
    await discounts.clickEndDateCheckbox();
    await discounts.typeEndDate();
    await discounts.typeEndHour();
    await discounts.clickSaveButton();
    await expect(discounts.successBanner).toBeVisible({ timeout: 10000 });
    await expect(discounts.pageHeader).toHaveText(discountName);
    await expect(discounts.discountTypeSelect).toHaveText(type);
    await expect(discounts.ruleSection).toHaveText("Add your first rule to set up a promotion");
  })};


test(`TC: SALEOR_98 Update existing promotion @discounts @e2e`, async () => {
  const newDiscountName = `${faker.lorem.word()}`;
  await discounts.gotoExistingDiscount(DISCOUNTS.promotionToBeEdited.id);
  await discounts.ruleSection.waitFor({
    state: "visible",
    timeout: 10000,
  });
  await expect(discounts.discountNameInput).toHaveValue(DISCOUNTS.promotionToBeEdited.name, {timeout: 30000});
  await discounts.discountNameInput.clear();
  await discounts.typeDiscountName(newDiscountName);
  await discounts.typePromotionDescription(faker.lorem.sentence());
  await discounts.typeStartDate();
  await discounts.typeStartHour();
  await discounts.clickEndDateCheckbox();
  await expect(discounts.endDateInput).not.toBeAttached();
  await expect(discounts.endHourInput).not.toBeAttached();
  await discounts.clickSaveButton();
  await expect(discounts.successBanner).toBeVisible({ timeout: 10000 });
  await expect(discounts.pageHeader).toHaveText(newDiscountName);
  await expect(discounts.discountTypeSelect).toHaveText(DISCOUNTS.promotionToBeEdited.type);
  })

const promotions = [DISCOUNTS.promotionWithoutRulesToBeDeleted, DISCOUNTS.promotionWithRulesToBeDeleted];
for (const promotion of promotions) {
  test(`TC: SALEOR_99 Delete existing ${promotion.name} @discounts @e2e`, async () => {
    await discounts.gotoExistingDiscount(promotion.id);
    await discounts.ruleSection.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await expect(discounts.discountNameInput).toHaveValue(promotion.name, {timeout: 30000});
    await discounts.clickDeleteButton();
    await discounts.deleteDialog.clickConfirmDeleteButton();
    await expect(discounts.successBanner).toBeVisible({ timeout: 10000 });
    })};

const promotion = DISCOUNTS.cataloguePromotion
const products = { promotionRule: "Products", predicateValue: PRODUCTS.e2eProductWithVariant1.name, predicate: PRODUCTS.e2eProductWithVariant1.name };
const categories = { promotionRule: "Categories", predicateValue: CATEGORIES.e2eCategory.name, predicate: CATEGORIES.e2eCategory.name };
const collections = { promotionRule: "Collections", predicateValue: COLLECTIONS.e2eCollection.name, predicate: COLLECTIONS.e2eCollection.name };
const variant = PRODUCTS.e2eProductWithVariant1.variantName
const productWithVariant = PRODUCTS.e2eProductWithVariant1.name
const productWithVariantName = `${ productWithVariant }` + ` - ` + `${ variant }`
const variants = {promotionRule: "Variants", predicateValue: `${productWithVariant}`, predicate: `${productWithVariantName}`}
const predicateValues = [categories, collections, products, variants];
const rewardValue = "10";
const channelName = CHANNELS.channelPLN.name
for (const { promotionRule, predicateValue, predicate } of predicateValues) {
  test(`TC: SALEOR_100 Create ${promotionRule} rule for ${predicate} in a catalogue promotion @discounts @e2e`, async () => {
    await discounts.gotoExistingDiscount(promotion.id);
    await discounts.ruleSection.waitFor({
    state: "visible",
    timeout: 10000,
  });
    const name = `Rule for ${promotionRule}`;
    await discounts.openPromotionRuleModal();
    await discounts.promotionRuleDialog.typePromotionRuleName(name);
    await discounts.promotionRuleDialog.typePromotionRuleDescription(faker.lorem.sentence());
    await discounts.promotionRuleDialog.selectSingleChannel(channelName);
    await discounts.promotionRuleDialog.selectPercentageRewardValueType()
    await discounts.promotionRuleDialog.typeRewardValue(rewardValue);
    await discounts.promotionRuleDialog.clickFirstAddRuleConditionButton();
    await discounts.promotionRuleDialog.clickRuleConditionPredicateDropdown();
    await discounts.promotionRuleDialog.selectPredicate(promotionRule);
    await discounts.promotionRuleDialog.selectRuleConditionValue(predicateValue);
    await discounts.promotionRuleDialog.selectPercentageRewardValueType()
    await discounts.promotionRuleDialog.typeRewardValue(rewardValue);
    await discounts.promotionRuleDialog.clickSaveRuleButton();
    await expect(discounts.successBanner).toBeVisible({ timeout: 10000 });
    await expect(discounts.existingRule.filter({ hasText: `Catalog rule: ${name}` })).toContainText(`Catalog rule: ${name}Discount of ${rewardValue}% on the purchase of ${promotionRule}: ${predicate} through the ${channelName}`)
    }
)};

const currency = CHANNELS.channelPLN.currency
const rewardValueFixed = "15.00"
const conditionLte = { conditionType: "lower", value: "50.00", conditionDesc: "lower than"}
const conditionGte = { conditionType: "greater", value: "20.00", conditionDesc: "greater than"}
const notEqConditions = [conditionLte, conditionGte]
const orderPromotion = DISCOUNTS.orderPromotion
for (const { conditionType, value, conditionDesc } of notEqConditions) {
  test(`TC: SALEOR_101 Create subtotal type rule with multiple conditions with ${conditionDesc} in order promotion @discounts @e2e`, async () => {
    await discounts.gotoExistingDiscount(orderPromotion.id);
    await discounts.ruleSection.waitFor({
    state: "visible",
    timeout: 10000,
  })
    const name = `Rule with multiple conditions with ${conditionDesc} in order promotion`;
    await discounts.openPromotionRuleModal();
    await discounts.promotionRuleDialog.typePromotionRuleName(name);
    await discounts.promotionRuleDialog.typePromotionRuleDescription(faker.lorem.sentence());
    await discounts.promotionRuleDialog.selectSingleChannel(channelName);
    await discounts.promotionRuleDialog.selectSubtotalDiscountType()
    await discounts.promotionRuleDialog.selectFixedRewardValueType()
    await discounts.promotionRuleDialog.typeRewardValue(rewardValueFixed);
    await discounts.promotionRuleDialog.clickFirstAddRuleConditionButton();
    await discounts.promotionRuleDialog.clickRuleConditionPredicateDropdown();
    await discounts.promotionRuleDialog.selectPredicate("Subtotal price");
    await discounts.promotionRuleDialog.selectRuleConditionType("is")
    await discounts.promotionRuleDialog.typeRuleConditionValue("100.00");
    await discounts.promotionRuleDialog.clickAnotherAddRuleConditionButton();
    await discounts.promotionRuleDialog.clickRuleConditionPredicateDropdown();
    await discounts.promotionRuleDialog.selectPredicate("Total price", 1);
    await discounts.promotionRuleDialog.selectRuleConditionType(conditionType)
    await discounts.promotionRuleDialog.typeRuleConditionValue(value, 1);
    await discounts.promotionRuleDialog.clickSaveRuleButton();
    await expect(discounts.successBanner).toBeVisible({ timeout: 10000 });
    await expect(discounts.existingRule.filter({ hasText: `Order rule: ${name}` })).toContainText(`Order rule: ${name}Discount of ${currency} ${rewardValueFixed} on the purchase of Subtotal price: ${currency} 100.00Total price: ${conditionDesc} ${currency} ${value} through the ${channelName}`)
  ;}
)}


const condition1 = { condition: "Subtotal", gte:"150.00", lte: "170.00"}
const condition2 = { condition: "Total", gte:"20.00", lte: "50.00"}
const conditionsBetween = [condition1, condition2]
for (const { condition, lte, gte } of conditionsBetween) {
  test(`TC: SALEOR_102 Create gift reward rule with ${condition} between ${gte} and ${lte} in order promotion @discounts @e2e`, async () => {
    await discounts.gotoExistingDiscount(orderPromotion.id);
    await discounts.ruleSection.waitFor({
      state: "visible",
      timeout: 10000,
    })
    const name = `Gift reward rule for ${condition} between ${gte} and ${lte}`;
    await discounts.openPromotionRuleModal();
    await discounts.promotionRuleDialog.typePromotionRuleName(name);
    await discounts.promotionRuleDialog.typePromotionRuleDescription(faker.lorem.sentence());
    await discounts.promotionRuleDialog.selectSingleChannel(channelName);
    await discounts.promotionRuleDialog.selectGiftRewardDiscountType()
    await discounts.promotionRuleDialog.selectGiftReward("Polo Shirt")
    await discounts.promotionRuleDialog.clickFirstAddRuleConditionButton();
    await discounts.promotionRuleDialog.clickRuleConditionPredicateDropdown();
    await discounts.promotionRuleDialog.selectPredicate(`${condition} price`);
    await discounts.promotionRuleDialog.selectRuleConditionType("between")
    await discounts.promotionRuleDialog.typeRuleConditionBoundaryValues(gte, lte);
    await discounts.promotionRuleDialog.clickSaveRuleButton();
    await expect(discounts.successBanner).toBeVisible({ timeout: 10000 });
    await expect(discounts.existingRule.filter({ hasText: `Order rule: ${name}` })).toContainText(
      `Order rule: ${name}Discount of Gift on the purchase of ${condition} price: PLN ${ gte }–${ lte } through the ${ channelName }`);
  }
  )
}
