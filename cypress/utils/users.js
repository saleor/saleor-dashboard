import { getPermissionsArray } from "../apiRequests/permissions";
import { inviteStaffMember } from "../apiRequests/staffMember";

export function inviteStaffMemberWithFirstPermission({
  email,
  isActive = true,
  firstName = "",
  lastName = ""
}) {
  return getPermissionsArray(1).then(permissions => {
    inviteStaffMember({
      firstName,
      lastName,
      email,
      isActive,
      permissionId: permissions[0].node.id
    });
  });
}

export function getMailActivationLinkForUser(email, i = 0) {
  if (i > 3) {
    throw new Error(`There is no email invitation for user ${email}`);
  }
  return cy.mhGetMailsByRecipient(email).should(mails => {
    if (!mails.length) {
      getMailActivationLinkForUser(email, i + 1);
    } else {
      cy.wrap(mails)
        .mhFirst()
        .should("not.eq", undefined)
        .mhGetBody()
        .then(body => {
          const urlRegex = /\[([^\]]*)\]/;
          const bodyWithoutWhiteSpaces = body.replace(/(\r\n|\n|\r|\s)/gm, "");
          return urlRegex.exec(bodyWithoutWhiteSpaces)[1];
        });
    }
  });
}
