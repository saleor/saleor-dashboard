import faker from "faker";

import { createChannel } from "../apiRequests/Channels";
import {
  customerRegistration,
  deleteCustomersStartsWith,
  requestPasswordReset
} from "../apiRequests/Customer";
import { PLUGINS_DETAILS } from "../elements/plugins/pluginDetails";
import { PLUGINS_LIST } from "../elements/plugins/pluginsList";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { confirmationMessageShouldDisappear } from "../steps/shared/confirmationMessages";
import filterTests from "../support/filterTests";
import { urlList } from "../url/urlList";
import { getDefaultChannel } from "../utils/channelsUtils";
import { getMailsForUser } from "../utils/users";

filterTests(["stagedOnly"], () => {
  describe("Plugins", () => {
    const startsWith = "Plugins";
    const randomName = `${startsWith}${faker.datatype.number()}`;
    let defaultChannel;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteCustomersStartsWith(startsWith);
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
        .click();
      confirmationMessageShouldDisappear();
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
        .click();
      confirmationMessageShouldDisappear();
      requestPasswordReset(Cypress.env("USER_NAME"), defaultChannel.slug)
        .then(() => {
          getMailsForUser(customerEmail);
        })
        .then(mails => {
          expect(mails[0].Content.Headers.Subject[0]).to.eq(randomName);
        });
    });
  });
});
