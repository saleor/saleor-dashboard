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

export function getMailActivationLinkForUser(email) {
  return cy
    .mhGetMailsByRecipient(email)
    .mhFirst()
    .mhGetBody()
    .then(body => {
      const urlRegex = /\[([^\]]*)\]/;
      const bodyWithoutWhiteSpaces = body.replace(/(\r\n|\n|\r|\s)/gm, "");
      return urlRegex.exec(bodyWithoutWhiteSpaces)[1];
    });
}
