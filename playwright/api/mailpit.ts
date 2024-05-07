import { URL_LIST } from "@data/url";
import { APIRequestContext, expect } from "@playwright/test";

const mailpitUrl = process.env.MAILPITURL || "no mailpit url provided";
export class MailpitService {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getLastEmails(getEmailsLimit = 50) {
    let latestEmails: any;
    await expect
      .poll(
        async () => {
          latestEmails = await this.request.get(
            `${mailpitUrl}/api/v1/messages?limit=${getEmailsLimit}`,
          );
          return latestEmails;
        },
        {
          message: `Could not found last ${getEmailsLimit}`,
          intervals: [2000, 3000, 5000, 5000],
          timeout: 15000,
        },
      )
      .not.toBeUndefined();
    const latestEmailsJson = await latestEmails!.json();
    return latestEmailsJson;
  }

  async getEmailsFromTime(fromTime = 10000){
    const latestEmails = await this.getLastEmails()

    latestEmails.messages = latestEmails.messages.filter(
      (message: { Created: string }) => {
        const timeMinusLastMs = Date.now() - fromTime;
        const mailCreated = new Date(message.Created);
        return mailCreated.getTime() > timeMinusLastMs;
      },
    );
    return latestEmails;
  }

  async getEmailDetails(mailId: string) {
    const emailDetails = await this.request.get(
      `${mailpitUrl}/api/v1/message/${mailId}`,
    );
    const emailDetailsJson = await emailDetails.json();

    return emailDetailsJson;
  }

  async getEmailsForUser(userEmail: string) {
    let userEmails: any[] = [];
    await expect
      .poll(
        async () => {
          const emails = await this.getEmailsFromTime();
          userEmails = await emails.messages.filter((mails: { To: any[] }) =>
            mails.To.map(
              (recipientObj: { Address: any }) => `${recipientObj.Address}`,
            ).includes(userEmail),
          );

          return userEmails.length;
        },
        {
          message: `User: ${userEmail} messages were not found.`,
          intervals: [2000, 3000, 5000, 5000],
          timeout: 15000,
        },
      )
      .toBeGreaterThanOrEqual(1);
    return userEmails;
  }

  async checkDoesUserReceivedExportedData(
    userEmail: string,
    mailSubject: string,
  ) {
    let confirmationMessageReceived: boolean = false;
    await expect
      .poll(
        async () => {
          let userEmails: any[] = await this.getEmailsForUser(userEmail);
          for (const email of userEmails) {
            if (email.Subject === mailSubject) {
              confirmationMessageReceived = true;
              break;
            }
          }
          return confirmationMessageReceived;
        },
        {
          message: `Message with subject: ${mailSubject} was not found`,
          intervals: [2000, 3000, 5000, 5000],
          timeout: 30000,
        },
      )
      .toBe(true);
  }

  async generateResetPasswordUrl(userEmail: string) {
    const tokenRegex = /token=([A-Za-z0-9]+(-[A-Za-z0-9]+)+)/;

    const userEmails = await this.getEmailsForUser(userEmail);
    const emailDetails = await this.getEmailDetails(userEmails[0].ID);
    const emailHtmlFormat = tokenRegex.exec(emailDetails.HTML.toString());
    const token = "&" + emailHtmlFormat![0];
    const resetPasswordUrl = URL_LIST.resetPassword + userEmail + token;
    return resetPasswordUrl;
  }
}
