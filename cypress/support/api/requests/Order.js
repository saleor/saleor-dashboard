import { getDefaultAddress, getValueWithDefault } from "./utils/Utils";

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

export function updateOrdersSettings(automaticallyConfirmAllNewOrders = true) {
  const mutation = `mutation{
    orderSettingsUpdate(input:{
      automaticallyConfirmAllNewOrders: ${automaticallyConfirmAllNewOrders}
    }){
      errors{
        field
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

export function createDraftOrder({
  customerId,
  shippingMethodId,
  channelId,
  address
}) {
  const user = getValueWithDefault(customerId, `user:"${customerId}"`);
  const shippingMethod = getValueWithDefault(
    shippingMethodId,
    `shippingMethod:"${shippingMethodId}"`
  );

  const mutation = `mutation{
    draftOrderCreate(input:{
      ${user}
      ${shippingMethod}
      channelId: "${channelId}"
      ${getDefaultAddress(address, "shippingAddress")}
      ${getDefaultAddress(address, "billingAddress")}
    }){
      errors{
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
        number
        lines{
          id
        }
      }
      orderErrors{
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.draftOrderComplete");
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
      metadata{
        key
        value
      }
      privateMetadata{
        key
        value
      }
    }
  }`;
  cy.sendRequestWithQuery(query).its("body.data.order");
}

export function fulfillOrder({ orderId, warehouse, quantity, linesId }) {
  const lines = linesId.reduce((lines, lineId) => {
    const line = `{orderLineId:"${lineId.id}"
      stocks:{
        quantity:${quantity}
        warehouse:"${warehouse}"
      }
    }`;
    return lines + line;
  }, "");
  const mutation = `mutation fulfill{
  orderFulfill(order:"${orderId}" input:{
    lines:[${lines}]
  }){
    errors{
      field
      message
    }
    order{
      id
      number
    }
  }
}`;
  return cy.sendRequestWithQuery(mutation).its("body.data.orderFulfill");
}
