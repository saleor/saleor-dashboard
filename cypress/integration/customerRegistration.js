import faker from "faker";

import {
  confirmAccount,
  customerRegistration,
  deleteCustomersStartsWith
} from "../apiRequests/Customer";
import { CUSTOMER_DETAILS } from "../elements/customers/customer-details";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { confirmationMessageShouldDisappear } from "../steps/shared/confirmationMessages";
import filterTests from "../support/filterTests";
import { customerDetailsUrl } from "../url/urlList";
import { getDefaultChannel } from "../utils/channelsUtils";
import { getMailActivationLinkForUser } from "../utils/users";

describe("Tests for customer registration", () => {
  const startsWith = "Registration";
  const email = `${startsWith}${faker.datatype.number()}@example.com`;

  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteCustomersStartsWith(startsWith);
    getDefaultChannel().then(channel => {
      defaultChannel = channel;
    });
  });

  filterTests(["stagedOnly"], () => {
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

  filterTests(["all"], () => {
    it("shouldn't register customer with duplicated email", () => {
      const duplicatedEmail = Cypress.env("USER_NAME");
      customerRegistration({
        duplicatedEmail,
        channel: defaultChannel.slug
      }).then(({ user, errors }) => {
        expect(errors[0].field).to.eq("email");
        expect(user).to.not.be.ok;
      });
    });

    it("should activate customer from dashboard", () => {
      customerRegistration({ email, channel: defaultChannel.slug })
        .then(({ user }) => {
          cy.clearSessionData()
            .loginUserViaRequest()
            .visit(customerDetailsUrl(user.id))
            .get(CUSTOMER_DETAILS.isActiveCheckbox)
            .click()
            .get(BUTTON_SELECTORS.confirm)
            .click();
          confirmationMessageShouldDisappear();
          cy.clearSessionData()
            .loginUserViaRequest("token", {
              email,
              password: Cypress.env("USER_PASSWORD")
            })
            .its("body.data.tokenCreate");
        })
        .then(({ token, errors }) => {
          expect(errors.length).to.eq(0);
          expect(token).to.be.ok;
        });
    });
  });
});
