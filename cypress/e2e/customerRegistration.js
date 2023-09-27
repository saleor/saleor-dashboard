/// <reference types="cypress"/>
/// <reference types="../support"/>

import faker from "faker";

import { CUSTOMER_DETAILS_SELECTORS } from "../elements/customers/customer-details";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { customerDetailsUrl } from "../fixtures/urlList";
import {
  confirmAccount,
  customerRegistration,
} from "../support/api/requests/Customer";
import { getDefaultChannel } from "../support/api/utils/channelsUtils";
import { getMailActivationLinkForUser } from "../support/api/utils/users";

describe("Tests for customer registration", () => {
  const startsWith = "Registration";
  const email = `${startsWith}${faker.datatype.number()}@example.com`;

  let defaultChannel;

  before(() => {
    cy.loginUserViaRequest();
    getDefaultChannel().then(channel => {
      defaultChannel = channel;
      cy.checkIfDataAreNotNull({ defaultChannel });
    });
  });

  it(
    "should register customer TC: SALEOR_1212",
    { tags: ["@customer", "@allEnv"] },
    () => {
      const email = `${startsWith}${faker.datatype.number()}@example.com`;
      customerRegistration({ email, channel: defaultChannel.slug });
      const registrationLinkRegex = /\[(\s*http[^\]]*)\]/;
      getMailActivationLinkForUser(email, registrationLinkRegex)
        .then(urlLink => {
          const tokenRegex = /token=(.*)/;
          const token = urlLink.match(tokenRegex)[1];
          cy.clearSessionData();
          confirmAccount(email, token);
        })
        .then(() => {
          cy.loginUserViaRequest("token", {
            email,
            password: Cypress.env("USER_PASSWORD"),
          }).its("body.data.tokenCreate");
        })
        .then(({ errors, token }) => {
          expect(errors.length).to.eq(0);
          expect(token).to.be.ok;
        });
    },
  );

  it(
    "shouldn't register customer with duplicated email TC: SALEOR_1213",
    { tags: ["@customer", "@allEnv", "@stable"] },
    () => {
      const duplicatedEmail = Cypress.env("USER_NAME");
      customerRegistration({
        duplicatedEmail,
        channel: defaultChannel.slug,
      }).then(({ user, errors }) => {
        expect(errors[0].field).to.eq("email");
        expect(user).to.not.be.ok;
      });
    },
  );

  it(
    "should activate customer from dashboard SALEOR_1211",
    { tags: ["@customer", "@allEnv", "@stable"] },
    () => {
      customerRegistration({ email, channel: defaultChannel.slug })
        .then(({ user }) => {
          cy.clearSessionData()
            .loginUserViaRequest()
            .visit(customerDetailsUrl(user.id))
            .get(CUSTOMER_DETAILS_SELECTORS.isActiveCheckbox)
            .click()
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .confirmationMessageShouldDisappear()
            .then(() => {
              const registrationLinkRegex = /\[(\s*http[^\]]*)\]/;
              getMailActivationLinkForUser(email, registrationLinkRegex).then(
                urlLink => {
                  const tokenRegex = /token=(.*)/;
                  const token = urlLink.match(tokenRegex)[1];
                  cy.clearSessionData();
                  confirmAccount(email, token);
                },
              );
            })
            .clearSessionData()
            .loginUserViaRequest("token", {
              email,
              password: Cypress.env("USER_PASSWORD"),
            })
            .its("body.data.tokenCreate");
        })
        .then(({ token, errors }) => {
          expect(errors.length).to.eq(0);
          expect(token).to.be.ok;
        });
    },
  );
});
