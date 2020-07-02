import { Selector, t } from "testcafe";

export default class LoginPage {
  constructor() {
    this.email = Selector('[data-test="email"]');
    this.password = Selector('[data-test="password"]');
    this.submitButton = Selector('[data-test="submit"]');
  }

  async performLogin(putEmail, putPassword) {
    await t
      .typeText(this.email, putEmail)
      .typeText(this.password, putPassword)
      .click(this.submitButton);
  }
}
