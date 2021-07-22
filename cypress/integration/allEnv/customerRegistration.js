import faker from "faker";

import { customerRegistration } from "../../apiRequests/Customer";
import { CUSTOMER_DETAILS } from "../../elements/customers/customer-details";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { confirmationMessageShouldDisappear } from "../../steps/shared/confirmationMessages";
import { customerDetailsUrl } from "../../url/urlList";
import { getDefaultChannel } from "../../utils/channelsUtils";

describe("Tests for customer registration", () => {
  const startsWith = "Registration";
  const email = `${startsWith}${faker.datatype.number()}@example.com`;

  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    getDefaultChannel().then(channel => {
      defaultChannel = channel;
    });
  });

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
        cy.visit(customerDetailsUrl(user.id))
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
