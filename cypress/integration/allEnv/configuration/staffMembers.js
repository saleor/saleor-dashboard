import faker from "faker";

import { deleteCustomersStartsWith } from "../../../apiRequests/Customer";
import { TEST_ADMIN_USER } from "../../../Data/users";
import { SET_PASSWORD } from "../../../elements/account/setPassword";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { INVITE_STAFF_MEMBER_FORM } from "../../../elements/staffMembers/inviteStaffMemberForm";
import { STAFF_MEMBER_DETAILS } from "../../../elements/staffMembers/staffMemberDetails";
import { STAFF_MEMBERS_LIST } from "../../../elements/staffMembers/staffMembersList";
import { fillAutocompleteSelect } from "../../../steps/shared/autocompleteSelect";
import { urlList } from "../../../url/urlList";

describe("Staff members", () => {
  const firstName = "Cypress";

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteCustomersStartsWith(firstName);
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
    cy.visit(urlList.staffMembers);
  });

  it("should invite user", () => {
    const lastName = faker.name.lastName();
    const email = `${lastName}@example.com`;
    const password = Cypress.env("USER_PASSWORD");

    cy.get(STAFF_MEMBERS_LIST.inviteStaffMemberButton)
      .click()
      .get(INVITE_STAFF_MEMBER_FORM.firstNameInput)
      .type(firstName)
      .get(INVITE_STAFF_MEMBER_FORM.lastNameInput)
      .type(lastName)
      .get(INVITE_STAFF_MEMBER_FORM.emailInput)
      .type(email)
      .get(BUTTON_SELECTORS.submit)
      .click();
    fillAutocompleteSelect(STAFF_MEMBER_DETAILS.permissionsSelect);
    cy.get(BUTTON_SELECTORS.confirm)
      .click()
      .mhGetMailsByRecipient(email)
      .mhFirst()
      .mhGetBody()
      .then(body => {
        const urlRegex = /<a href="(.*)">/;
        const urlLink = urlRegex.exec(body)[1];
        cy.clearSessionData()
          .visit(urlLink)
          .get(SET_PASSWORD.passwordInput)
          .type(password)
          .get(SET_PASSWORD.confirmPasswordInput)
          .type(password)
          .get(BUTTON_SELECTORS.confirm)
          .click()
          .get(SHARED_ELEMENTS.header);
      })
      .then($header => {
        expect($header).to.be.visible;
      });
  });
  // xit("should activate user", () => {

  // })
  // xit("should deactivate user", () => {

  // })
  // xit("should remove user permissions", () => {

  // })
});
