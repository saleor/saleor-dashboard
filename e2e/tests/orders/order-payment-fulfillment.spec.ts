import { e2eConfig } from "../../config.ts";
import { expect, test } from "../../fixtures/test.ts";
import { OrderPage } from "../../pages/orderPage.ts";
import { findOrderId, ORDERS_SCENARIO } from "../../scenarios/orders.ts";

/**
 * What happens to an order after it is placed. Replaces legacy SALEOR_77 and 80 (paid,
 * fulfilled, tracked - one lifecycle), SALEOR_78 (partial manual captures) and SALEOR_81
 * and 82 (address edits either side of fulfillment). SALEOR_79, the same lifecycle on the
 * deprecated payment (`Payment` object) flow, is deliberately not ported.
 */
test.use({ scenario: ORDERS_SCENARIO });

const config = e2eConfig();

test("Mark as paid, fulfill and add tracking #e2e", async ({ page }) => {
  // Arrange
  const orderPage = new OrderPage(page);

  await orderPage.goto(await findOrderId(config, "unpaid"));

  // Act & Assert
  await test.step("mark as paid", async () => {
    await orderPage.markAsPaid("e2e-reference");
    await expect(orderPage.paymentStatusBadges).toContainText("Fully charged");
    await expect(orderPage.transactions).toContainText("Mark-as-paid transaction");
  });

  await test.step("fulfill", async () => {
    await orderPage.fulfillAll();
    await expect(orderPage.statusInfo).toHaveText("Fulfilled");
  });

  await test.step("add tracking", async () => {
    await orderPage.addTracking("TRACK-123");
    await expect(orderPage.trackingNumber).toContainText("TRACK-123");
  });
});

test("Manual captures charge an order in parts #e2e", async ({ page }) => {
  // Arrange
  const orderPage = new OrderPage(page);

  await orderPage.goto(await findOrderId(config, "unpaid"));

  // Read rather than computed: the scenario's shipping method has a seeded, random price.
  const total = await orderPage.readTotal();
  const firstPart = 1;

  // Act & Assert
  await test.step("a capture below the total leaves the order partly charged", async () => {
    await orderPage.captureManually({ description: "first part", amount: firstPart });
    await expect(orderPage.paymentStatusBadges).toContainText("Not fully charged");
    await expect(orderPage.statusInfo).toHaveText("Unfulfilled");
  });

  await test.step("capturing the rest charges it fully", async () => {
    await orderPage.captureManually({ description: "second part", amount: total - firstPart });
    await expect(orderPage.paymentStatusBadges).toContainText("Fully charged");
    await expect(orderPage.transactions.getByText("Manual capture")).toHaveCount(2);
  });
});

test("Addresses stay editable before and after fulfillment #e2e", async ({ page }) => {
  // Arrange
  const orderPage = new OrderPage(page);
  const change = { firstName: "Grace", streetAddress1: "1 Main Street" };

  // Act & Assert
  await test.step("shipping address of an unfulfilled order", async () => {
    await orderPage.goto(await findOrderId(config, "unpaid"));
    await orderPage.editShippingAddressButton.click();
    await orderPage.addressDialog.changeAddress(change);
    await expect(orderPage.shippingAddressSection).toContainText(change.streetAddress1);
    await expect(orderPage.billingAddressSection).not.toContainText(change.streetAddress1);
  });

  await test.step("billing address of a fulfilled order", async () => {
    await orderPage.goto(await findOrderId(config, "fulfilled"));
    await expect(orderPage.statusInfo).toHaveText("Fulfilled");
    await orderPage.editBillingAddressButton.click();
    await orderPage.addressDialog.changeAddress(change);
    await expect(orderPage.billingAddressSection).toContainText(change.streetAddress1);
    await expect(orderPage.shippingAddressSection).not.toContainText(change.streetAddress1);
  });
});
