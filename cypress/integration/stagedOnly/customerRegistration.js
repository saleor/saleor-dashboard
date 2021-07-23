import faker from "faker";

import {
  confirmAccount,
  customerRegistration,
  deleteCustomersStartsWith
} from "../../apiRequests/Customer";
import { getDefaultChannel } from "../../utils/channelsUtils";
import { getMailActivationLinkForUser } from "../../utils/users";

describe("Tests for customer registration with email", () => {
  const startsWith = "RegistrationEmail";
  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteCustomersStartsWith(startsWith);
    getDefaultChannel().then(channel => (defaultChannel = channel));
  });

  it("should register customer", () => {
    const email = `${startsWith}${faker.datatype.number()}@example.com`;
    customerRegistration({ email, channel: defaultChannel.slug });
    getMailActivationLinkForUser(email)
      .then(urlLink => {
        const tokenRegex = /token=(.*)/;
        const token = urlLink.match(tokenRegex)[1];
        cy.clearSessionData();
        confirmAccount(email, token);
      })
      .then(() => {
        cy.loginUserViaRequest("token", {
          email,
          password: Cypress.env("USER_PASSWORD")
        }).its("body.data.tokenCreate");
      })
      .then(({ errors, token }) => {
        expect(errors.length).to.eq(0);
        expect(token).to.be.ok;
      });
  });
});
