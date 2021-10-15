import { stripeConfirmationUrl, urlList } from "../../../fixtures/urlList";

// TODO - remove secretKey and add in github to secrets
const stripeAuthBearer = `Bearer `;
const stripePublicKey = "";

export function getPaymentMethodStripeId({
  cardNumber,
  cvc,
  expMonth,
  expYear
}) {
  return cy.request({
    url: urlList.stripeApiPaymentMethods,
    method: "POST",
    form: true,
    body: {
      type: "card",
      "card[number]": cardNumber,
      "card[cvc]": cvc,
      "card[exp_month]": expMonth,
      "card[exp_year]": expYear,
      pasted_fields: "number",
      key: stripePublicKey
    },
    headers: {
      Authorization: stripeAuthBearer
    }
  });
}

export function sendConfirmationToStripe(paymentMethodId, confirmationId) {
  return cy.request({
    method: "POST",
    url: stripeConfirmationUrl(confirmationId),
    form: true,
    headers: {
      Authorization: stripeAuthBearer
    },
    body: {
      payment_method: paymentMethodId,
      use_stripe_sdk: "true",
      webauthn_uvpa_available: "true",
      spc_eligible: "false",
      key: stripePublicKey
    }
  });
}
