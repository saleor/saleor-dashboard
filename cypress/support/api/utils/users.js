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
 * Function mpGetMailsByRecipient first get all emails from mailpit with a timeout, and after that it finds email from recipient.
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
  return cy.mpGetMailsByRecipient(serverStoredEmail).then(mails => {
    if (!mails.length) {
      cy.wait(10000);
      getMailActivationLinkForUser(serverStoredEmail, regex, i + 1);
    } else {
      cy.wrap(mails)
        .mpLatest()
        .should("not.eq", undefined)
        .mpGetMailDetails()
        .its("Text")
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
  return cy.mpGetMailsByRecipient(serverStoredEmail).then(mails => {
    if (!mails.length) {
      cy.wait(10000);
      getMailActivationLinkForUserAndSubject(serverStoredEmail, subject, i + 1);
    } else {
      cy.wrap(mails)
        .mpGetMailsBySubject(subject)
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
              .mpLatest()
              .should("not.eq", undefined)
              .mpGetMailDetails()
              .its("Text")
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
  return cy.mpGetMailsByRecipient(serverStoredEmail).then(mails => {
    if (!mails.length) {
      cy.wait(3000);
      getMailWithResetPasswordLink(serverStoredEmail, subject, i + 1);
    } else {
      cy.mpGetMailsBySubject(subject).then(resetPasswordMails => {
        if (!resetPasswordMails.length) {
          cy.wait(3000);
          getMailWithResetPasswordLink(serverStoredEmail, subject, i + 1);
        } else {
          cy.wrap(resetPasswordMails).mpLatest().mpGetMailDetails();
        }
      });
    }
  });
}

export function getMailsForUser(email, i = 0) {
  const serverStoredEmail = email.toLowerCase();
  const getMailRetries = 9;
  if (i > getMailRetries) {
    throw new Error(
      `There is no email invitation for user ${serverStoredEmail}`,
    );
  }
  return cy.mpGetMailsByRecipient(serverStoredEmail).then(mails => {
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
  return cy.mpGetMailsByRecipient(email).then(mails => {
    if (!mails.length) {
      cy.wait(3000);
      getMailWithGiftCardExportWithAttachment(
        email,
        subject,
        attachmentFileType,
        i + 1,
      );
    } else {
      cy.mpGetMailsBySubject(subject).then(mailsWithSubject => {
        if (!mailsWithSubject.length) {
          cy.wait(5000);
          getMailWithGiftCardExportWithAttachment(
            email,
            subject,
            attachmentFileType,
            i + 1,
          );
        } else {
          cy.wrap(mailsWithSubject)
            .mpLatest()
            .mpGetMailDetails()
            .should("not.eq", undefined)
            .its("Text");
        }
      });
    }
  });
}
