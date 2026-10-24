import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";

export class OrderSettingsPage extends BasePage {
  constructor(
    page: Page,
    readonly stockReservationForAuthUserInput = page.getByTestId(
      "reserve-stock-duration-for-auth-user-input",
    ),
    readonly stockReservationForAnonUserInput = page.getByTestId(
      "reserve-stock-duration-for-anon-user-input",
    ),
    readonly stockReservationForAuthUserCheckbox = page.getByTestId(
      "reserve-stock-duration-for-auth-user-checkbox",
    ),
    readonly stockReservationForAnonUserCheckbox = page.getByTestId(
      "reserve-stock-duration-for-anon-user-checkbox",
    ),
    readonly checkoutLineLimitInput = page.getByTestId("checkout-limits-input"),
  ) {
    super(page);
  }

  async gotoOrderSettings() {
    await this.page.goto(URL_LIST.orderSettings);
  }

  async enableStockReservations(): Promise<void> {
    await this.stockReservationForAuthUserCheckbox.check();
    await this.stockReservationForAnonUserCheckbox.check();
  }

  async fillStockReservationForAuthUser(value: string) {
    await this.stockReservationForAuthUserInput.fill(value);
  }

  async fillStockReservationForAnonUser(value: string) {
    await this.stockReservationForAnonUserInput.fill(value);
  }

  async fillCheckoutLineLimitInput(value: string) {
    await this.checkoutLineLimitInput.fill(value);
  }
}
