import {
  getDefaultAddress,
  getDefaultAddressWithoutType,
  getValueWithDefault
} from "./utils/Utils";

export function createCustomer(email, customerName, address, isActive = false) {
  const addressesLines = getValueWithDefault(
    address,
    `${getDefaultAddress(address, "defaultBillingAddress")}
    ${getDefaultAddress(address, "defaultShippingAddress")}`
  );
  const mutation = `
  mutation{
    customerCreate(input:{
      firstName: "${customerName}"
      lastName: "${customerName}"
      email: "${email}"
      isActive: ${isActive}
      ${addressesLines}
    }){
      user{
        id
        email
      }
      errors{
        code
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.customerCreate");
}

export function deleteCustomersStartsWith(startsWith) {
  getCustomers(startsWith).then(resp => {
    if (resp.body.data.customers) {
      const customers = resp.body.data.customers.edges;
      customers.forEach(element => {
        if (element.node.email.includes(startsWith)) {
          deleteCustomer(element.node.id);
        }
      });
    }
  });
}

export function deleteCustomer(customerId) {
  const mutation = `mutation{
    customerDelete(id:"${customerId}"){
      errors{
        code
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function getCustomers(startsWith) {
  const query = `query{
    customers(first:100, filter: {
      search: "${startsWith}"
    }){
      edges{
        node{
          id
          email
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query);
}

export function customerRegistration({
  email,
  password = Cypress.env("USER_PASSWORD"),
  channel
}) {
  const mutation = `mutation{
    accountRegister(input:{
      email:"${email}",
      password:"${password}"
      channel:"${channel}"
      redirectUrl: "${Cypress.config().baseUrl}account-confirm"
    }){
      requiresConfirmation
      user{
        id
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.accountRegister");
}

export function requestPasswordReset(email, channel) {
  const mutation = `mutation{
    requestPasswordReset(channel:"${channel}" email:"${email}", redirectUrl:"${
    Cypress.config().baseUrl
  }password-reset"){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function confirmAccount(email, token) {
  const mutation = `mutation{
    confirmAccount(email:"${email}", token:"${token}"){
      user{
        email
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.confirmAccount");
}

export function getCustomer(customerId) {
  const query = `query{
    user(id:"${customerId}"){
      id
      email
      firstName
      lastName
      isStaff
      isActive
      note
      addresses{
        firstName
        lastName
        companyName
        streetAddress1
        streetAddress2
        city
        cityArea
        postalCode
        country{
          code
        }
        countryArea
        phone
        isDefaultShippingAddress
        isDefaultBillingAddress
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.user");
}

export function addressCreate(userId, address) {
  const mutation = `mutation{
    addressCreate(userId:"${userId}" input:{
      ${getDefaultAddressWithoutType(address)}
    }){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
