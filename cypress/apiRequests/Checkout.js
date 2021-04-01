import { getDefaultAddress } from "./utils/Utils";
export function createCheckout({
  channelSlug,
  email,
  productQuantity = 1,
  variantsList,
  address,
  auth = "auth"
}) {
  const lines = variantsList.map(
    variant => `{quantity:${productQuantity}
                    variantId:"${variant.id}"}`
  );
  const shippingAddress = getDefaultAddress(address, "shippingAddress");

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
