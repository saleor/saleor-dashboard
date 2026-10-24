import { expect, test } from "../../fixtures/test.ts";
import { type AddressFields } from "../../pages/addressDialog.ts";
import { DraftOrderPage } from "../../pages/draftOrderPage.ts";
import { CHANNEL, CUSTOMER, ORDERS_SCENARIO, PRODUCTS } from "../../scenarios/orders.ts";

/**
 * Staff taking an order by hand: a draft, a line, a customer, a shipping method, finalized
 * into an order. Replaces legacy SALEOR_28, 76 and 84 - one flow reached from two lists -
 * and SALEOR_217.
 *
 * Each test is one story with a step per stage, so a failure names the stage it broke in.
 */
test.use({ scenario: ORDERS_SCENARIO });

test("Staff creates an order for an existing customer and finalizes it #e2e", async ({ page }) => {
  // Arrange
  const draft = new DraftOrderPage(page);

  // Act & Assert
  await test.step("create a draft from the orders list", () =>
    draft.create({ from: "orders", channel: CHANNEL.name }));

  await test.step("add a product", async () => {
    await draft.addProduct(PRODUCTS.tee);
    await expect(draft.total).not.toHaveText("0.00");
  });

  await test.step("assign the customer and their saved address", async () => {
    await draft.assignCustomer(CUSTOMER.email);
    await draft.addressDialog.useCustomerAddress();
    await expect(draft.customerSection).toContainText(CUSTOMER.email);
    await expect(draft.shippingAddressSection).toContainText(CUSTOMER.lastName);
    await expect(draft.billingAddressSection).toContainText(CUSTOMER.lastName);
  });

  await test.step("set a shipping method", () => draft.setFirstShippingMethod());

  await test.step("finalize into an unfulfilled order", async () => {
    await draft.finalize();
    await expect(draft.statusInfo).toHaveText("Unfulfilled");
  });
});

test("Staff creates an order for a new customer email #e2e", async ({ page }) => {
  // Arrange
  const draft = new DraftOrderPage(page);
  const email = "new.customer@example.com";
  const address: AddressFields = {
    firstName: "Grace",
    lastName: "Hopper",
    streetAddress1: "1 Main Street",
    city: "New York",
    postalCode: "10001",
    country: "United States of America",
    countryArea: "New York",
  };

  // Act & Assert
  await test.step("create a draft from the drafts list", () =>
    draft.create({ from: "drafts", channel: CHANNEL.name }));

  await test.step("add a product", () => draft.addProduct(PRODUCTS.tee));

  await test.step("assign an email no customer has, with a new address", async () => {
    await draft.assignCustomer(email);
    await draft.addressDialog.fillNewAddress(address);
    await draft.addressDialog.sameForBillingCheckbox.check();
    await draft.addressDialog.save();
    await expect(draft.customerSection).toContainText(email);
    await expect(draft.shippingAddressSection).toContainText(address.streetAddress1);
    await expect(draft.billingAddressSection).toContainText(address.streetAddress1);
  });

  await test.step("set a shipping method", () => draft.setFirstShippingMethod());

  await test.step("finalize into an unfulfilled order", async () => {
    await draft.finalize();
    await expect(draft.statusInfo).toHaveText("Unfulfilled");
    await expect(draft.customerSection).toContainText(email);
  });
});
