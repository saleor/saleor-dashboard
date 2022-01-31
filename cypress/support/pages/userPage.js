import { SET_PASSWORD } from "../../elements/account/setPassword";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { INVITE_STAFF_MEMBER_FORM } from "../../elements/staffMembers/inviteStaffMemberForm";
import { STAFF_MEMBER_DETAILS } from "../../elements/staffMembers/staffMemberDetails";
import { userDetailsUrl } from "../../fixtures/urlList";

export function fillUpSetPassword(password) {
  cy.get(SET_PASSWORD.confirmPasswordInput)
    .type(password)
    .get(SET_PASSWORD.passwordInput)
    .type(password)
    .addAliasToGraphRequest("setPassword")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .waitForRequestAndCheckIfNoErrors("@setPassword");
}

export function fillUpUserDetails(firstName, lastName, email) {
  cy.get(INVITE_STAFF_MEMBER_FORM.firstNameInput)
    .type(firstName)
    .get(INVITE_STAFF_MEMBER_FORM.lastNameInput)
    .type(lastName)
    .get(INVITE_STAFF_MEMBER_FORM.emailInput)
    .type(email)
    .get(BUTTON_SELECTORS.submit)
    .click()
    .confirmationMessageShouldDisappear()
    .fillAutocompleteSelect(STAFF_MEMBER_DETAILS.permissionsSelect)
    .get(STAFF_MEMBER_DETAILS.permissionsSelect)
    .find("input")
    .first()
    .type("{esc}", { force: true })
    .addAliasToGraphRequest("StaffMemberUpdate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .waitForRequestAndCheckIfNoErrors("@StaffMemberUpdate");
}

export function updateUserActiveFlag(userId) {
  cy.visitAndWaitForProgressBarToDisappear(userDetailsUrl(userId))
    .get(STAFF_MEMBER_DETAILS.isActiveCheckBox)
    .click()
    .addAliasToGraphRequest("StaffMemberUpdate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .waitForRequestAndCheckIfNoErrors("@StaffMemberUpdate");
}
