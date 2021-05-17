import faker from "faker";

import {
  deleteStaffMembersStartsWith,
  updateStaffMember
} from "../../../apiRequests/staffMember";
import { HOMEPAGE_SELECTORS } from "../../../elements/homePage/homePage-selectors";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { INVITE_STAFF_MEMBER_FORM } from "../../../elements/staffMembers/inviteStaffMemberForm";
import { STAFF_MEMBER_DETAILS } from "../../../elements/staffMembers/staffMemberDetails";
import { STAFF_MEMBERS_LIST } from "../../../elements/staffMembers/staffMembersList";
import { fillAutocompleteSelect } from "../../../steps/shared/autocompleteSelect";
import { fillUpSetPassword } from "../../../steps/user";
import { urlList, userDetailsUrl } from "../../../url/urlList";
import {
  getMailActivationLinkForUser,
  inviteStaffMemberWithFirstPermission
} from "../../../utils/users";

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
    cy.visit(urlList.staffMembers);
  });

  xit("should invite user", () => {
    const firstName = faker.name.firstName();
    const surname = faker.name.lastName();
    const emailInvite = `${startsWith}${lastName}@example.com`;

    cy.get(STAFF_MEMBERS_LIST.inviteStaffMemberButton)
      .click()
      .get(INVITE_STAFF_MEMBER_FORM.firstNameInput)
      .type(firstName)
      .get(INVITE_STAFF_MEMBER_FORM.lastNameInput)
      .type(surname)
      .get(INVITE_STAFF_MEMBER_FORM.emailInput)
      .type(emailInvite)
      .get(BUTTON_SELECTORS.submit)
      .click();
    fillAutocompleteSelect(STAFF_MEMBER_DETAILS.permissionsSelect);
    cy.addAliasToGraphRequest("StaffMemberUpdate");
    cy.get(BUTTON_SELECTORS.confirm)
      .click()
      .wait("@StaffMemberUpdate");
    // .mhGetMailsByRecipient(email)
    // .mhFirst()
    // .mhGetBody()
    // .then(body => {
    //   const urlRegex = /\[([^\]]*)\]/;
    //   const bodyWithoutWhiteSpaces = body.replace(/(\r\n|\n|\r|\s)/gm, "");
    //   const urlLink = urlRegex.exec(bodyWithoutWhiteSpaces)[1];
    getMailActivationLinkForUser(emailInvite)
      .then(urlLink => {
        cy.clearSessionData().visit(urlLink);
        // .get(SET_PASSWORD.confirmPasswordInput)
        // .type(password)
        // .get(SET_PASSWORD.passwordInput)
        // .type(password)
        // .get(BUTTON_SELECTORS.confirm)
        // .click()
        fillUpSetPassword(password);
        cy.getTextFromElement(HOMEPAGE_SELECTORS.welcomeMessage);
      })
      .then(welcomeMessage => {
        expect(
          welcomeMessage,
          "user full name should be displayed in welcome message"
        )
          .to.includes(firstName)
          .and.to.includes(lastName);
      });
  });
  it("should not log in deactivated user", () => {
    // const lastName = faker.name.lastName();
    // const email = `${startsWith}${lastName}@example.com`;
    // let user;
    // let urlLink;

    // inviteStaffMemberWithFirstPermission({
    //   email,
    //   isActive: true
    // }).then(({ user: userResp }) => {
    // user = userResp;
    //   getMailActivationLinkForUser(email)
    // }).then(urlLinkResp => {
    //   urlLink = urlLinkResp;
    //   cy.clearSessionData()
    //     .visit(urlLink)
    //   fillUpSetPassword(password);
    //   cy.clearSessionData()
    cy.loginUserViaRequest();
    updateStaffMember({ userId: user.id, isActive: true });
    cy.visit(userDetailsUrl(user.id))
      .get(STAFF_MEMBER_DETAILS.isActiveCheckBox)
      .click()
      .addAliasToGraphRequest("StaffMemberUpdate");
    cy.get(BUTTON_SELECTORS.confirm)
      .click()
      .wait("@StaffMemberUpdate")
      .clearSessionData()
      .loginUserViaRequest("auth", { email, password })
      .its("body.data")
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
  it("should deactivate user", () => {
    cy.loginUserViaRequest();
    updateStaffMember({ userId: user.id, isActive: false });
    cy.visit(userDetailsUrl(user.id))
      .get(STAFF_MEMBER_DETAILS.isActiveCheckBox)
      .click()
      .addAliasToGraphRequest("StaffMemberUpdate");
    cy.get(BUTTON_SELECTORS.confirm)
      .click()
      .wait("@StaffMemberUpdate")
      .clearSessionData()
      .loginUserViaRequest("auth", { email, password })
      .its("body.data")
      .get(HOMEPAGE_SELECTORS.welcomeMessage)
      .then($welcomeMessage => {
        expect($welcomeMessage).to.includes(email);
      });
  });
  // xit("should remove user permissions", () => {

  // })
});
