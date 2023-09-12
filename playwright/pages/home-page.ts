import type {
  Locator,
  Page,
} from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.getByTestId("home-header");
  }
  async goto() {
    await this.page.goto("/");
  }
}
