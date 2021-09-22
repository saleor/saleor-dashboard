/// <reference types="cypress"/>
/// <reference types="../support"/>

import faker from "faker";

import { LEFT_MENU_SELECTORS } from "../elements/account/left-menu/left-menu-selectors";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { STAFF_MEMBER_DETAILS } from "../elements/staffMembers/staffMemberDetails";
import { STAFF_MEMBERS_LIST } from "../elements/staffMembers/staffMembersList";
import { urlList, userDetailsUrl } from "../fixtures/urlList";
import {
  deleteStaffMembersStartsWith,
  updateStaffMember
} from "../support/api/requests/StaffMembers";
import {
  getMailActivationLinkForUser,
  inviteStaffMemberWithFirstPermission
} from "../support/api/utils/users";
import filterTests from "../support/filterTests";
import { expectWelcomeMessageIncludes } from "../support/pages/homePage";
import { getDisplayedSelectors } from "../support/pages/permissionsPage";
import {
  fillUpSetPassword,
  fillUpUserDetails,
  updateUserActiveFlag
} from "../support/pages/userPage";

filterTests({ definedTags: ["stagedOnly"] }, () => {
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

    it("should invite user", () => {
      const firstName = faker.name.firstName();
      const emailInvite = `${startsWith}${firstName}@example.com`;

      cy.visit(urlList.staffMembers)
        .softExpectSkeletonIsVisible()
        .get(STAFF_MEMBERS_LIST.inviteStaffMemberButton)
        .click();
      fillUpUserDetails(firstName, lastName, emailInvite);
      getMailActivationLinkForUser(emailInvite).then(urlLink => {
        cy.clearSessionData().visit(urlLink);
        fillUpSetPassword(password);
        expectWelcomeMessageIncludes(`${firstName} ${lastName}`);
      });
    });

    it("should deactivate user", () => {
      updateStaffMember({ userId: user.id, isActive: true });
      updateUserActiveFlag(user.id);
      cy.clearSessionData()
        .loginUserViaRequest("auth", { email, password })
        .its("body.data.tokenCreate")
        .then(tokenCreate => {
          chai
            .softExpect(
              tokenCreate.errors[0].code,
              "logging in should return error"
            )
            .to.be.eq("INVALID_CREDENTIALS");
          expect(tokenCreate.token).to.be.not.ok;
        });
    });

    it("should activate user", () => {
      updateStaffMember({ userId: user.id, isActive: false });
      updateUserActiveFlag(user.id);
      cy.clearSessionData()
        .loginUserViaRequest("auth", { email, password })
        .visit(urlList.homePage);
      expectWelcomeMessageIncludes(email);
    });

    it("should remove user permissions", () => {
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
          LEFT_MENU_SELECTORS.home
        );
      });
    });
  });
});
