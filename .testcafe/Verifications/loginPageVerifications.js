import LoginPage from "../Models/loginPageModel";
import HomePage from "../Models/homePageModel";
import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD } from "../Data/userData";

const loginPage = new LoginPage();
const homePage = new HomePage();

export function verifyEmailAndPasswordDisplayed() {
  test("Verify that Email and Password are displayed", async t => {
    await t.expect(loginPage.email.exists).ok();
    await t.expect(loginPage.password.exists).ok();
  });
}

export function verifyIfUserCanLogin() {
  test("PerformLogin", async t => {
    await loginPage.performLogin(DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD);
    await t.expect(homePage.header.exists).ok();
  });
}
