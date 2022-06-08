/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { CUSTOMER_DETAILS } from "../../elements/customer/customer-details";
import { CUSTOMERS_LIST } from "../../elements/customer/customers-list";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { customerDetailsUrl, urlList } from "../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../fixtures/users";
import {
  addressCreate,
  createCustomer,
  deleteCustomersStartsWith,
  getCustomer
} from "../../support/api/requests/Customer";
import filterTests from "../../support/filterTests";

filterTests({ definedTags: ["all"] }, () => {
  describe("Tests for customer", () => {
    const startsWith = `Customers`;
    let address;
    let secondAddress;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteCustomersStartsWith(startsWith);
      cy.fixture("addresses").then(({ usAddress, secondUsAddress }) => {
        address = usAddress;
        secondAddress = secondUsAddress;
      });
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should create customer", () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;
      const email = `${randomName}@example.com`;
      const note = faker.lorem.paragraph();

      cy.visit(urlList.customers)
        .get(CUSTOMERS_LIST.createCustomerButton)
        .click()
        .get(SHARED_ELEMENTS.progressBar)
        .should("not.be.visible")
        .get(CUSTOMER_DETAILS.customerAddressNameInput)
        .type(randomName)
        .get(CUSTOMER_DETAILS.customerAddressLastNameInput)
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

      createCustomer(email, randomName).then(({ user }) => {
        cy.visit(customerDetailsUrl(user.id))
          .get(CUSTOMER_DETAILS.menageAddressesButton)
          .click()
          .get(CUSTOMER_DETAILS.addAddressButton)
          .click()
          .addAliasToGraphRequest("CreateCustomerAddress")
          .fillUpAddressFormAndSubmit(secondAddress)
          .waitForRequestAndCheckIfNoErrors("@CreateCustomerAddress");
        getCustomer(user.id).then(({ addresses }) => {
          expect(addresses).to.have.length(1);
          cy.expectCorrectFullAddress(addresses[0], secondAddress);
        });
      });
    });

    it("should remove address from customer", () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;
      const email = `${randomName}@example.com`;

      createCustomer(email, randomName, address).then(({ user }) => {
        cy.visit(customerDetailsUrl(user.id))
          .get(CUSTOMER_DETAILS.menageAddressesButton)
          .click()
          .waitForProgressBarToNotExist()
          .get(BUTTON_SELECTORS.showMoreButton)
          .should("be.enabled")
          .first()
          .click()
          .get(CUSTOMER_DETAILS.deleteAddressMenuItem)
          .click()
          .addAliasToGraphRequest("RemoveCustomerAddress")
          .get(BUTTON_SELECTORS.submit)
          .click()
          .waitForRequestAndCheckIfNoErrors("@RemoveCustomerAddress");
        getCustomer(user.id).then(({ addresses }) => {
          expect(addresses).to.have.length(1);
        });
      });
    });

    it("should set address as default", () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;
      const email = `${randomName}@example.com`;
      let user;

      createCustomer(email, randomName)
        .then(({ user: userResp }) => {
          user = userResp;
          addressCreate(user.id, address);
        })
        .then(() => {
          cy.visit(customerDetailsUrl(user.id))
            .get(CUSTOMER_DETAILS.menageAddressesButton)
            .click()
            .waitForProgressBarToNotExist()
            .get(BUTTON_SELECTORS.showMoreButton)
            .should("be.enabled")
            .click()
            .addAliasToGraphRequest("SetCustomerDefaultAddress")
            .get(CUSTOMER_DETAILS.setAddressAsDefaultShipping)
            .click()
            .wait("@SetCustomerDefaultAddress");
          getCustomer(user.id);
        })
        .then(({ addresses }) => {
          chai.softExpect(addresses[0].isDefaultShippingAddress).to.eq(true);
          cy.get(BUTTON_SELECTORS.showMoreButton)
            .should("be.enabled")
            .click()
            .addAliasToGraphRequest("SetCustomerDefaultAddress")
            .get(CUSTOMER_DETAILS.setAddressAsDefaultBilling)
            .click()
            .wait("@SetCustomerDefaultAddress");
          getCustomer(user.id);
        })
        .then(({ addresses }) => {
          expect(addresses[0].isDefaultBillingAddress).to.be.true;
        });
    });

    it("should update address", () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;
      const email = `${randomName}@example.com`;

      createCustomer(email, randomName, address).then(({ user }) => {
        cy.visit(customerDetailsUrl(user.id))
          .get(CUSTOMER_DETAILS.menageAddressesButton)
          .click()
          .get(BUTTON_SELECTORS.showMoreButton)
          .should("be.enabled")
          .first()
          .click()
          .get(CUSTOMER_DETAILS.editAddressMenuitem)
          .click()
          .addAliasToGraphRequest("UpdateCustomerAddress")
          .fillUpAddressFormAndSubmit(secondAddress)
          .waitForRequestAndCheckIfNoErrors("@UpdateCustomerAddress");
        getCustomer(user.id).then(({ addresses }) => {
          expect(addresses).to.have.length(2);
          const addedAddress = addresses.find(
            element =>
              element.city.toUpperCase() === secondAddress.city.toUpperCase()
          );
          cy.expectCorrectFullAddress(addedAddress, secondAddress);
        });
      });
    });

    it("should delete customer", () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;
      const email = `${randomName}@example.com`;

      createCustomer(email, randomName, address).then(({ user }) => {
        cy.visit(customerDetailsUrl(user.id))
          .get(BUTTON_SELECTORS.deleteButton)
          .click()
          .addAliasToGraphRequest("RemoveCustomer")
          .get(BUTTON_SELECTORS.submit)
          .click()
          .wait("@RemoveCustomer");
        getCustomer(user.id).should("be.null");
      });
    });

    it("should deactivate customer", () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;
      const email = `${randomName}@example.com`;

      createCustomer(email, randomName, address, true).then(({ user }) => {
        cy.visit(customerDetailsUrl(user.id))
          .get(CUSTOMER_DETAILS.activeCheckbox)
          .click()
          .addAliasToGraphRequest("UpdateCustomer")
          .get(BUTTON_SELECTORS.confirm)
          .click()
          .wait("@UpdateCustomer");
        getCustomer(user.id).then(({ isActive }) => {
          expect(isActive).to.be.false;
        });
      });
    });

    it("should update customer", () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;
      const updatedName = `${startsWith}UpdatedName`;
      const email = `${randomName}@example.com`;

      createCustomer(email, randomName, address, true).then(({ user }) => {
        cy.visit(customerDetailsUrl(user.id))
          .get(CUSTOMER_DETAILS.nameInput)
          .clearAndType(updatedName)
          .get(CUSTOMER_DETAILS.lastNameInput)
          .clearAndType(updatedName)
          .get(CUSTOMER_DETAILS.noteInput)
          .clearAndType(updatedName)
          .get(CUSTOMER_DETAILS.emailInput)
          .clearAndType(`${updatedName}@example.com`)
          .addAliasToGraphRequest("UpdateCustomer")
          .get(BUTTON_SELECTORS.confirm)
          .click()
          .wait("@UpdateCustomer");
        getCustomer(user.id).then(user => {
          chai
            .softExpect(user.firstName, "Expect correct first name")
            .to.eq(updatedName);
          chai
            .softExpect(user.lastName, "Expect correct last name")
            .to.eq(updatedName);
          chai
            .softExpect(user.email, "Expect correct email")
            .to.eq(`${updatedName}@example.com`);
          chai.softExpect(user.note, "Expect correct note").to.eq(updatedName);
        });
      });
    });
  });
});
