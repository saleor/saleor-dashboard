import { getValueWithDefault } from "./utils/Utils";

export function createCheckout({
  channelSlug,
  email,
  productQuantity,
  variantsList,
  address,
  auth = "auth"
}) {
  const lines = variantsList.map(
    variant => `{quantity:${productQuantity}
                    variantId:"${variant.id}"}`
  );
  const shippingAddress = getValueWithDefault(
    address,
    `
  shippingAddress:{
    city: "${address.city}" 
    companyName: "${address.companyName}"
    country: ${address.country}
    countryArea: "${address.countryArea}"
    firstName: "Test"
    lastName: "Test"
    phone: "${address.phone}"
    postalCode: "${address.postalCode}"
    streetAddress1: "${address.streetAddress1}"
    streetAddress2: "${address.streetAddress2}"
  }`
  );

  const mutation = `mutation{
    checkoutCreate(input:{
      channel:"${channelSlug}"
      email:"${email}"
      lines: [${lines.join()}]
      ${shippingAddress}
    }){
      checkoutErrors{
        field
        message
      }
      created
      checkout{
        id
        availableShippingMethods{
          name
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation, auth);
}
export function addShippingMethod(checkoutId, shippingMethodId) {
  const mutation = `mutation{
    checkoutShippingMethodUpdate(checkoutId:"${checkoutId}",
    shippingMethodId:"${shippingMethodId}"){
      checkoutErrors{
        message
        field
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
export function addPayment(checkoutId, gateway, token) {
  const mutation = `mutation{
    checkoutPaymentCreate(checkoutId:"${checkoutId}",
    input:{
      gateway: "${gateway}"
      token:"${token}"
    }){
      paymentErrors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
export function completeCheckout(checkoutId) {
  const mutation = `mutation{
    checkoutComplete(checkoutId:"${checkoutId}"){
      order{
        id
      }
      confirmationNeeded
      confirmationData
      checkoutErrors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
