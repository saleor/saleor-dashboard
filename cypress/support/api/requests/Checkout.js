import {
  getDefaultAddress,
  getPaymentDataLine,
  getValueWithDefault,
  getVariantsLines,
} from "./utils/Utils";

export function createCheckout({
  channelSlug,
  email,
  productQuantity = 1,
  variantsList,
  address,
  billingAddress,
  auth = "auth",
  returnAvailableCollectionPoints = false,
}) {
  const lines = getVariantsLines(variantsList, productQuantity);
  const shippingAddress = getDefaultAddress(address, "shippingAddress");
  const billingAddressLines = getDefaultAddress(
    billingAddress,
    "billingAddress",
  );

  const availableCollectionPointsLines = getValueWithDefault(
    returnAvailableCollectionPoints,
    `availableCollectionPoints{
    id
    name
    clickAndCollectOption
    isPrivate
  }`,
  );

  const emailLine = getValueWithDefault(email, `email: "${email}"`);
  const mutation = `mutation{
    checkoutCreate(input:{
      channel:"${channelSlug}"
      ${emailLine}
      lines: [${lines.join()}]
      ${shippingAddress}
      ${billingAddressLines}
    }){
      errors{
        field
        message
      }
      created
      checkout{
        token
        id
        token
        shippingMethods{
          name
          id
        }
        lines{
          variant{
            id
            pricing{
              onSale
              price{
                gross{
                  amount
                }
              }
            }
          }
        }
        ${availableCollectionPointsLines}
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation, auth)
    .its("body.data.checkoutCreate");
}

export function addShippingMethod(checkoutId, shippingMethodId) {
  const mutation = `mutation{
    checkoutShippingMethodUpdate(checkoutId:"${checkoutId}",
    shippingMethodId:"${shippingMethodId}"){
      errors{
      	message
        field
    	}
    	checkout{
        id
        shippingMethod{
          id
          name
        }
     		totalPrice{
        	gross{
         	 amount
        	}
      	}
    	}
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.checkoutShippingMethodUpdate");
}

export function deliveryMethodUpdate(deliveryMethodId, checkoutToken) {
  const mutation = `mutation{
    checkoutDeliveryMethodUpdate(deliveryMethodId:"${deliveryMethodId}", token:"${checkoutToken}"){
      errors{
        field
        message
      }
    }
  }`;
  cy.sendRequestWithQuery(mutation);
}

export function addPayment({ checkoutId, gateway, token, amount }) {
  const tokenLine = getValueWithDefault(token, `token:"${token}"`);
  const amountLine = getValueWithDefault(amount, `amount: ${amount}`);
  const mutation = `mutation{
    checkoutPaymentCreate(checkoutId:"${checkoutId}",
    input:{
      gateway: "${gateway}"
      ${tokenLine}
      ${amountLine}
      returnUrl: "https://qa.storefront.staging.saleor.cloud/checkout/payment-confirm"
    }){
      errors{
        field
        message
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.checkoutPaymentCreate");
}

export function completeCheckout(checkoutId, paymentData) {
  const paymentDataLine = getPaymentDataLine(paymentData);
  const mutation = `mutation{
    checkoutComplete(checkoutId:"${checkoutId}" ${paymentDataLine}){
      order{
        userEmail
        id
        lines{
          id
        }
        paymentStatus
        total{
          gross{
            amount
          }
        }
      }
      confirmationNeeded
      confirmationData
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.checkoutComplete");
}

export function addVoucher(checkoutId, voucherCode) {
  const mutation = `mutation addVoucher{
    checkoutAddPromoCode(checkoutId:"${checkoutId}",
      promoCode:"${voucherCode}"
    ){
      errors{
        field
        message
      }
      checkout{
        id
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
      errors{
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
      errors{
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
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function addProductsToCheckout(
  checkoutId,
  variantsList,
  productQuantity,
) {
  const lines = getVariantsLines(variantsList, productQuantity);
  const mutation = `mutation{
    checkoutLinesUpdate(checkoutId:"${checkoutId}" lines:[${lines.join()}]){
      checkout{
        id
        shippingMethods{
          name
        }
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.checkoutLinesUpdate");
}

export function getCheckout(token) {
  const query = `query{
    checkout(token:"${token}"){
      token
      id
      token
      shippingMethods{
        name
        id
      }
      lines{
        variant{
          id
          pricing{
            onSale
            price{
              gross{
                amount
              }
            }
          }
        }
      } 
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.checkout");
}

export function orderCreateFromCheckout(
  checkoutId,
  token,
  removeCheckoutFlag = true,
) {
  const mutation = `mutation {
    orderCreateFromCheckout(id: "${checkoutId}", removeCheckout: ${removeCheckoutFlag})
    {
          order{
              id
          }
          errors{
              field
              message
          }
      }
  }`;
  return cy
    .sendRequestWithQuery(mutation, token)
    .its("body.data.orderCreateFromCheckout.order");
}
