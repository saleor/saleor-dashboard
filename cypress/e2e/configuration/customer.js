/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { CUSTOMER_DETAILS } from "../../elements/customer/customer-details";
import { CUSTOMERS_LIST } from "../../elements/customer/customers-list";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { customerDetailsUrl, urlList } from "../../fixtures/urlList";
import {
  addressCreate,
  createCustomer,
  deleteCustomersStartsWith,
  getCustomer,
} from "../../support/api/requests/Customer";

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

  it(
    "should create customer. TC: SALEOR_1201",
    { tags: ["@customer", "@allEnv", "@stable"] },
    () => {
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
          expect(customer.firstName, "Expect correct first name").to.eq(
            randomName,
          );
          expect(customer.lastName, "Expect correct last name").to.eq(
            randomName,
          );
          expect(customer.email, "Expect correct email").to.eq(email);
          expect(customer.note, "Expect correct note").to.eq(note);
          cy.expectCorrectFullAddress(customer.addresses[0], address);
        });
    },
  );

  it(
    "should add address to customer. TC: SALEOR_1204",
    { tags: ["@customer", "@allEnv", "@stable"] },
    () => {
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
    },
  );

  it(
    "should remove address from customer. TC: SALEOR_1205",
    { tags: ["@customer", "@allEnv", "@stable"] },
    () => {
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
    },
  );

  it(
    "should set address as default. TC: SALEOR_1206",
    { tags: ["@customer", "@allEnv", "@stable"] },
    () => {
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
          expect(addresses[0].isDefaultShippingAddress).to.eq(true);
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
    },
  );

  it(
    "should update address. TC: SALEOR_1208",
    { tags: ["@customer", "@allEnv", "@stable"] },
    () => {
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
              element.city.toUpperCase() === secondAddress.city.toUpperCase(),
          );
          cy.expectCorrectFullAddress(addedAddress, secondAddress);
        });
      });
    },
  );

  it(
    "should delete customer. TC: SALEOR_1203",
    { tags: ["@customer", "@allEnv", "@stable"] },
    () => {
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
    },
  );

  it(
    "should deactivate customer. TC: SALEOR_1209",
    { tags: ["@customer", "@allEnv", "@stable"] },
    () => {
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
    },
  );

  it(
    "should update customer. TC: SALEOR_1202",
    { tags: ["@customer", "@allEnv", "@stable"] },
    () => {
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
          expect(user.firstName, "Expect correct first name").to.eq(
            updatedName,
          );
          expect(user.lastName, "Expect correct last name").to.eq(updatedName);
          expect(user.email, "Expect correct email").to.eq(
            `${updatedName}@example.com`,
          );
          expect(user.note, "Expect correct note").to.eq(updatedName);
        });
      });
    },
  );
});
