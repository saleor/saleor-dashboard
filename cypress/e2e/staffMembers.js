/// <reference types="cypress"/>
/// <reference types="../support"/>

import faker from "faker";

import { LEFT_MENU_SELECTORS } from "../elements/account/left-menu/left-menu-selectors";
import { LOGIN_SELECTORS } from "../elements/account/login-selectors";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { STAFF_MEMBER_DETAILS } from "../elements/staffMembers/staffMemberDetails";
import { STAFF_MEMBERS_LIST } from "../elements/staffMembers/staffMembersList";
import { urlList, userDetailsUrl } from "../fixtures/urlList";
import { updatePlugin } from "../support/api/requests/Plugins";
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
  fillUpSetPassword,
  fillUpUserDetails,
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

  it("should invite user", { tags: ["@staffMembers", "@stagedOnly"] }, () => {
    const firstName = faker.name.firstName();
    const emailInvite = `${startsWith}${firstName}@example.com`;

    cy.visit(urlList.staffMembers)
      .expectSkeletonIsVisible()
      .get(STAFF_MEMBERS_LIST.inviteStaffMemberButton)
      .click();
    fillUpUserDetails(firstName, lastName, emailInvite);
    getMailActivationLinkForUser(emailInvite).then(urlLink => {
      cy.clearSessionData().visit(urlLink);
      fillUpSetPassword(password);
      expectWelcomeMessageIncludes(`${firstName} ${lastName}`);
    });
  });

  it(
    "should deactivate user",
    { tags: ["@staffMembers", "@stagedOnly"] },
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

  it("should activate user", { tags: ["@staffMembers", "@stagedOnly"] }, () => {
    updateStaffMember({ userId: user.id, isActive: false });
    updateUserActiveFlag(user.id);
    cy.clearSessionData()
      .loginUserViaRequest("auth", { email, password })
      .visit(urlList.homePage);
    expectWelcomeMessageIncludes(email);
  });

  it(
    "should remove user permissions",
    { tags: ["@staffMembers", "@stagedOnly"] },
    () => {
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
      expectWelcomeMessageIncludes(email);
      getDisplayedSelectors().then(displayedSelectors => {
        expect(Object.values(displayedSelectors)).to.have.length(1);
        expect(Object.values(displayedSelectors)[0]).to.eq(
          LEFT_MENU_SELECTORS.home,
        );
      });
    },
  );

  it(
    "should reset password",
    { tags: ["@staffMembers", "@stagedOnly"] },
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
});
