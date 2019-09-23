import { Selector, t } from "testcafe";

export default class LoginPage {
  constructor() {
    this.email = Selector('[data-tc="email"]');
    this.password = Selector('[data-tc="password"]');
    this.submitButton = Selector('[data-tc="submit"]');
  }

  async performLogin(putEmail, putPassword) {
    await t
      .typeText(this.email, putEmail)
      .typeText(this.password, putPassword)
      .click(this.submitButton);
  }
}
