/// <reference types="cypress"/>
/// <reference types="../support"/>

import faker from "faker";

import { LEFT_MENU_SELECTORS } from "../elements/account/left-menu/left-menu-selectors";
import { LOGIN_SELECTORS } from "../elements/account/login-selectors";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../elements/shared/sharedElements";
import { STAFF_MEMBER_DETAILS } from "../elements/staffMembers/staffMemberDetails";
import { STAFF_MEMBERS_LIST } from "../elements/staffMembers/staffMembersList";
import { urlList, userDetailsUrl } from "../fixtures/urlList";
import { TEST_ADMIN_USER } from "../fixtures/users";
import { activatePlugin, updatePlugin } from "../support/api/requests/Plugins";
import {
  deleteStaffMembersStartsWith,
  updateStaffMember,
} from "../support/api/requests/StaffMembers";
import {
  getMailActivationLinkForUser,
  getMailActivationLinkForUserAndSubject,
  inviteStaffMemberWithFirstPermission,
} from "../support/api/utils/users";
import { expectWelcomeMessageIncludes } from "../support/pages/homePage";
import { getDisplayedSelectors } from "../support/pages/permissionsPage";
import {
  fillUpOnlyUserDetails,
  fillUpSetPassword,
  fillUpUserDetailsAndAddFirstPermission,
  updateUserActiveFlag,
} from "../support/pages/userPage";

describe("Staff members", () => {
  const startsWith = "StaffMembers";
  const password = Cypress.env("USER_PASSWORD");
  const lastName = faker.name.lastName();
  const email = `${startsWith}${lastName}@example.com`;

  let user;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteStaffMembersStartsWith(startsWith);
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
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should be able to invite staff user. TC: SALEOR_3501",
    { tags: ["@staffMembers", "@stagedOnly", "@allenv"] },
    () => {
      const firstName = faker.name.firstName();
      const emailInvite = `${startsWith}${firstName}@example.com`;

      cy.visit(urlList.staffMembers)
        .expectSkeletonIsVisible()
        .get(STAFF_MEMBERS_LIST.inviteStaffMemberButton)
        .click({ force: true });
      fillUpUserDetailsAndAddFirstPermission(firstName, lastName, emailInvite);
      getMailActivationLinkForUser(emailInvite).then(urlLink => {
        cy.clearSessionData().visit(urlLink);
        fillUpSetPassword(password);
        expectWelcomeMessageIncludes(`${firstName} ${lastName}`);
      });
    },
  );

  it(
    "should deactivate user. TC: SALEOR_3502",
    { tags: ["@staffMembers", "@stagedOnly", "@allenv"] },
    () => {
      updateStaffMember({ userId: user.id, isActive: true });
      updateUserActiveFlag(user.id);
      cy.clearSessionData()
        .loginUserViaRequest("auth", { email, password })
        .its("body.data.tokenCreate")
        .then(tokenCreate => {
          expect(
            tokenCreate.errors[0].code,
            "logging in should return error",
          ).to.be.eq("INACTIVE");
          expect(tokenCreate.token).to.be.not.ok;
        });
    },
  );

  it(
    "should activate user. TC: SALEOR_3503",
    { tags: ["@staffMembers", "@stagedOnly", "@allenv"] },
    () => {
      const serverStoredEmail = email.toLowerCase();

      updateStaffMember({ userId: user.id, isActive: false });
      updateUserActiveFlag(user.id);
      cy.clearSessionData()
        .loginUserViaRequest("auth", { email, password })
        .visit(urlList.homePage);
      expectWelcomeMessageIncludes(serverStoredEmail);
    },
  );

  it(
    "should remove user permissions. TC: SALEOR_3504",
    { tags: ["@staffMembers", "@stagedOnly", "@allenv"] },
    () => {
      const serverStoredEmail = email.toLowerCase();

      cy.visit(userDetailsUrl(user.id))
        .get(STAFF_MEMBER_DETAILS.removePermissionButton)
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
      getDisplayedSelectors().then(displayedSelectors => {
        expect(Object.values(displayedSelectors)).to.have.length(1);
        expect(Object.values(displayedSelectors)[0]).to.eq(
          LEFT_MENU_SELECTORS.home,
        );
      });
    },
  );

  it(
    "should reset password. TC: SALEOR_3505",
    { tags: ["@staffMembers", "@stagedOnly", "@allenv"] },
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
    "should not be able to create staff member with not unique email. TC: SALEOR_3508",
    { tags: ["@staffMembers", "@stagedOnly", "@allenv"] },
    () => {
      const firstName = faker.name.firstName();
      const emailInvite = TEST_ADMIN_USER.email;
      cy.visit(urlList.staffMembers)
        .expectSkeletonIsVisible()
        .get(STAFF_MEMBERS_LIST.inviteStaffMemberButton)
        .click({ force: true });
      fillUpOnlyUserDetails(firstName, lastName, emailInvite);
      cy.confirmationErrorMessageShouldAppear();
    },
  );

  it(
    "should not be able to update staff member with not unique email. TC: SALEOR_3509",
    { tags: ["@staffMembers", "@stagedOnly", "@allenv"] },
    () => {
      cy.visit(urlList.staffMembers)
        .expectSkeletonIsVisible()
        .get(SHARED_ELEMENTS.searchInput)
        .type(`${email} {enter}`);
      cy.waitForProgressBarToNotExist();
      cy.get(STAFF_MEMBERS_LIST.staffAvatar)
        .first()
        .should("be.visible");
      cy.waitForProgressBarToNotExist()
        .get(STAFF_MEMBERS_LIST.staffStatusText)
        .first()
        .should("be.visible")
        .click();
      cy.get(STAFF_MEMBER_DETAILS.staffEmail)
        .click()
        .clear()
        .type(`${TEST_ADMIN_USER.email} {enter}`)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationErrorMessageShouldAppear();
    },
  );

  // Test blocked by https://github.com/saleor/saleor-dashboard/issues/2847
  it.skip(
    "should update staff member name and email. TC: SALEOR_3507",
    { tags: ["@staffMembers", "@stagedOnly", "@allenv"] },
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

      cy.visit(urlList.staffMembers)
        .get(LOGIN_SELECTORS.userMenu)
        .click();
      cy.get(LOGIN_SELECTORS.accountSettings).click();
      cy.get(STAFF_MEMBER_DETAILS.staffFirstName)
        .clear()
        .type("สมชาย");
      cy.get(STAFF_MEMBER_DETAILS.staffLastName)
        .clear()
        .type(newLastName);
      cy.get(STAFF_MEMBER_DETAILS.staffEmail)
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
    { tags: ["@staffMembers", "@stagedOnly", "@allenv"] },
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

      cy.visit(urlList.staffMembers)
        .get(LOGIN_SELECTORS.userMenu)
        .click();
      cy.get(LOGIN_SELECTORS.accountSettings).click();
      cy.get(STAFF_MEMBER_DETAILS.changePasswordBtn).click();
      cy.get(STAFF_MEMBER_DETAILS.changePasswordModal.oldPassword).type(
        Cypress.env("USER_PASSWORD"),
      );
      cy.get(STAFF_MEMBER_DETAILS.changePasswordModal.newPassword).type(
        newPass,
      );
      cy.get(BUTTON_SELECTORS.submit)
        .click()
        .confirmationMessageShouldAppear();

      cy.clearSessionData().loginUserViaRequest("auth", {
        email: newEmail,
        password: newPass,
      });
      cy.visit(urlList.staffMembers).expectSkeletonIsVisible();
    },
  );
});
