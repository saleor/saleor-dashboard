/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { PLUGINS_DETAILS } from "../../../elements/plugins/pluginDetails";
import { PLUGINS_LIST } from "../../../elements/plugins/pluginsList";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { urlList } from "../../../fixtures/urlList";
import { createChannel } from "../../../support/api/requests/Channels";
import {
  customerRegistration,
  deleteCustomersStartsWith,
  requestPasswordReset
} from "../../../support/api/requests/Customer";
import {
  deleteChannelsStartsWith,
  getDefaultChannel
} from "../../../support/api/utils/channelsUtils";
import {
  getMailActivationLinkForUserAndSubject,
  getMailsForUser
} from "../../../support/api/utils/users";
import filterTests from "../../../support/filterTests";

filterTests({ definedTags: ["stagedOnly"], version: "3.1.0" }, () => {
  describe("Plugins", () => {
    const startsWith = "Plugins";
    const randomName = `${startsWith}${faker.datatype.number()}`;
    let defaultChannel;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteCustomersStartsWith(startsWith);
      deleteChannelsStartsWith(startsWith);
      createChannel({ name: randomName });
      getDefaultChannel().then(channel => (defaultChannel = channel));
    });

    beforeEach(() => {
      cy.clearSessionData()
        .loginUserViaRequest()
        .visit(urlList.plugins)
        .softExpectSkeletonIsVisible();
    });

    it("should change user email", () => {
      const customerEmail = `${randomName}@example.com`;
      cy.contains(PLUGINS_LIST.pluginRow, "User emails").click();
      cy.contains(PLUGINS_DETAILS.channel, defaultChannel.name)
        .click()
        .get(PLUGINS_DETAILS.accountConfirmationSubjectInput)
        .clearAndType(randomName)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear();
      customerRegistration({
        email: customerEmail,
        channel: defaultChannel.slug
      })
        .then(() => {
          getMailsForUser(customerEmail);
        })
        .then(mails => {
          expect(mails[0].Content.Headers.Subject[0]).to.eq(randomName);
        });
    });

    it("should change admin email plugin", () => {
      const customerEmail = `${randomName}@example.com`;
      cy.contains(PLUGINS_LIST.pluginRow, "Admin emails")
        .click()
        .get(PLUGINS_DETAILS.staffPasswordResetInput)
        .click()
        .clear()
        .clearAndType(randomName)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear();
      requestPasswordReset(Cypress.env("USER_NAME"), defaultChannel.slug)
        .then(() => {
          getMailActivationLinkForUserAndSubject(
            Cypress.env("USER_NAME"),
            randomName
          );
        })
        .then(link => {
          expect(link).to.be.ok;
        });
    });
  });
});
