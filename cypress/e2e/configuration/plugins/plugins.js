/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { PLUGINS_DETAILS } from "../../../elements/plugins/pluginDetails";
import { PLUGINS_LIST } from "../../../elements/plugins/pluginsList";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { urlList } from "../../../fixtures/urlList";
import {
  customerRegistration,
  deleteCustomersStartsWith,
  requestPasswordReset,
} from "../../../support/api/requests/Customer";
import {
  deleteChannelsStartsWith,
  getDefaultChannel,
} from "../../../support/api/utils/channelsUtils";
import {
  getMailsForUser,
  getMailWithResetPasswordLink,
} from "../../../support/api/utils/users";

describe("As an admin I want to manage plugins", () => {
  const startsWith = "Plugins";
  const randomName = `${startsWith}${faker.datatype.number()}`;

  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteCustomersStartsWith(startsWith);
    deleteChannelsStartsWith(startsWith);
    getDefaultChannel().then(channel => (defaultChannel = channel));
  });

  beforeEach(() => {
    cy.clearSessionData()
      .loginUserViaRequest()
      .visit(urlList.plugins)
      .expectSkeletonIsVisible();
  });

  it(
    "should change user email. TC: SALEOR_3601",
    { tags: ["@plugins", "@stagedOnly", "@stable"] },
    () => {
      const customerEmail = `${randomName}@example.com`;

      cy.contains(PLUGINS_LIST.pluginRow, "User emails")
        .click()
        .waitForProgressBarToNotBeVisible();
      cy.contains(PLUGINS_DETAILS.channel, defaultChannel.name)
        .click()
        .get(PLUGINS_DETAILS.accountConfirmationSubjectInput)
        .clearAndType(randomName)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear();
      customerRegistration({
        email: customerEmail,
        channel: defaultChannel.slug,
      });
      getMailsForUser(customerEmail)
        .its("0.Content.Headers.Subject.0")
        .should("eq", randomName);
    },
  );

  it(
    "should change admin email plugin. TC: SALEOR_3602",
    { tags: ["@plugins", "@stagedOnly", "@stable"] },
    () => {
      const adminName = `Admin${randomName}`;

      cy.contains(PLUGINS_LIST.pluginRow, "Admin emails")
        .click()
        .get(PLUGINS_DETAILS.staffPasswordResetInput)
        .click()
        .clear()
        .clearAndType(adminName)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear();
      requestPasswordReset(Cypress.env("USER_NAME"), defaultChannel.slug);
      getMailWithResetPasswordLink(Cypress.env("USER_NAME"), adminName)
        .its("0.Content.Headers.Subject.0")
        .should("contains", adminName);
    },
  );
});
