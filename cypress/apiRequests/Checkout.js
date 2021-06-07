import {
  getDefaultAddress,
  getPaymentDataLine,
  getValueWithDefault,
  getVariantsLines
} from "./utils/Utils";

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
      errors{
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

export function addPayment({ checkoutId, gateway, token, amount }) {
  const tokenLine = getValueWithDefault(token, `token:"${token}"`);
  const amountLine = getValueWithDefault(amount, `amount: ${amount}`);
  const mutation = `mutation{
    checkoutPaymentCreate(checkoutId:"${checkoutId}",
    input:{
      gateway: "${gateway}"
      ${tokenLine}
      ${amountLine}
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

export function completeCheckout(checkoutId, paymentData) {
  const paymentDataLine = getPaymentDataLine(paymentData);
  const mutation = `mutation{
    checkoutComplete(checkoutId:"${checkoutId}" ${paymentDataLine}){
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
  return cy.sendRequestWithQuery(mutation).its("body.data.checkoutComplete");
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

export function addProductsToCheckout(
  checkoutId,
  variantsList,
  productQuantity
) {
  const lines = getVariantsLines(variantsList, productQuantity);
  const mutation = `mutation{
    checkoutLinesUpdate(checkoutId:"${checkoutId}" lines:[${lines.join()}]){
      checkout{
        id
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.checkoutLinesUpdate");
}
