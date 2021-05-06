import { getDefaultAddress, getVariantsLines } from "./utils/Utils";

export function createCheckout({
  channelSlug,
  email,
  productQuantity = 1,
  variantsList,
  address,
  billingAddress,
  auth = "auth"
}) {
  const lines = getVariantsLines(variantsList, productQuantity);
  const shippingAddress = getDefaultAddress(address, "shippingAddress");
  const billingAddressLines = getDefaultAddress(
    billingAddress,
    "billingAddress"
  );

  const mutation = `mutation{
    checkoutCreate(input:{
      channel:"${channelSlug}"
      email:"${email}"
      lines: [${lines.join()}]
      ${shippingAddress}
      ${billingAddressLines}
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
  return cy
    .sendRequestWithQuery(mutation, auth)
    .its("body.data.checkoutCreate.checkout");
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
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.checkoutPaymentCreate");
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
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.checkoutComplete.order");
}

export function addVoucher(checkoutId, voucherCode) {
  const mutation = `mutation addVoucher{
    checkoutAddPromoCode(checkoutId:"${checkoutId}",
      promoCode:"${voucherCode}"
    ){
      checkoutErrors{
        field
        message
      }
      checkout{
        totalPrice{
          gross{
            amount
          }
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function checkoutVariantsUpdate(checkoutId, variantsList) {
  const lines = getVariantsLines(variantsList, 1);
  const mutation = `mutation{
    checkoutLinesUpdate(checkoutId:"${checkoutId}", 
    lines: [${lines.join()}]){
      checkoutErrors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function checkoutShippingMethodUpdate(checkoutId, shippingMethodId) {
  const mutation = `mutation{
    checkoutShippingMethodUpdate(checkoutId:"${checkoutId}" shippingMethodId:"${shippingMethodId}"){
      checkoutErrors{
        field
        message
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.checkoutShippingMethodUpdate");
}

export function checkoutShippingAddressUpdate(checkoutId, address) {
  const shippingAddress = getDefaultAddress(address, "shippingAddress");
  const mutation = `mutation{
    checkoutShippingAddressUpdate(checkoutId:"${checkoutId}", 
    ${shippingAddress}
    ){
      checkoutErrors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
