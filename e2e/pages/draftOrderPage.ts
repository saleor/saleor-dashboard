import { expect, type Page } from "@playwright/test";

import { AddressDialog } from "./addressDialog.ts";

/**
 * A draft order, from creating it on either list to finalizing it. Ported from the
 * legacy `DraftOrdersPage`, `OrderCreateDialog` and `AddProductsDialog`, reworked for the
 * current customer flow: "Change customer" and then an address dialog, rather than a
 * customer search on the page itself.
 */
export class DraftOrderPage {
  readonly addressDialog = new AddressDialog(this.page);

  readonly dialog = this.page.getByRole("dialog");

  readonly createOrderButton = this.page.getByTestId("create-order-button");

  readonly createDraftButton = this.page.getByTestId("create-draft-order-button");

  readonly channelInput = this.page.getByTestId("channel-autocomplete");

  readonly option = this.page.getByTestId("select-option");

  readonly statusInfo = this.page.getByTestId("status-info");

  readonly addProductsButton = this.page.getByTestId("add-products-button");

  readonly productRow = this.page.getByTestId("product");

  readonly variantRow = this.page.getByTestId("variant");

  readonly confirmProductsButton = this.page.getByTestId("confirm-button");

  readonly changeCustomerButton = this.page.getByTestId("change-customer");

  readonly customerInput = this.page.getByTestId("select-customer");

  readonly customerSection = this.page.getByTestId("customer-email-section");

  readonly shippingAddressSection = this.page.getByTestId("shipping-address-section");

  readonly billingAddressSection = this.page.getByTestId("billing-address-section");

  readonly setShippingMethodButton = this.page.getByTestId("add-shipping-carrier");

  readonly shippingMethodSelect = this.page.getByTestId("shipping-method-select");

  readonly confirmShippingButton = this.page.getByTestId("confirm-button");

  readonly total = this.page.getByTestId("order-total");

  readonly discountToggle = this.page.getByTestId("discount-section-toggle");

  readonly summary = this.page.getByTestId("OrderSummary");

  readonly finalizeButton = this.page.getByTestId("button-bar-confirm");

  constructor(readonly page: Page) {}

  /** Both lists create the same draft; they differ only in where the button lives. */
  async create({ from, channel }: { from: "orders" | "drafts"; channel: string }) {
    if (from === "orders") {
      await this.page.goto("/orders");
      await this.createOrderButton.click();
    } else {
      await this.page.goto("/orders/drafts");
      await this.createDraftButton.click();
    }

    await this.channelInput.click();
    await this.option.filter({ hasText: channel }).click();
    await this.dialog.getByTestId("submit").click();
    await expect(this.statusInfo).toHaveText("Draft");
  }

  /**
   * Searches by name - the search does not match SKUs - and waits for the list to narrow to
   * that one product: until the search lands the list re-renders, and a checkbox ticked in
   * the unfiltered one is detached from under the click.
   */
  async addProduct({ name, sku }: { name: string; sku: string }) {
    await this.addProductsButton.click();
    await this.dialog.getByRole("textbox").fill(name);
    await expect(this.productRow).toHaveCount(1);
    await this.variantRow
      .filter({ hasText: `SKU ${sku}` })
      .getByRole("checkbox")
      .click();
    await this.confirmProductsButton.click();
    await this.dialog.waitFor({ state: "hidden" });
  }

  /**
   * Picks an existing customer, or types an email no customer has - the picker then offers
   * "Use email: ...". Either way the address dialog follows.
   */
  async assignCustomer(email: string) {
    await this.changeCustomerButton.click();
    await this.customerInput.fill(email);
    await this.option.filter({ hasText: email }).click();
    await this.dialog.getByTestId("submit").click();
  }

  async setFirstShippingMethod() {
    await this.setShippingMethodButton.click();
    await this.shippingMethodSelect.click();
    await this.option.filter({ hasNotText: "No shipping method" }).first().click();
    await this.confirmShippingButton.click();
    await this.dialog.waitFor({ state: "hidden" });
  }

  /** Lands on the order it became, which no longer lives under `/orders/drafts/`. */
  async finalize() {
    await this.finalizeButton.click();
    await this.page.waitForURL(url => !url.pathname.includes("/drafts/"));
  }
}
