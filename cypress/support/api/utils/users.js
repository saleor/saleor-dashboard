import { getPermissionsArray } from "../requests/Permissions";
import { inviteStaffMember } from "../requests/StaffMembers";

export function inviteStaffMemberWithFirstPermission({
  email,
  isActive = true,
  firstName = "",
  lastName = "",
}) {
  return getPermissionsArray(1).then(permissions => {
    inviteStaffMember({
      firstName,
      lastName,
      email,
      isActive,
      permissionId: permissions[0].node.id,
    });
  });
}

/**
 * Function mhGetMailsByRecipient first get all emails from mailhog with a timeout, and after that it finds email from recipient.
 * It cloud happened that invite email from saleor has not been received yet, so in this case the action should be retried.
 */
export function getMailActivationLinkForUser(email, regex, i = 0) {
  const serverStoredEmail = email.toLowerCase();

  const urlRegex = regex ? regex : /\[\w*password\w*\]\(([^\)]*)/;
  if (i > 3) {
    throw new Error(
      `There is no email invitation for user ${serverStoredEmail}`,
    );
  }
  return cy.mhGetMailsByRecipient(serverStoredEmail).then(mails => {
    if (!mails.length) {
      cy.wait(10000);
      getMailActivationLinkForUser(serverStoredEmail, regex, i + 1);
    } else {
      cy.wrap(mails)
        .mhFirst()
        .should("not.eq", undefined)
        .mhGetBody()
        .then(body => {
          const bodyWithoutWhiteSpaces = body.replace(/(\r\n|\n|\r|\s)/gm, "");
          return urlRegex.exec(bodyWithoutWhiteSpaces)[1];
        });
    }
  });
}

export function getMailActivationLinkForUserAndSubject(email, subject, i = 0) {
  const serverStoredEmail = email.toLowerCase();

  if (i > 3) {
    throw new Error(
      `There is no email invitation for user ${serverStoredEmail}`,
    );
  }
  return cy.mhGetMailsByRecipient(serverStoredEmail).then(mails => {
    if (!mails.length) {
      cy.wait(10000);
      getMailActivationLinkForUserAndSubject(serverStoredEmail, subject, i + 1);
    } else {
      cy.wrap(mails)
        .mhGetMailsBySubject(subject)
        .then(mailsWithSubject => {
          if (!mailsWithSubject.length) {
            cy.wait(10000);
            getMailActivationLinkForUserAndSubject(
              serverStoredEmail,
              subject,
              i + 1,
            );
          } else {
            cy.wrap(mailsWithSubject)
              .mhFirst()
              .should("not.eq", undefined)
              .mhGetBody()
              .then(body => {
                const urlRegex = /\[\w*password\w*\]\(([^\)]*)/;
                const bodyWithoutWhiteSpaces = body.replace(
                  /(\r\n|\n|\r|\s)/gm,
                  "",
                );
                return urlRegex.exec(bodyWithoutWhiteSpaces)[1];
              });
          }
        });
    }
  });
}

export function getMailWithResetPasswordLink(email, subject, i = 0) {
  const serverStoredEmail = email.toLowerCase();

  if (i > 5) {
    throw new Error(
      `There is no email with reset password for user ${serverStoredEmail}`,
    );
  }
  return cy.mhGetMailsByRecipient(serverStoredEmail).then(mails => {
    if (!mails.length) {
      cy.wait(3000);
      getMailWithResetPasswordLink(serverStoredEmail, subject, i + 1);
    } else {
      cy.mhGetMailsBySubject(subject).then(resetPasswordMails => {
        if (!resetPasswordMails.length) {
          cy.wait(3000);
          getMailWithResetPasswordLink(serverStoredEmail, subject, i + 1);
        } else {
          cy.wrap(resetPasswordMails);
        }
      });
    }
  });
}

export function getMailsForUser(email, i = 0) {
  const serverStoredEmail = email.toLowerCase();

  if (i > 5) {
    throw new Error(
      `There is no email invitation for user ${serverStoredEmail}`,
    );
  }
  return cy.mhGetMailsByRecipient(serverStoredEmail).then(mails => {
    if (!mails.length) {
      cy.wait(3000);
      getMailsForUser(serverStoredEmail, i + 1);
    } else {
      return mails;
    }
  });
}

export function getMailWithGiftCardExportWithAttachment(
  email,
  subject,
  attachmentFileType,
  i = 0,
) {
  if (i > 5) {
    throw new Error(`There is no email Gift Card export for user ${email}`);
  }
  return cy.mhGetMailsByRecipient(email).then(mails => {
    if (!mails.length) {
      cy.wait(3000);
      getMailWithGiftCardExportWithAttachment(
        email,
        subject,
        attachmentFileType,
        i + 1,
      );
    } else {
      cy.mhGetMailsBySubject(subject).then(mailsWithSubject => {
        if (!mailsWithSubject.length) {
          cy.wait(10000);
          getMailWithGiftCardExportWithAttachment(
            email,
            subject,
            attachmentFileType,
            i + 1,
          );
        } else {
          cy.wrap(mailsWithSubject)
            .mhFirst()
            .should("not.eq", undefined)
            .mhGetBody()
            .then(body => body);
        }
      });
    }
  });
}
