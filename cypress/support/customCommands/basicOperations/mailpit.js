const mhApiUrl = path => {
  const envValue = Cypress.env("MAILPITURL");
  const basePath = envValue ? envValue : Cypress.config("MAILPITURL");
  return `${basePath}/api${path}`;
};

/**
 * Mail Collection
 */

Cypress.Commands.add("mpGetAllMails", (fromLast = 60000) =>
  cy
    .request({
      method: "GET",
      url: mhApiUrl("/v1/messages?limit=100"),
    })
    .then(response => {
      // by default get mails received in last 60000ms
      response.body.messages = response.body.messages.filter(message => {
        const fiveMinutesAgo = Date.now() - fromLast;
        const mailCreated = new Date(message.Created);
        return mailCreated.getTime() > fiveMinutesAgo;
      });
      if (typeof response.body === "string") {
        return JSON.parse(response.body);
      } else {
        return response.body;
      }
    }),
);

Cypress.Commands.add("mpLatest", { prevSubject: true }, mails =>
  Array.isArray(mails) && mails.length > 0 ? mails[0] : mails,
);

Cypress.Commands.add("mpGetMailsBySubject", subject => {
  cy.mpGetAllMails()
    .its("messages")
    .then(mails => mails.filter(mail => mail.Subject === subject));
});

Cypress.Commands.add("mpGetMailsByRecipient", recipient => {
  cy.mpGetAllMails()
    .its("messages")
    .then(mails =>
      mails.filter(mail =>
        mail.To.map(recipientObj => `${recipientObj.Address}`).includes(
          recipient,
        ),
      ),
    );
});

Cypress.Commands.add("mpGetMailDetails", { prevSubject: true }, mail =>
  cy
    .wrap(mail)
    .then(mail => {
      cy.request({
        method: "GET",
        url: mhApiUrl(`/v1/message/${mail.ID}`),
      });
    })
    .its("body"),
);
