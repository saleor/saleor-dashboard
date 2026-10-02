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
    readonly checkoutLineLimitInput = page.getByTestId("checkout-limits-input"),
  ) {
    super(page);
  }

  async gotoOrderSettings() {
    await this.page.goto(URL_LIST.orderSettings);
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
