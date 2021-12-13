// / <reference types="cypress"/>
// / <reference types="../../support"/>

import faker from "faker";

import { CUSTOMER_DETAILS } from "../../elements/customer/customer-details";
import { CUSTOMERS_LIST } from "../../elements/customer/customers-list";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { customerDetailsUrl, urlList } from "../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../fixtures/users";
import {
  createCustomer,
  deleteCustomersStartsWith,
  getCustomer
} from "../../support/api/requests/Customer";
import filterTests from "../../support/filterTests";

filterTests({ definedTags: ["all"] }, () => {
  describe("Tests for customer", () => {
    const startsWith = `Customers`;
    let address;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteCustomersStartsWith(startsWith);
      cy.fixture("addresses").then(({ usAddress }) => {
        address = usAddress;
      });
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest(
        "auth",
        ONE_PERMISSION_USERS.user
      );
    });

    xit("should create customer", () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;
      const email = `${randomName}@example.com`;
      const note = faker.lorem.paragraph();

      cy.clearSessionData().loginUserViaRequest(
        "auth",
        ONE_PERMISSION_USERS.user
      );
      cy.visit(urlList.customers)
        .get(CUSTOMERS_LIST.createCustomerButton)
        .click()
        .get(SHARED_ELEMENTS.progressBar)
        .should("not.be.visible")
        .get(CUSTOMER_DETAILS.nameInput)
        .type(randomName)
        .get(CUSTOMER_DETAILS.lastNameInput)
        .type(randomName)
        .get(CUSTOMER_DETAILS.emailInput)
        .type(email)
        .fillUpAddressForm(address)
        .get(CUSTOMER_DETAILS.noteInput)
        .type(note)
        .addAliasToGraphRequest("CreateCustomer")
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .waitForRequestAndCheckIfNoErrors("@CreateCustomer")
        .its("response.body.data.customerCreate.user")
        .then(customer => {
          getCustomer(customer.id);
        })
        .then(customer => {
          chai
            .softExpect(customer.firstName, "Expect correct first name")
            .to.eq(randomName);
          chai
            .softExpect(customer.lastName, "Expect correct last name")
            .to.eq(randomName);
          chai.softExpect(customer.email, "Expect correct email").to.eq(email);
          chai.softExpect(customer.note, "Expect correct note").to.eq(note);
          cy.expectCorrectFullAddress(customer.addresses[0], address);
        });
    });

    it("should add address to customer", () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;
      const email = `${randomName}@example.com`;
      createCustomer(email, randomName, address).then(({ user }) => {
        cy.visit(customerDetailsUrl(user.id));
      });
    });
  });
});
