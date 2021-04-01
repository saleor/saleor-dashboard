export function createCheckout(
  channelSlug,
  email,
  productQuantity,
  variantsList
) {
  const lines = variantsList.map(
    variant => `{quantity:${productQuantity}
                    variantId:"${variant.id}"}`
  );
  const mutation = `mutation{
    checkoutCreate(input:{
      channel:"${channelSlug}"
      email:"${email}"
      lines: [${lines.join()}]
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
  return cy.sendRequestWithQuery(mutation);
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
