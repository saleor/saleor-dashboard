/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { PLUGINS_DETAILS_SELECTORS } from "../../../elements/plugins/pluginDetails";
import { PLUGINS_LIST_SELECTORS } from "../../../elements/plugins/pluginsList";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { urlList } from "../../../fixtures/urlList";
import {
  customerRegistration,
  deleteCustomersStartsWith,
  requestPasswordReset,
} from "../../../support/api/requests/Customer";
import { activatePlugin } from "../../../support/api/requests/Plugins";
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
    getDefaultChannel().then(channel => {
      defaultChannel = channel;
      activatePlugin({ id: "mirumee.notifications.admin_email" });
      activatePlugin({
        id: "mirumee.notifications.user_email",
        channel: channel.id,
      });
    });
  });

  beforeEach(() => {
    cy.clearSessionData()
      .loginUserViaRequest()
      .visit(urlList.plugins)
      .expectSkeletonIsVisible();
  });

  it(
    "should change user email. TC: SALEOR_3601",
    { tags: ["@plugins", "@allEnv", "@stable"] },
    () => {
      const customerEmail = `${randomName}@example.com`;

      cy.contains(PLUGINS_LIST_SELECTORS.pluginRow, "User emails")
        .click()
        .waitForProgressBarToNotBeVisible();
      cy.contains(PLUGINS_DETAILS_SELECTORS.channel, defaultChannel.name)
        .click()
        .get(PLUGINS_DETAILS_SELECTORS.accountConfirmationSubjectInput)
        .clearAndType(randomName)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear();
      customerRegistration({
        email: customerEmail,
        channel: defaultChannel.slug,
      })
        .then(() => {
          getMailsForUser(customerEmail)
            .mpLatest()
            .mpGetMailDetails()
            .its("Subject");
        })
        .then(subject => {
          expect(subject).to.eq(randomName);
        });
    },
  );

  it(
    "should change admin email plugin. TC: SALEOR_3602",
    { tags: ["@plugins", "@allEnv", "@stable"] },
    () => {
      const adminName = `Admin${randomName}`;

      cy.contains(PLUGINS_LIST_SELECTORS.pluginRow, "Admin emails")
        .click()
        .get(PLUGINS_DETAILS_SELECTORS.staffPasswordResetInput)
        .click()
        .clear()
        .clearAndType(adminName)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear();
      requestPasswordReset(Cypress.env("USER_NAME"), defaultChannel.slug);
      getMailWithResetPasswordLink(Cypress.env("USER_NAME"), adminName)
        .its("Subject")
        .should("contains", adminName);
    },
  );
});
