import { urlList } from "../url/urlList";
import { getDefaultAddress } from "./utils/Utils";
export function createCustomer(email, customerName, address, isActive = false) {
  const mutation = `
  mutation{
    customerCreate(input:{
      firstName: "${customerName}"
      lastName: "${customerName}"
      email: "${email}"
      isActive: ${isActive}
      ${getDefaultAddress(address, "defaultBillingAddress")}
      ${getDefaultAddress(address, "defaultShippingAddress")}
    }){
      user{
        id
        email
      }
      accountErrors{
        code
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
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
      accountErrors{
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
