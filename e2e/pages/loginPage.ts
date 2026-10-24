import { type Page } from "@playwright/test";

import { HomePage } from "./homePage.ts";

/** Ported from the legacy suite; locators unchanged. */
export class LoginPage {
  readonly emailInput = this.page.getByTestId("email");

  readonly passwordInput = this.page.getByTestId("password");

  readonly signInButton = this.page.getByTestId("submit");

  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  async loginViaUI(email: string, password: string) {
    await this.goto();
    await this.emailInput.waitFor({ state: "visible" });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    /*
     * Asserted on the sidebar rather than on a name or an email: the seed's staff users
     * differ per Saleor image, and the point of this check is that the session took.
     */
    await new HomePage(this.page).expectSignedIn();
  }
}
