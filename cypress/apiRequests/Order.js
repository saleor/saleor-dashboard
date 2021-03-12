export function markOrderAsPaid(orderId) {
  const mutation = `mutation{
    orderMarkAsPaid(id:"${orderId}"){
      orderErrors{
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function addProductToOrder(orderId, variantId, quantity = 1) {
  const mutation = `mutation{
    draftOrderLinesCreate(id:"${orderId}", input:{
      quantity:${quantity}
      variantId: "${variantId}"
    }){
      orderErrors{
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function createDraftOrder(customerId, shippingMethodId, channelId) {
  const mutation = `mutation{
    draftOrderCreate(input:{
      user:"${customerId}"
      shippingMethod:"${shippingMethodId}"
      channel: "${channelId}"
    }){
      orderErrors{
        message
      }
      order{
        id
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
export function completeOrder(orderId) {
  const mutation = `mutation{
    draftOrderComplete(id:"${orderId}"){
      order{
        id
      }
      orderErrors{
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
