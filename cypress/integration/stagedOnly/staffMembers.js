import faker from "faker";

import {
  deleteStaffMembersStartsWith,
  updateStaffMember
} from "../../apiRequests/staffMember";
import { LEFT_MENU_SELECTORS } from "../../elements/account/left-menu/left-menu-selectors";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { STAFF_MEMBER_DETAILS } from "../../elements/staffMembers/staffMemberDetails";
import { STAFF_MEMBERS_LIST } from "../../elements/staffMembers/staffMembersList";
import { expectWelcomeMessageIncludes } from "../../steps/homePageSteps";
import { getDisplayedSelectors } from "../../steps/permissions";
import {
  fillUpSetPassword,
  fillUpUserDetails,
  updateUserActiveFlag
} from "../../steps/user";
import { urlList, userDetailsUrl } from "../../url/urlList";
import {
  getMailActivationLinkForUser,
  inviteStaffMemberWithFirstPermission
} from "../../utils/users";

describe("Staff members", () => {
  const startsWith = "Cypress";
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
      .wait("@StaffMemberUpdate")
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
