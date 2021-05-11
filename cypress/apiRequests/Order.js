import { getDefaultAddress } from "./utils/Utils";

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
    orderLinesCreate(id:"${orderId}", input:{
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

export function createDraftOrder(
  customerId,
  shippingMethodId,
  channelId,
  address
) {
  const mutation = `mutation{
    draftOrderCreate(input:{
      user:"${customerId}"
      shippingMethod:"${shippingMethodId}"
      channel: "${channelId}"
      ${getDefaultAddress(address, "shippingAddress")}
      ${getDefaultAddress(address, "billingAddress")}
    }){
      orderErrors{
        message
      }
      order{
        id
        number
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.draftOrderCreate.order");
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
export function getOrder(orderId) {
  const query = `query getOrder{
    order(id:"${orderId}"){
      status
      paymentStatus
      isShippingRequired
      shippingMethod{
        id
      }
    }
  }`;
  cy.sendRequestWithQuery(query).its("body.data.order");
}
