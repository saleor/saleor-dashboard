// @ts-check

import { LOGIN_SELECTORS } from "cypress/elements/account/login-selectors";
import { urlList } from "cypress/fixtures/urlList";

describe("User authorization", () => {
  let page;

  it("should successfully log in a user @login, @allEnv, @stable, @oldRelease", async () => {
    await page.goto(urlList.homePage);
    await page.fill(LOGIN_SELECTORS.emailAddressInput, "USER_NAME"); //TODO: stworzyć .env i tam dać
    await page.fill(LOGIN_SELECTORS.emailPasswordInput, "USER_PASS");
    await page.click(LOGIN_SELECTORS.signInButton);
    await page.waitForSelector(LOGIN_SELECTORS.welcomePage);
  });
});
