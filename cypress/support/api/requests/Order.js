import { getDefaultAddress, getValueWithDefault } from "./utils/Utils";

export function markOrderAsPaid(orderId) {
  const mutation = `mutation{
    orderMarkAsPaid(id:"${orderId}"){
      errors{
        message
      }
      order{
        id
        number
        lines{
          id
        }
        total{
          gross{
            amount
            currency
          }
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.orderMarkAsPaid");
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
      order{
        shippingMethods{
          id
          name
        }
      }
      errors{
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.orderLinesCreate");
}

export function createDraftOrder({ customerId, channelId, address }) {
  const user = getValueWithDefault(customerId, `user:"${customerId}"`);

  const mutation = `mutation{
    draftOrderCreate(input:{
      ${user}
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
        id
        shippingMethods{
          id
          name
        }
        paymentStatus
        totalBalance{
          amount
        }
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
        total{
          gross{
            amount
            currency
          }
        }
      }
      errors{
        message
        field
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.draftOrderComplete");
}

export function getOrder(orderId) {
  const query = `query getOrder{
    order(id:"${orderId}"){
      status
      token
      paymentStatus
      isShippingRequired
      transactions{
        id
      }
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
      shippingAddress{
        companyName
        streetAddress1
        streetAddress2
        city
        postalCode
        countryArea
        phone
      }
      billingAddress{
        companyName
        streetAddress1
        streetAddress2
        city
        postalCode
        countryArea
        phone
      }
      fulfillments{
        id
        metadata{
          key
          value
        }
        privateMetadata{
          key
          value
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.order");
}
export function getDraftOrdersList() {
  const query = `query OrderDraftList{
    draftOrders(first:100){
      edges{
        node{
          id
          number
          errors{
            message
          }
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.draftOrders");
}
export function getOrdersList() {
  const query = `query OrderList{
    orders(first:100){
      edges{
        node{
          id
          number
          errors{
            message
          }
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.orders");
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

export function addShippingMethod(orderId, shippingMethodId) {
  const mutation = `mutation{
    orderUpdateShipping(order:"${orderId}", input:{
      shippingMethod:"${shippingMethodId}"
    }){
      order{
        id
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.orderUpdateShipping");
}
