import { DISCOUNTS } from "@data/e2eTestData";
import { DiscountsPage } from "@pages/discountsPage";
import { expect, test } from "@playwright/test";
import faker from "faker";

test.use({ storageState: "playwright/.auth/admin.json" });
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
