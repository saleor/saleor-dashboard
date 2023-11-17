import { BasicApiService } from "@api/basics";
import { USERS } from "@data/e2eTestData";
import { URL_LIST } from "@data/url";
import { AccountSettingsPage } from "@pages/accountSettingsPage";
import { ConfigurationPage } from "@pages/configurationPage";
import { HomePage } from "@pages/homePage";
import { LoginPage } from "@pages/loginPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { SetUpNewPasswordPage } from "@pages/setUpNewPasswordPage";
import { StaffMembersPage } from "@pages/staffMembersPage";
import { expect, test } from "@playwright/test";

test.describe("Authenticated admin users", () => {
  test.use({ storageState: "playwright/.auth/admin.json" });

  test("TC: SALEOR_36 User should be able to invite staff member with full access permissions @basic-regression @staff-members", async ({
    page,
    request,
  }) => {
    const configurationPage = new ConfigurationPage(page);
    const staffMembersPage = new StaffMembersPage(page, request);
    const userEmail = `francesca${await staffMembersPage.basePage.getRandomInt(
      1000000,
    )}@gmail.com`;

    await page.goto(URL_LIST.configuration);
    await configurationPage.openStaffMembers();

    await staffMembersPage.clickInviteStaffMemberButton();
    await staffMembersPage.inviteStaffMembersDialog.typeNameLastNameAndEmail(
      "Francesca",
      "Leek",
      userEmail,
    );
    await staffMembersPage.inviteStaffMembersDialog.clickSendInviteButton();

    await staffMembersPage.clickPermissionsGroupSelectButton();
    await staffMembersPage.assignUserToPermissionGroup("Full Access");
    await staffMembersPage.clickSaveButton();
    await staffMembersPage.basePage.expectSuccessBanner();
    expect(await staffMembersPage.assignedPermissionGroups.count()).toEqual(1);
    expect(staffMembersPage.assignedPermissionGroups).toContainText(
      "Full Access",
    );

    const singleUserEmails =
      await staffMembersPage.mailpitService.getEmailsForUser(userEmail);

    await expect(singleUserEmails[0].Subject).toContain(
      "Set Your Dashboard Password",
    );
  });

  test("TC: SALEOR_37 Admin User should be able to deactivate other user @basic-regression @staff-members", async ({
    page,
    request,
  }) => {
    const staffMembersPage = new StaffMembersPage(page, request);
    const basicApiService = new BasicApiService(request);

    await page.goto(URL_LIST.staffMembers + USERS.userToBeDeactivated.id);
    await staffMembersPage.clickIsActiveCheckbox();
    await staffMembersPage.clickSaveButton();
    await staffMembersPage.basePage.expectSuccessBanner();
    await expect(await staffMembersPage.isActiveCheckbox.isChecked()).toEqual(
      false,
    );

    const loginViaApiDeactivatedUserResponse =
      await basicApiService.logInUserViaApi({
        email: USERS.userToBeDeactivated.email,
        password: process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
      });
    await expect(
      loginViaApiDeactivatedUserResponse.data.tokenCreate.errors[0].code,
    ).toEqual("INACTIVE");
  });

  test("TC: SALEOR_38 Admin User should be able to activate other user @basic-regression @staff-members", async ({
    page,
    request,
  }) => {
    const staffMembersPage = new StaffMembersPage(page, request);
    const basicApiService = new BasicApiService(request);

    await page.goto(URL_LIST.staffMembers + USERS.userToBeActivated.id);
    await staffMembersPage.clickIsActiveCheckbox();
    await staffMembersPage.clickSaveButton();
    await staffMembersPage.basePage.expectSuccessBanner();
    await expect(await staffMembersPage.isActiveCheckbox.isChecked()).toEqual(
      true,
    );

    const loginViaApiDeactivatedUserResponse =
      await basicApiService.logInUserViaApi({
        email: USERS.userToBeActivated.email,
        password: process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
      });
    await expect(
      loginViaApiDeactivatedUserResponse.data.tokenCreate.errors,
    ).toEqual([]);
    await expect(
      loginViaApiDeactivatedUserResponse.data.tokenCreate.token,
    ).not.toEqual(null);
  });
});

test.describe("Unauthenticated admin users", () => {
  test.use({ storageState: "playwright/.auth/unauthenticated-user.json" });

  test("TC: SALEOR_39 User should be able to reset password @daily @staff-members", async ({
    page,
    request,
  }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const setUpNewPasswordPage = new SetUpNewPasswordPage(page, request);
    const basicApiService = new BasicApiService(request);

    await page.goto("/");
    await loginPage.clickResetPasswordLink();
    await loginPage.typeEmail(USERS.userForPasswordReset.email);
    await loginPage.clickSendEmailWithResetLinkButton();
    await loginPage.clickBackToLoginPageButton();
    await loginPage.emailInput.waitFor({ state: "visible" });
    await setUpNewPasswordPage.gotoUserResetPasswordPage(
      USERS.userForPasswordReset.email,
    );
    await setUpNewPasswordPage.typePassword(
      USERS.userForPasswordReset.newPassword,
    );
    await setUpNewPasswordPage.typeConfirmedPassword(
      USERS.userForPasswordReset.newPassword,
    );
    await setUpNewPasswordPage.clickSetNewPasswordButton();
    await expect(homePage.welcomeMessage).toBeVisible({ timeout: 10000 });
    await expect(homePage.welcomeMessage).toContainText(
      `${USERS.userForPasswordReset.name} ${USERS.userForPasswordReset.lastName}`,
    );

    const userWithNewPasswordLoginResponse =
      await basicApiService.logInUserViaApi({
        email: USERS.userForPasswordReset.email,
        password: USERS.userForPasswordReset.newPassword,
      });
    await expect(
      userWithNewPasswordLoginResponse.data.tokenCreate.errors,
    ).toEqual([]);
    await expect(
      userWithNewPasswordLoginResponse.data.tokenCreate.token,
    ).not.toEqual(null);
  });
});

test.describe("Admin which log in via UI", () => {
  // Reset storage state for this file to avoid being authenticated
  test.use({ storageState: { cookies: [], origins: [] } });

  test("TC: SALEOR_40 User should be able to change password @daily @staff-members", async ({
    page,
    request,
  }) => {
    const loginPage = new LoginPage(page);
    const mainMenuPage = new MainMenuPage(page);
    const accountSettingsPage = new AccountSettingsPage(page);
    const basicApiService = new BasicApiService(request);

    await loginPage.basicUiLogin(
      USERS.userForPasswordChange.email,
      process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    );
    await mainMenuPage.gotoAccountSettings();
    await accountSettingsPage.clickChangePasswordButton();
    await accountSettingsPage.typeOldAndNewPasswords(
      process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
      USERS.userForPasswordChange.newPassword,
    );
    await accountSettingsPage.clickSaveChangedPasswordButton();
    await accountSettingsPage.clickSaveButton();
    await accountSettingsPage.basePage.expectSuccessBanner();

    const userWithNewPasswordLoginResponse =
      await basicApiService.logInUserViaApi({
        email: USERS.userForPasswordChange.email,
        password: USERS.userForPasswordChange.newPassword,
      });
    await expect(
      userWithNewPasswordLoginResponse.data.tokenCreate.errors,
    ).toEqual([]);
    await expect(
      userWithNewPasswordLoginResponse.data.tokenCreate.token,
    ).not.toEqual(null);
  });
});
