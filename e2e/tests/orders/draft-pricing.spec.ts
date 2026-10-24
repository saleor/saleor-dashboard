import { expect, test } from "../../fixtures/test.ts";
import { DraftOrderPage } from "../../pages/draftOrderPage.ts";
import { CHANNEL, ORDERS_SCENARIO, PRODUCTS, PROMOTIONS } from "../../scenarios/orders.ts";

/**
 * Replaces legacy SALEOR_215 (a catalogue promotion discounts a draft line) and SALEOR_216
 * (an order promotion discounts a draft once its subtotal qualifies) as one story: the
 * second only means something on top of the first.
 */
test.use({ scenario: ORDERS_SCENARIO });

const money = (amount: number) => amount.toFixed(2);

test("Draft totals apply catalogue and order promotions #e2e", async ({ page }) => {
  // Arrange
  const draft = new DraftOrderPage(page);
  const teePrice = PRODUCTS.tee.price;
  const hoodiePrice = PRODUCTS.hoodie.price;
  const teeDiscount = (teePrice * PROMOTIONS.catalogue.percent) / 100;
  const subtotal = teePrice - teeDiscount + hoodiePrice;
  const orderDiscount = (subtotal * PROMOTIONS.order.percent) / 100;

  // Guards the arithmetic below: the first line alone must not qualify, both together must.
  expect(teePrice - teeDiscount).toBeLessThan(PROMOTIONS.order.subtotalAtLeast);
  expect(subtotal).toBeGreaterThanOrEqual(PROMOTIONS.order.subtotalAtLeast);

  await draft.create({ from: "drafts", channel: CHANNEL.name });

  // Act & Assert
  await test.step("a line on catalogue promotion is discounted", async () => {
    await draft.addProduct(PRODUCTS.tee);
    await expect(draft.total).toHaveText(money(teePrice - teeDiscount));
    await expect(draft.discountToggle).toContainText(money(teeDiscount));
  });

  await test.step("crossing the subtotal threshold applies the order promotion", async () => {
    await draft.addProduct(PRODUCTS.hoodie);
    await expect(draft.total).toHaveText(money(subtotal - orderDiscount));
    await expect(draft.discountToggle).toContainText(money(teeDiscount + orderDiscount));
  });

  await test.step("the discount breakdown names both promotions' shares", async () => {
    await draft.discountToggle.click();
    await expect(draft.summary).toContainText(PROMOTIONS.order.name);
    await expect(draft.summary).toContainText(money(orderDiscount));
    await expect(draft.summary).toContainText(money(teeDiscount));
  });
});
