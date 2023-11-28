/// <reference types="cypress"/>
/// <reference types="../support"/>

import faker from "faker";

import {
  BUTTON_SELECTORS,
  HOMEPAGE_SELECTORS,
  INVITE_STAFF_MEMBER_FORM_SELECTORS,
  SHARED_ELEMENTS,
  STAFF_MEMBER_DETAILS_SELECTORS,
  STAFF_MEMBERS_LIST_SELECTORS,
} from "../elements/";
import { LOGIN_SELECTORS } from "../elements/account/login-selectors";
import { MESSAGES, TEST_ADMIN_USER, urlList } from "../fixtures";
import { userDetailsUrl } from "../fixtures/urlList";
import { activatePlugin, updatePlugin } from "../support/api/requests/";
import {
  getMailActivationLinkForUser,
  getMailActivationLinkForUserAndSubject,
  inviteStaffMemberWithFirstPermission,
} from "../support/api/utils/";
import { ensureCanvasStatic } from "../support/customCommands/sharedElementsOperations/canvas";
import {
  expectMainMenuAvailableSections,
  expectWelcomeMessageIncludes,
  fillUpOnlyUserDetails,
  fillUpSetPassword,
  fillUpUserDetailsAndAddFirstPermission,
} from "../support/pages/";

describe("Staff members", () => {
  const startsWith = "StaffMembers" + Date.now();
  const password = Cypress.env("USER_PASSWORD");
  const lastName = faker.name.lastName();
  const email = `${startsWith}${lastName}@example.com`;

  let user;

  before(() => {
    cy.loginUserViaRequest();
    activatePlugin({ id: "mirumee.notifications.admin_email" });
    inviteStaffMemberWithFirstPermission({ email })
      .then(({ user: userResp }) => {
        user = userResp;
        getMailActivationLinkForUser(email);
      })
      .then(urlLink => {
        cy.clearSessionData().visit(urlLink);
        fillUpSetPassword(password);
        cy.clearSessionData();
        cy.checkIfDataAreNotNull({ user });
      });
  });

  beforeEach(() => {
    cy.loginUserViaRequest();
  });

  it(
    "should be able to invite staff user. TC: SALEOR_3501",
    { tags: ["@staffMembers", "@allEnv", "@critical"] },
    () => {
      const firstName = faker.name.firstName();
      const emailInvite = `${startsWith}${firstName}@example.com`;

      cy.visit(urlList.staffMembers);
      ensureCanvasStatic(SHARED_ELEMENTS.dataGridTable);
      cy.get(STAFF_MEMBERS_LIST_SELECTORS.inviteStaffMemberButton).click({
        force: true,
      });
      fillUpUserDetailsAndAddFirstPermission(firstName, lastName, emailInvite);
      getMailActivationLinkForUser(emailInvite).then(urlLink => {
        cy.clearSessionData().visit(urlLink);
        fillUpSetPassword(password);
        expectWelcomeMessageIncludes(`${firstName} ${lastName}`);
      });
    },
  );

  it(
    "should remove user permissions. TC: SALEOR_3504",
    { tags: ["@staffMembers", "@allEnv"] },
    () => {
      const serverStoredEmail = email.toLowerCase();

      cy.visit(userDetailsUrl(user.id))
        .get(STAFF_MEMBER_DETAILS_SELECTORS.removePermissionButton)
        .click()
        .addAliasToGraphRequest("StaffMemberUpdate")
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .waitForRequestAndCheckIfNoErrors("@StaffMemberUpdate")
        .clearSessionData()
        .loginUserViaRequest("auth", { email, password })
        .visit(urlList.homePage);
      expectWelcomeMessageIncludes(serverStoredEmail);
      expectMainMenuAvailableSections(1);
      cy.get(HOMEPAGE_SELECTORS.activity).should("not.exist");
      cy.get(HOMEPAGE_SELECTORS.topProducts).should("not.exist");
    },
  );

  it(
    "should reset password. TC: SALEOR_3505",
    { tags: ["@staffMembers", "@allEnv", "@critical"] },
    () => {
      const newPassword = faker.random.alphaNumeric(8);
      updatePlugin(
        "mirumee.notifications.admin_email",
        "staff_password_reset_subject",
        "Reset",
      )
        .then(() => {
          cy.clearSessionData()
            .visit(urlList.homePage)
            .get(LOGIN_SELECTORS.resetPasswordLink)
            .click()
            .get(LOGIN_SELECTORS.emailAddressInput)
            .type(email)
            .get(BUTTON_SELECTORS.submit)
            .click();
          getMailActivationLinkForUserAndSubject(email, "Reset");
        })
        .then(link => {
          cy.visit(link)
            .get(LOGIN_SELECTORS.emailPasswordInput)
            .type(newPassword)
            .get(LOGIN_SELECTORS.confirmPassword)
            .type(newPassword)
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .get(LOGIN_SELECTORS.welcomePage)
            .should("be.visible")
            .loginUserViaRequest({ email, password: newPassword });
        });
    },
  );

  it(
    "should not be able to create staff member with not unique email. TC: SALEOR_3508 - should not be migrated to playwright as critical",
    { tags: ["@staffMembers", "@allEnv", "@critical"] },
    () => {
      const firstName = faker.name.firstName();
      const emailInvite = TEST_ADMIN_USER.email;
      cy.visit(urlList.staffMembers);
      ensureCanvasStatic(SHARED_ELEMENTS.dataGridTable);
      cy.get(STAFF_MEMBERS_LIST_SELECTORS.inviteStaffMemberButton).click({
        force: true,
      });
      fillUpOnlyUserDetails(firstName, lastName, emailInvite);
      cy.get(INVITE_STAFF_MEMBER_FORM_SELECTORS.emailValidationMessage).should(
        "be.visible",
      );
      cy.get(BUTTON_SELECTORS.dialogBackButton).click();
      cy.confirmationErrorMessageShouldAppear();
    },
  );

  it(
    "should not be able to update staff member with not unique email. TC: SALEOR_3509",
    { tags: ["@staffMembers", "@allEnv"] },
    () => {
      cy.addAliasToGraphRequest("StaffList");
      cy.visit(urlList.staffMembers)
        .waitForRequestAndCheckIfNoErrors("@StaffList")
        .get(SHARED_ELEMENTS.searchInput)
        .type(`${email} {enter}`)
        .waitForRequestAndCheckIfNoErrors("@StaffList");
      cy.get(SHARED_ELEMENTS.dataGridTable)
        .contains(email.toLowerCase())
        .should("exist");
      // selects first row
      cy.clickGridCell(0, 0);
      cy.get(STAFF_MEMBER_DETAILS_SELECTORS.staffEmail)
        .click()
        .clear()
        .type(`${TEST_ADMIN_USER.email} {enter}`)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationErrorMessageShouldAppear();
      cy.contains(MESSAGES.invalidEmailAddress).should("be.visible");
    },
  );

  // Test blocked by https://github.com/saleor/saleor-dashboard/issues/2847
  it.skip(
    "should update staff member name and email. TC: SALEOR_3507",
    { tags: ["@staffMembers", "@allEnv"] },
    () => {
      const newLastName = faker.name.lastName();
      const newEmail = `${startsWith}${newLastName}@example.com`;
      const changedName = faker.name.lastName();
      const changedEmail = `${startsWith}${changedName}@example.com`;

      inviteStaffMemberWithFirstPermission({ email: newEmail })
        .then(({ user: userResp }) => {
          user = userResp;
          getMailActivationLinkForUser(newEmail);
        })
        .then(urlLink => {
          cy.clearSessionData().visit(urlLink);
          fillUpSetPassword(password);
          cy.clearSessionData();
        });

      cy.clearSessionData().loginUserViaRequest("auth", {
        email: newEmail,
        password: Cypress.env("USER_PASSWORD"),
      });

      cy.visit(urlList.staffMembers).get(LOGIN_SELECTORS.userMenu).click();
      cy.get(LOGIN_SELECTORS.accountSettings).click();
      cy.get(STAFF_MEMBER_DETAILS_SELECTORS.staffFirstName)
        .clear()
        .type("สมชาย");
      cy.get(STAFF_MEMBER_DETAILS_SELECTORS.staffLastName)
        .clear()
        .type(newLastName);
      cy.get(STAFF_MEMBER_DETAILS_SELECTORS.staffEmail)
        .clear()
        .type(changedEmail);

      // Test blocked from this point by https://github.com/saleor/saleor-dashboard/issues/2847
      cy.get(BUTTON_SELECTORS.confirm).confirmationMessageShouldAppear();
      cy.clearSessionData().loginUserViaRequest("auth", {
        email: changedEmail,
        password: Cypress.env("USER_PASSWORD"),
      });

      cy.visit(urlList.staffMembers);
      expectWelcomeMessageIncludes(`${changedName}`);
    },
  );

  it(
    "should create new user and successfully change password. TC: SALEOR_3510",
    { tags: ["@staffMembers", "@allEnv", "@critical"] },
    () => {
      const newPass = "newTestPass";
      const newLastName = faker.name.lastName();
      const newEmail = `${startsWith}${newLastName}@example.com`;

      inviteStaffMemberWithFirstPermission({ email: newEmail })
        .then(({ user: userResp }) => {
          user = userResp;
          getMailActivationLinkForUser(newEmail);
        })
        .then(urlLink => {
          cy.clearSessionData().visit(urlLink);
          fillUpSetPassword(password);
          cy.clearSessionData();
        });

      cy.clearSessionData().loginUserViaRequest("auth", {
        email: newEmail,
        password: Cypress.env("USER_PASSWORD"),
      });

      cy.visit(urlList.staffMembers).get(LOGIN_SELECTORS.userMenu).click();
      cy.get(LOGIN_SELECTORS.accountSettings).click();
      cy.get(STAFF_MEMBER_DETAILS_SELECTORS.changePasswordBtn).should(
        "be.visible",
      );
      // there is small bug which keep control panel opens and block any interaction via cypress - it does not affect real user - click on body can be removed when this pr is done https://github.com/saleor/saleor-dashboard/issues/3675
      cy.get(SHARED_ELEMENTS.body).click({ force: true });
      cy.get(STAFF_MEMBER_DETAILS_SELECTORS.changePasswordBtn).click();
      cy.get(
        STAFF_MEMBER_DETAILS_SELECTORS.changePasswordModal.oldPassword,
      ).type(Cypress.env("USER_PASSWORD"));
      cy.get(
        STAFF_MEMBER_DETAILS_SELECTORS.changePasswordModal.newPassword,
      ).type(newPass);
      cy.addAliasToGraphRequest("ChangeUserPassword")
        .get(BUTTON_SELECTORS.submit)
        .click()
        .confirmationMessageShouldAppear()
        .waitForRequestAndCheckIfNoErrors("@ChangeUserPassword");

      cy.clearSessionData().loginUserViaRequest("auth", {
        email: newEmail,
        password: newPass,
      });
      cy.visit(urlList.homePage)
        .get(HOMEPAGE_SELECTORS.welcomeMessage)
        .should("be.visible");
      cy.get(HOMEPAGE_SELECTORS.activity).should("be.visible");
      cy.get(HOMEPAGE_SELECTORS.topProducts).should("be.visible");
    },
  );
});
