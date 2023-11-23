import { URL_LIST } from "@data/url";
import { APIRequestContext, expect } from "@playwright/test";

const MAILPIT_URI = process.env.CYPRESS_MAILPITURL || "no mailpit url provided";
const mailpitUrl = "https://" + MAILPIT_URI;
export class MailpitService {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getLastEmails(getEmailsLimit = 100) {
    let latestEmails: any;
    await expect(async () => {
      latestEmails = await this.request.get(
        `${mailpitUrl}/api/v1/messages?limit=${getEmailsLimit}`,
      );
      expect(latestEmails.body()).not.toBeUndefined();
    }).toPass({
      intervals: [3_000, 3_000, 3_000],
      timeout: 10_000,
    });
    const latestEmailsJson = await latestEmails!.json();
    return latestEmailsJson;
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
    await expect(async () => {
      const emails = await this.getLastEmails();
      userEmails = emails.messages.filter((mails: { To: any[] }) =>
        mails.To.map(
          (recipientObj: { Address: any }) => `${recipientObj.Address}`,
        ).includes(userEmail),
      );
      expect(userEmails.length).toBeGreaterThanOrEqual(1);
    }).toPass({
      intervals: [3_000, 3_000, 3_000],
      timeout: 10_000,
    });
    await expect(userEmails).not.toEqual([]);

    return userEmails;
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
